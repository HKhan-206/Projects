"""Puts the original Skittles milkshake photo (unchanged) into the AI poster in place of the AI cup.
Removes the AI cup, its syrup splashes and straw, keeps the title letters on top. Free, no AI.
Usage: python3 composite_real_cup.py
"""
import cv2, numpy as np
from PIL import Image

base = np.array(Image.open('output/skittles-milkshake-poster-v2.png').convert('RGB')); H, W = base.shape[:2]
BG = np.array([2, 183, 217])                       # turquoise background
SCALE, ANGLE, BASE_AT = 1.29, -10.4, (697, 2228)    # size, tilt (clockwise), where the cup base sits on the candy

ph = Image.open('source/skittles-milkshake-original.png').convert('RGBA').crop((192, 13, 830, 1491))
ph = ph.resize((round(ph.width * SCALE), round(ph.height * SCALE)), Image.LANCZOS)
pw, phh = ph.size; rot = ph.rotate(ANGLE, resample=Image.BICUBIC, expand=True)
th = np.radians(-ANGLE); cx, cy = pw / 2, phh / 2; rx, ry = rot.width / 2, rot.height / 2
bx = rx + (pw / 2 - cx) * np.cos(th) - (phh - 1 - cy) * np.sin(th)
by = ry + (pw / 2 - cx) * np.sin(th) + (phh - 1 - cy) * np.cos(th)
ox, oy = round(BASE_AT[0] - bx), round(BASE_AT[1] - by)
layer = np.zeros((H, W, 4), np.uint8)
x0, y0, x1, y1 = max(ox, 0), max(oy, 0), min(ox + rot.width, W), min(oy + rot.height, H)
layer[y0:y1, x0:x1] = np.array(rot)[y0 - oy:y1 - oy, x0 - ox:x1 - ox]
alpha = layer[:, :, 3].astype(np.float32) / 255

# title letters: near-white, neutral pixels in the top area (the pale straw tip is pinkish, so it is excluded)
top = base[:720].astype(int)
letters = (top.min(2) > 165) & ((top.max(2) - top.min(2)) < 40)
letters[600:, 900:1160] = False      # below the title baseline here is the old AI straw, not lettering
letters_full = np.zeros((H, W), bool); letters_full[:720] = letters

diff = np.abs(base.astype(int) - BG).sum(2)
zone = np.zeros((H, W), bool); zone[520:2270, 360:1420] = True
red_candy = (base[:, :, 0] > 150) & (base[:, :, 1] < 90) & (np.arange(H)[:, None] > 2150)
edge_candies = np.zeros((H, W), bool); edge_candies[1700:2300, 0:400] = True; edge_candies[1150:1700, 1390:] = True
keep_out = cv2.dilate(letters_full.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool)
# clean behind the photo too: its plastic lid is see-through, so nothing of the AI cup may remain behind it
leftover = zone & (diff > 18) & ~keep_out & ~red_candy & ~edge_candies
# the gap between the cup base and the candy: anything not clearly candy-red there is old AI cup
gap = np.zeros((H, W), bool); gap[2140:2290, 420:1000] = True
leftover |= gap & ~((base[:, :, 0] > 170) & (base[:, :, 1] < 70))
leftover = cv2.dilate(leftover.astype(np.uint8), np.ones((13, 13), np.uint8)); leftover[keep_out] = 0
# fill at quarter size (large area, smooth background), then use the original pixels everywhere else
small = cv2.inpaint(cv2.resize(base, (W // 4, H // 4), interpolation=cv2.INTER_AREA),
                    cv2.resize(leftover, (W // 4, H // 4), interpolation=cv2.INTER_NEAREST), 6, cv2.INPAINT_TELEA)
fill = cv2.GaussianBlur(cv2.resize(small, (W, H), interpolation=cv2.INTER_CUBIC), (0, 0), 3)
m = cv2.GaussianBlur(leftover.astype(np.float32), (0, 0), 2)[..., None]
clean = base.astype(np.float32) * (1 - m) + fill.astype(np.float32) * m

shadow = np.zeros((H, W), np.float32)
cv2.ellipse(shadow, (BASE_AT[0] + 5, BASE_AT[1] + 5), (245, 38), -8, 0, 360, 1, -1)
shadow = cv2.GaussianBlur(shadow, (0, 0), 16)
clean *= (1 - 0.32 * shadow[..., None])

out = clean * (1 - alpha[..., None]) + layer[:, :, :3].astype(np.float32) * alpha[..., None]
w = cv2.GaussianBlur(cv2.dilate(letters.astype(np.float32), np.ones((3, 3), np.uint8)), (0, 0), 1.0)
out[:720] = out[:720] * (1 - w[..., None]) + base[:720].astype(np.float32) * w[..., None]
Image.fromarray(out.clip(0, 255).astype(np.uint8)).save('output/skittles-milkshake-poster-v3-real-photo.png')
print('saved output/skittles-milkshake-poster-v3-real-photo.png')
