"""Cuts the melted cheese out of a Kling clip shot on flat blue, for the promo screen's top drip.

Keeps the top band only, at 1080 px wide, natural speed. Adds a soft shadow that moves with the cheese.
Output: a see-through VP9 WebM (yuva420p) for the browser.

Usage: python3 key_cheese.py <input.mp4> <output.webm> [band_height=760] [crf=18]
"""
import subprocess
import sys

import cv2
import numpy as np

SRC, DST = sys.argv[1], sys.argv[2]
BAND = int(sys.argv[3]) if len(sys.argv) > 3 else 760
CRF = sys.argv[4] if len(sys.argv) > 4 else "18"
W = 1080

cap = cv2.VideoCapture(SRC)
fps = cap.get(cv2.CAP_PROP_FPS)
sw = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
scale = W / sw
band_src = int(round(BAND / scale))

enc = subprocess.Popen(
    ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgra", "-s", f"{W}x{BAND}", "-r", str(fps), "-i", "-",
     "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", CRF, "-row-mt", "1", "-deadline", "good", "-an", DST],
    stdin=subprocess.PIPE)

n = 0
while True:
    ok, f = cap.read()
    if not ok:
        break
    f = f[:band_src]
    if f.shape[1] != W:
        f = cv2.resize(f, (W, BAND), interpolation=cv2.INTER_AREA)   # 4K -> 1080 keeps it crisp
    f = f.astype(np.float32)
    # the cheese is bright in red, the blue backdrop has almost none
    a = np.clip((f[..., 2] - 35) / (200 - 35), 0, 1)
    a = a * a * (3 - 2 * a)
    # edge colour from nearby solid cheese, so no blue fringe or dark outline
    solid = (a > 0.95).astype(np.float32)
    num = cv2.GaussianBlur(f * solid[..., None], (0, 0), 2.5)
    den = cv2.GaussianBlur(solid, (0, 0), 2.5)[..., None]
    near = num / np.maximum(den, 1e-4)
    t = np.clip((a - 0.8) / 0.2, 0, 1)[..., None]
    col = np.where(den > 1e-3, f * t + near * (1 - t), f)
    col[..., 0] = np.minimum(col[..., 0], (col[..., 1] + col[..., 2]) * 0.35)
    # soft shadow just below the cheese, moving with it
    sh = np.zeros_like(a)
    sh[14:] = a[:-14]
    sh = cv2.GaussianBlur(sh, (0, 0), 10) * 0.30
    A = a + sh * (1 - a)
    rgb = (col * a[..., None]) / np.maximum(A[..., None], 1e-4)
    enc.stdin.write(np.dstack([rgb, A * 255]).clip(0, 255).astype(np.uint8).tobytes())
    n += 1

enc.stdin.close()
enc.wait()
print(f"done: {n} frames, {W}x{BAND} -> {DST}")
