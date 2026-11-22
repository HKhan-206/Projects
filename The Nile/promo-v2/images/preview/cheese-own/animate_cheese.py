"""Animates the supplied melted-cheese image (cheese-drip-raw.png) without AI, for the promo screen.

One 12 s loop per food slide (24 fps), see-through VP9 WebM, 1080 px wide band:
  0.3 - 1.3 s  the cheese band slides down from the top edge
  1.2 - 6.5 s  each drip grows out of the band to its full length, at its own pace
  6.5 - 9.6 s  drips keep stretching very slightly and wobble gently
  9.6 - 11.4 s drips are drawn back up into the band, at their own pace
 11.0 - 11.9 s the band is drawn back up out of the top edge
The drips are moved, never squashed: each drip slides out of the band like liquid running down,
so the rounded tips keep the exact shape from the image. A soft shadow follows the cheese.

Usage: python3 animate_cheese.py <cheese.png> <out.webm>
"""
import math
import subprocess
import sys

import cv2
import numpy as np

SRC, DST = sys.argv[1], sys.argv[2]
W, BAND, FPS, DUR = 1080, 560, 24, 12.0

img = cv2.imread(SRC, cv2.IMREAD_UNCHANGED)                      # BGRA, transparent background
img = cv2.resize(img, (W, round(img.shape[0] * W / img.shape[1])), interpolation=cv2.INTER_AREA)
img = img[:BAND].astype(np.float32)
alpha = img[..., 3] / 255.0
# premultiply so warping never drags dark/transparent colour into the cheese edges
pre = img.copy(); pre[..., :3] *= alpha[..., None]

# --- where the band ends and how long each drip is -------------------------------------------------
solid = alpha > 0.5
first_clear = np.array([np.argmax(~solid[:, x]) if (~solid[:, x]).any() else BAND for x in range(W)], np.float32)
# band underside = first_clear with the narrow drip spikes removed (1-D opening)
k = 140
er = np.array([first_clear[max(0, x - k // 2):x + k // 2].min() for x in range(W)])
band_y = np.array([er[max(0, x - k // 2):x + k // 2].max() for x in range(W)])
band_y = cv2.GaussianBlur(band_y.reshape(1, -1), (0, 0), 25).ravel()
bottom = np.array([np.where(alpha[:, x] > 0.1)[0].max() if (alpha[:, x] > 0.1).any() else 0 for x in range(W)], np.float32)
drip_len = np.clip(bottom - band_y, 0, None)
# one value across the whole width of each drip, so a drip moves as one piece
drip_len = np.array([drip_len[max(0, x - 45):x + 45].max() for x in range(W)])
drip_len = cv2.GaussianBlur(drip_len.reshape(1, -1), (0, 0), 6).ravel()


def smooth_noise(seed, wavelength):
    rng = np.random.default_rng(seed)
    xs = np.arange(W)
    v = np.zeros(W)
    for i in range(3):
        wl = wavelength * (0.7 + 0.6 * rng.random())
        v += np.sin(2 * np.pi * xs / wl + rng.random() * 6.28) / (i + 1)
    return (v - v.min()) / (v.max() - v.min())


n1, n2, n3, n4 = (smooth_noise(s, 520) for s in (1, 2, 3, 4))
grow_start = 1.2 + 1.0 * n1          # when each drip starts to run
grow_time = 3.6 + 1.8 * n2           # how long it takes to reach full length
back_start = 9.6 + 0.6 * n3          # when it starts to be drawn back up
back_time = 1.0 + 0.5 * n4
wob_period = 1.7 + 0.9 * n2
wob_phase = 6.28 * n3


def ease(u):
    u = np.clip(u, 0, 1)
    return u * u * (3 - 2 * u)


yy, xx = np.mgrid[0:BAND, 0:W].astype(np.float32)
# how strongly each row follows the drip motion: 0 inside the band, 1 a little below its underside
ramp = np.clip((yy - (band_y[None, :] - 6)) / 34.0, 0, 1)
ramp = ramp * ramp * (3 - 2 * ramp)

enc = subprocess.Popen(
    ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgra", "-s", f"{W}x{BAND}", "-r", str(FPS), "-i", "-",
     "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "12", "-row-mt", "1", "-deadline", "good", "-an", DST],
    stdin=subprocess.PIPE)

frames = int(round(DUR * FPS))
for n in range(frames):
    t = n / FPS
    out_g = ease((t - grow_start) / grow_time)                      # 0 -> 1 as each drip runs down
    back = ease((t - back_start) / back_time)                       # 0 -> 1 as it is drawn back up
    extra = 18 * ease((t - 6.0) / 3.5)                              # slow extra stretch while it holds
    wob = 5 * np.sin(2 * np.pi * t / wob_period + wob_phase) * ease((t - 4.0) / 2.0)
    shown = np.clip(out_g * (1 - back), 0, 1)
    # how far up the drip is pulled into the band (px); negative = a touch longer than the image
    pull = (1 - shown) * (drip_len + 12) - shown * (extra + wob)
    # whole band: slides in at the start, is drawn up and out at the end
    band_shift = -(band_y.max() + 40) * (1 - ease((t - 0.3) / 1.0)) - (band_y.max() + 40) * ease((t - 11.0) / 0.9)

    map_y = yy + pull[None, :] * ramp - band_shift
    f = cv2.remap(pre, xx, map_y.astype(np.float32), cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
    a = np.clip(f[..., 3] / 255.0, 0, 1)
    rgb = f[..., :3] / np.maximum(a[..., None], 1e-4)

    sh = np.zeros_like(a); sh[14:] = a[:-14]
    sh = cv2.GaussianBlur(sh, (0, 0), 10) * 0.30
    A = a + sh * (1 - a)
    out_rgb = (rgb * a[..., None]) / np.maximum(A[..., None], 1e-4)
    enc.stdin.write(np.dstack([out_rgb, A * 255]).clip(0, 255).astype(np.uint8).tobytes())

enc.stdin.close()
enc.wait()
print(f"done: {frames} frames, {W}x{BAND} -> {DST}  (drip lengths up to {drip_len.max():.0f}px, band underside ~{band_y.mean():.0f}px)")
