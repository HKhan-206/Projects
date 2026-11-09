"""Adds a gentle up-and-down bob to the milkshake and the strawberries.

v2 (smoother, no distortion):
  * every item is moved as a solid piece: the cup uses a traced outline (cup-mask.png), each
    strawberry a generous ellipse that fully covers it (leaves included)
  * only the liquid in a soft band around each item flexes; inside an item nothing stretches
  * every pixel follows one item only (neighbouring items never pull against each other)
  * the bob starts while things are still settling, so the motion carries straight on
  * smaller and slower than v1
  * the title area is locked and never moves

Usage:  python3 bob.py output/kling4-v3-raw.mp4 output/kling4-v3-bob.mp4
"""
import math
import subprocess
import sys

import cv2
import numpy as np

SRC, DST = sys.argv[1], sys.argv[2]
W, H = 1080, 1920
START, FULL = 5.4, 7.0           # milkshake: bob eases in over this window, overlapping its landing (~7.0 s)
BERRY_START, BERRY_FULL = 4.5, 4.85  # strawberries: start at 4.5 s and reach their full (gentle) bob almost at once
FEATHER = 60                      # px of liquid around each item that flexes (wider for the bigger bob)
CUP_MASK = "source/cup-mask.png"  # traced outline of the cup + straw in its final position

# strawberries: (centre x, centre y, radius x, radius y)  – generous, covering leaves too
BERRIES = [
    (210, 1452, 170, 165),   # bottom-left
    (492, 1600, 100, 105),   # bottom-middle
    (661, 1562, 90, 95),     # bottom-middle 2
    (828, 1735, 140, 115),   # bottom-right
    (1010, 1280, 100, 135),  # right, lower
    (1035, 930, 75, 130),    # right, middle
    (1045, 585, 65, 135),    # right, upper
    (975, 215, 165, 225),    # top-right cluster
    (776, 72, 85, 90),       # top
]
# motion per item: (amplitude px, period s, phase)  – first entry is the cup
MOTION = [(7.0, 3.2, 0.0),
          (5.0, 2.9, 1.1), (5.0, 3.4, 2.3), (5.0, 3.0, 0.6), (5.0, 3.6, 3.4),
          (5.0, 2.8, 4.2), (5.0, 3.3, 5.0), (5.0, 3.1, 1.8), (5.0, 3.5, 2.9), (5.0, 2.9, 5.6)]

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

cores = []
cup = (cv2.imread(CUP_MASK, cv2.IMREAD_GRAYSCALE) > 160).astype(np.uint8)
cores.append(cv2.dilate(cup, np.ones((13, 13), np.uint8)))
for cx, cy, rx, ry in BERRIES:
    m = np.zeros((H, W), np.uint8)
    cv2.ellipse(m, (cx, cy), (rx, ry), 0, 0, 360, 1, -1)
    cores.append(m)

# the title must never move
title = np.zeros((H, W), np.uint8); title[300:540, 30:680] = 1

weights = []
for c in cores:
    c = c * (1 - title)
    d = cv2.distanceTransform((1 - c).astype(np.uint8), cv2.DIST_L2, 5)   # distance outside the item
    t = np.clip(1 - d / FEATHER, 0, 1)
    weights.append(t * t * (3 - 2 * t))
weights = np.stack(weights)                                   # (items, H, W)
inside = np.stack([c * (1 - title) for c in cores]).astype(bool)
any_inside = inside.any(0)
# inside an item: that item alone; in the soft band: blend of nearby items' motions
owner_w = np.where(any_inside[None], inside.astype(np.float32), weights)
norm = owner_w.sum(0); norm[norm == 0] = 1
share = owner_w / norm                                         # how much each item steers a pixel
strength = np.where(any_inside, 1.0, weights.max(0))           # 1 inside items, fading out in the band
tkeep = cv2.GaussianBlur(title.astype(np.float32), (0, 0), 12)
strength = strength * (1 - np.clip(tkeep * 1.5, 0, 1))

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
    if t >= BERRY_START:
        def ease(t0, t1):
            r = min(1.0, max(0.0, (t - t0) / (t1 - t0)))
            return r * r * (3 - 2 * r)
        offs = []
        for i, (a, p, ph) in enumerate(MOTION):
            t0, t1 = (START, FULL) if i == 0 else (BERRY_START, BERRY_FULL)
            offs.append(a * ease(t0, t1) * math.sin(2 * math.pi * (t - t0) / p + ph) if t >= t0 else 0.0)
        offs = np.array(offs, np.float32)
        dy = (share * offs[:, None, None]).sum(0) * strength
        frame = cv2.remap(frame, xx, yy + dy, interpolation=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
    enc.stdin.write(frame.tobytes())
    n += 1

enc.stdin.close()
enc.wait()
print(f"done: {n} frames -> {DST}")
