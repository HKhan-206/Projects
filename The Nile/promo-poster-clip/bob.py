"""Adds a gentle up-and-down bob to the milkshake and the strawberries once they have settled.

Each item gets its own soft-edged area; inside it the picture is shifted up/down by a few
pixels on a slow sine wave (each strawberry slightly out of step). The edges blend into the
surrounding liquid, so nothing is cut out. Everything outside these areas is left untouched.

Usage:  python3 bob.py output/kling4-v3-raw.mp4 output/kling4-v3-bob.mp4
"""
import math
import subprocess
import sys

import cv2
import numpy as np

SRC, DST = sys.argv[1], sys.argv[2]
W, H = 1080, 1920
START, FULL = 6.8, 8.0          # bob eases in between these times (items have settled by ~7 s)

# (centre x, centre y, half-width, half-height, amplitude px, period s, phase)
ITEMS = [
    (712, 860, 290, 600, 7.0, 2.6, 0.0),    # milkshake cup + straw
    (205, 1460, 160, 165, 5.0, 2.1, 1.3),   # strawberry bottom-left
    (495, 1600, 105, 100, 4.5, 1.9, 2.4),   # strawberry bottom-middle
    (660, 1570, 90, 95, 4.5, 2.3, 0.7),     # strawberry bottom-middle 2
    (830, 1730, 140, 100, 5.0, 2.0, 3.6),   # strawberry bottom-right
    (1005, 1275, 95, 130, 4.5, 2.4, 4.4),   # strawberry right
    (1030, 930, 70, 135, 4.0, 2.2, 5.2),    # strawberry right, higher
    (1040, 585, 60, 140, 4.0, 2.5, 2.0),    # strawberry right, upper
    (950, 210, 150, 210, 4.5, 2.2, 3.0),    # strawberries top-right cluster
    (780, 75, 85, 85, 4.0, 1.9, 5.8),       # strawberry top
]
FEATHER = 55                    # px of soft blend around each item

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)


def soft_box(cx, cy, hw, hh):
    """1 inside an ellipse-ish box around the item, easing smoothly to 0 over FEATHER px."""
    dx = np.maximum(np.abs(xx - cx) - hw, 0)
    dy = np.maximum(np.abs(yy - cy) - hh, 0)
    d = np.sqrt(dx * dx + dy * dy)
    t = np.clip(1 - d / FEATHER, 0, 1)
    return t * t * (3 - 2 * t)


masks = [soft_box(cx, cy, hw, hh) for cx, cy, hw, hh, *_ in ITEMS]

# the title must never move: switch the bob off over the title area (with a soft edge)
TITLE = (30, 300, 680, 540)      # x0, y0, x1, y1
tx0, ty0, tx1, ty1 = TITLE
keep = soft_box((tx0 + tx1) / 2, (ty0 + ty1) / 2, (tx1 - tx0) / 2, (ty1 - ty0) / 2)
masks = [m * (1 - keep) for m in masks]

cap = cv2.VideoCapture(SRC)
fps = cap.get(cv2.CAP_PROP_FPS)
enc = subprocess.Popen(
    ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(fps),
     "-i", "-", "-an", "-c:v", "libx264", "-crf", "12", "-preset", "slow", "-pix_fmt", "yuv420p", DST],
    stdin=subprocess.PIPE)

n = 0
while True:
    ok, frame = cap.read()
    if not ok:
        break
    t = n / fps
    if t >= START:
        ramp = min(1.0, (t - START) / (FULL - START))
        ramp = ramp * ramp * (3 - 2 * ramp)
        dy = np.zeros((H, W), np.float32)
        for m, (_, _, _, _, amp, per, ph) in zip(masks, ITEMS):
            dy += m * (amp * ramp * math.sin(2 * math.pi * (t - START) / per + ph))
        # sample from below to move up (and vice versa)
        frame = cv2.remap(frame, xx, yy + dy, interpolation=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
    enc.stdin.write(frame.tobytes())
    n += 1

enc.stdin.close()
enc.wait()
print(f"done: {n} frames -> {DST}")
