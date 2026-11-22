"""Cuts the melted cheese out of a Kling clip shot on flat blue, for the promo screen's top drip.

Per frame:
  * finds the cheese (bright in red; the blue backdrop has almost none)
  * smooths its outline: fills small holes, rounds off blocky notches and stepped edges
  * shaves ~2 px off the edge to drop the thin dark line Kling draws where cheese meets blue
  * gives the edge a slight soft fade, and colours any filled-in pixels from the nearby cheese
  * adds a soft shadow that moves with the cheese
Keeps the top band only, 1080 px wide, natural speed, light compression.
Output: a see-through VP9 WebM (yuva420p) for the browser.

Usage: python3 key_cheese.py <input.mp4> <output.webm> [band_height=760] [crf=12]
"""
import subprocess
import sys

import cv2
import numpy as np

SRC, DST = sys.argv[1], sys.argv[2]
BAND = int(sys.argv[3]) if len(sys.argv) > 3 else 760
CRF = sys.argv[4] if len(sys.argv) > 4 else "12"
W = 1080
CLOSE = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (31, 31))   # rounds off notches up to ~14 px deep
SHAVE = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))     # ~2 px, removes the dark rim

cap = cv2.VideoCapture(SRC)
fps = cap.get(cv2.CAP_PROP_FPS)
sw = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
scale = W / sw
band_src = int(round(BAND / scale))

enc = subprocess.Popen(
    ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgra", "-s", f"{W}x{BAND}", "-r", str(fps), "-i", "-",
     "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", CRF, "-row-mt", "1", "-deadline", "good", "-an", DST],
    stdin=subprocess.PIPE)


def fill_holes(m):
    """Fill enclosed gaps (holes) in a 0/1 mask."""
    h, w = m.shape
    flood = np.pad(m, 1).copy()
    cv2.floodFill(flood, None, (0, h + 1), 1)          # from a corner below the cheese
    holes = (flood[1:-1, 1:-1] == 0)
    return (m | holes).astype(np.uint8)


n = 0
while True:
    ok, f = cap.read()
    if not ok:
        break
    f = f[:band_src]
    if f.shape[1] != W:
        f = cv2.resize(f, (W, BAND), interpolation=cv2.INTER_AREA)
    f = f.astype(np.float32)

    # raw cheese amount (0..1) from the red channel
    a0 = np.clip((f[..., 2] - 35) / (200 - 35), 0, 1)

    # clean shape: solid mask -> close notches -> fill holes -> shave the dark rim -> soft edge
    m = (a0 > 0.5).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, CLOSE)
    m = fill_holes(m)
    m = cv2.erode(m, SHAVE)
    a = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 1.4)
    a = np.clip((a - 0.15) / 0.7, 0, 1)
    a = a * a * (3 - 2 * a)

    # colour: real cheese where it is solid, otherwise the colour of the nearby solid cheese
    # "solid" = well inside the original cheese, away from Kling's dark edge line (also around holes)
    solid = cv2.erode((a0 > 0.95).astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))).astype(np.float32)
    near = None
    for sig in (3, 8, 20):   # widen the search until every filled-in pixel has real cheese colour to borrow
        num = cv2.GaussianBlur(f * solid[..., None], (0, 0), sig)
        den = cv2.GaussianBlur(solid, (0, 0), sig)[..., None]
        est = num / np.maximum(den, 1e-6)
        near = est if near is None else np.where(near_ok, near, est)
        near_ok = den > 0.05
    t = cv2.GaussianBlur(solid, (0, 0), 1.5)[..., None]   # real pixels inside, borrowed colour near any edge
    col = f * t + near * (1 - t)
    col[..., 0] = np.minimum(col[..., 0], (col[..., 1] + col[..., 2]) * 0.35)   # no blue spill

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
