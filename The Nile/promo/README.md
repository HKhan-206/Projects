# The Nile – Animated Promo Screen

A full-screen animated advert for a **portrait (vertical) 1080 × 1920 screen**.
It plays your food photos with big moving words and prices, then loops forever.
There's no sound, no buttons and no login.

Everything is in this `promo` folder:

| File | What it is |
|---|---|
| `index.html` | **Open this to play the promo screen** |
| `promos.js` | **The only file you edit**: words, prices, photos, timings, order |
| `images/` | Food photos cut out from their backgrounds (`images/original/` keeps your untouched photos) |
| `promo.js` | The animation engine (no need to edit) |
| `promo.css` | Colours and fonts |
| `vendor/gsap.min.js` | The animation library (GSAP), stored here so no internet is needed |

---

## 1. Running it on your MacBook

**Quickest:** double-click `index.html`. It opens in your browser and starts playing.
Chrome gives the smoothest playback. Press **⌃⌘F** (Chrome) for full screen.

**Or with a local web server** (closest to how a screen will run it):

```bash
cd "path/to/The Nile/promo"
```

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in Chrome. Press `Ctrl + C` in Terminal to stop.

### Preview options (add to the end of the address)

| Add | Does |
|---|---|
| `?promo=wrap` | Plays only one promotion (use its `id` from `promos.js`) |
| `?t=9` | Freezes at 9 seconds, handy for checking a layout |
| `?blur=0` | Turns motion blur off (for older or slower screens) |
| `?rotate=90` | For a screen mounted on its side when the player only outputs landscape |

Options can be combined, e.g. `index.html?promo=pizza&t=9`.

---

## 2. Adding your food photos

1. Best results: a **cut-out PNG with a transparent background**, at least 1200 px wide.
   - On a Mac: right-click the photo in Finder → **Quick Actions → Remove Background**.
     This saves a PNG with the background removed.
   - Or use remove.bg or Photoshop.
2. Put the PNG in the `images` folder, e.g. `images/kebab.png`.
   (The photos already here were cut out with proper edge matting, so the edges blend into the background.)
3. In `promos.js`, point a promotion at it: `image: "images/kebab.png"`.
4. Adjust `imageWidth` (size on screen in pixels) until it looks right.

A normal JPG works too, but its background will show as a rectangle.

---

## 3. Adding a new promotion

In `promos.js`, copy one whole block from `{` to `},`, paste it where you want it in the list,
then change it:

```js
{
  id: "donner-kebab",          // short name, no spaces
  enabled: true,               // false = hidden
  animation: "sweep",          // sweep | slam | rise | spin | drop
  duration: 12,                // minimum seconds on screen
  background: "#EE6A2E",       // orange for this promotion
  image: "images/donner-kebab.png",
  imageWidth: 950,
  bigWord: "KEBAB",            // giant word behind the food
  headline: ["BIG. BOLD.", "LOADED."],
  title: "DONNER KEBAB",       // just the item name
  price: "6.49",               // item price
  mealPrice: "8.99"            // optional: price box flips to "MAKE IT A MEAL" and this price
},
```

The order on screen is the order in this list.

**Item price, then meal price:** when a promotion has `mealPrice`, the item price
shows first, then the price box flips over to **MAKE IT A MEAL** and the meal price.
Leave `mealPrice` out to show only the item price.

**Name only, no price** (used for the pizzas): leave out `price`. Add `titleSize: 100`
to show the name bigger, and use `\n` in the title to split it over two lines.

**Slogan slides** (words only, no food) use `type: "slogan"` and a list of `beats`.
Each beat is one screen of animated words with its own background colour.
The options are explained at the top of `promos.js`. Copy an existing slogan block to make a new one.

**Animation styles:**
- `sweep`: giant word sweeps across, food slides in from the side. Add `from: "left"` to come from the left.
- `slam`: words slam onto the screen one at a time (`slamWords: ["BRING", "THE", "HEAT."]`), food zooms in.
- `rise`: letters and food rise up from the bottom of the screen.
- `spin`: giant word sweeps, food rolls in spinning. Best for flat items like pizza (add `shadow: "round"`).
- `drop`: letters and food drop in from the top.

Every word is automatically sized to fit inside the screen.

---

## 4. Changing prices and text

Edit the text in quotes in `promos.js` and save:
- `price: "4.30"` is the big price (the £ sign is added for you).
- `mealPrice: "6.80"` is the price the box flips to under "MAKE IT A MEAL".
- `priceLabel: "FROM"` is an optional small word above the price.
- `headline`, `title` and `details` are the words (`details` is optional).
- A title can go over two lines with `\n`, e.g. `"CHICKEN TIKKA\nSPECIAL PIZZA"`.

Item prices are the menu prices. Burger meal prices are the menu price + 2.50
("Make it a meal +2.50" on the menu). Wrap meal prices are from the menu.

---

## 5. Adjusting the timing

- Each scene stays on screen as long as its animation needs (about 12–13 seconds for food with a
  meal price, 8–10 seconds for slogans). `duration` can make a scene stay longer.
  The animations play in the first 6–8 seconds and the final layout holds for the rest.
- `animation` swaps to a different motion style.
- For finer control, the timings are the numbers (in seconds) inside each style in `promo.js`.

---

## 6. Showing it on the portrait signage screen

**Option A, web address (network screens with their own browser):**
once this folder is published on GitHub Pages (same as the menu screens), the screen opens:
`https://hkhan-206.github.io/Projects/The%20Nile/promo/index.html`
*(This only works after it's merged into `main` and published. It isn't published yet.)*

**Option B, a player or mini PC with Chrome:** copy the whole `The Nile` folder onto it
(the promo uses the shared `fonts` and `assets` folders), then start Chrome in kiosk mode:

```bash
google-chrome --kiosk --noerrdialogs --disable-session-crashed-bubble --autoplay-policy=no-user-gesture-required "file:///path/to/The Nile/promo/index.html"
```

Set the screen to **portrait** in its settings, or add `?rotate=90` to the address.
It starts by itself, loops forever and reloads `promos.js` every few hours to pick up changes.
If a screen looks jerky, add `?blur=0`.

---

### Why plain HTML + GSAP (not React/Next.js)
A signage screen just needs one page that plays forever. Plain HTML with the GSAP
animation library needs no build step, no server and no internet. It opens by
double-click on a Mac, runs on any Chromium signage browser and can be hosted on
GitHub Pages exactly like the menu screens. React or Next.js would add a build process
without making the animation look any better.
