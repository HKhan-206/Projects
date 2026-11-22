# The Nile – Promo Screen (new style)

An animated advert for a **portrait 1080 × 1920 screen**. It loops forever, with no sound,
no buttons, no prices and no login. It plays 13 food slides in the poster style, plus the
4 slogan slides, about 2 minutes 15 seconds per loop.

| File | What it is |
|---|---|
| `index.html` | **Open this to play it** |
| `items.js` | **The only file you edit**: titles, taglines, order, slogans |
| `images/items/` | The food photos, with their orange background extended to fill the screen |
| `images/logo-triangle.png` | The triangle from the logo, in the black circle badge |
| `promo-v2.js` / `promo-v2.css` | The animation and styling (no need to edit) |
| `vendor/gsap.min.js` | The animation library (GSAP), stored here so no internet is needed |

The photos are **complete photographs**: the food is never cut out. Each photo slides
in as one piece, and its own background was extended above and below to fill the tall screen.

## Run it
Double-click `index.html` (Chrome works best) and press F11 for full screen. It needs the rest of
the `The Nile` folder next to it (shared fonts and logo).

Preview options to add to the address:
- `?item=peri-burger` plays one slide only.
- `?t=5` freezes at 5 seconds.
- `?rotate=90` is for a screen mounted on its side.
- `?blur=0` turns motion blur off, for slower screens.

## Change words or order
In `items.js`:
- `title: [["PERI", "w"], ["BURGER", "y"]]`: one entry per line, `"w"` white, `"y"` yellow.
- `tagline: ["PERI SPICED", "TURN UP THE FLAVOUR"]`: the two lines on the small panel.
- `zoom: 0.86`: optional, shows a photo a little smaller (used for the pizzas).
- `enabled: false` hides a slide.
- The order on screen is the order of the list. Move a whole `{ ... },` block to reorder.

## Add a new food photo
The photo needs a plain orange background like the others. Ask Claude to add it: the background
gets extended automatically and the `layerW`, `layerH` and `bgStops` values are filled in.
