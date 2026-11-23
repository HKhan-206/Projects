"""Cuts the pizza (on its black board) and the grilled chicken (on its black plate) out of their
flat orange studio backgrounds: anything that is clearly not the backdrop colour, largest piece only,
holes filled, outline smoothed and softened by ~1.5 px. The photo pixels themselves are untouched."""
import cv2, numpy as np
for name, src in [("pizza", "assets/photos/pizza.png"), ("grilled-chicken", "assets/photos/grilled-chicken.jpg")]:
    im = cv2.imread(src)
    if im.shape[1] > 3000:
        im = cv2.resize(im, (3000, round(im.shape[0] * 3000 / im.shape[1])), interpolation=cv2.INTER_AREA)
    h, w = im.shape[:2]
    border = np.concatenate([im[:20].reshape(-1, 3), im[-20:].reshape(-1, 3), im[:, :20].reshape(-1, 3), im[:, -20:].reshape(-1, 3)])
    lab = cv2.cvtColor(im, cv2.COLOR_BGR2LAB).astype(np.float32)
    bl = cv2.cvtColor(border.reshape(-1, 1, 3), cv2.COLOR_BGR2LAB).reshape(-1, 3).astype(np.float32)
    mu = np.median(bl, 0)
    # chroma distance mainly; backdrop varies in lightness (shadow), so weight L lightly
    d = np.sqrt(0.25 * (lab[..., 0] - mu[0]) ** 2 + (lab[..., 1] - mu[1]) ** 2 + (lab[..., 2] - mu[2]) ** 2)
    m = (d > 38).astype(np.uint8)
    try:  # also keep whatever the AI cut-out (rembg, run locally) kept, e.g. pale lettuce
        extra = cv2.imread(f"assets/cutouts/{name}-rembg-mask.png", cv2.IMREAD_GRAYSCALE)
        keep = (cv2.resize(extra, (w, h)) > 128).astype(np.uint8)
        # outside the AI mask, drop backdrop-coloured shadow (saturated orange) that the colour test let through
        hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
        orange = (hsv[..., 0] >= 8) & (hsv[..., 0] <= 22) & (hsv[..., 1] > 120) & (hsv[..., 2] > 110)
        m = keep | (m & ~orange).astype(np.uint8)
    except Exception:
        pass
    n, lbl, st, _ = cv2.connectedComponentsWithStats(m, 8)
    big = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA]); m = (lbl == big).astype(np.uint8)
    ff = np.pad(m, 1).copy(); cv2.floodFill(ff, None, (0, 0), 1); m = m | (ff[1:-1, 1:-1] == 0)
    k = int(w * 0.006) | 1
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))
    m = cv2.erode(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    a = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 1.5)
    out = np.dstack([im, (a * 255).astype(np.uint8)])
    ys, xs = np.where(a > 0.02); out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    cv2.imwrite(f"assets/cutouts/{name}.png", out); print(name, out.shape)
