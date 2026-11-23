# The Nile – kinetic photo edit (Higgsfield Katana "Kinetic Graphic Photo Edit")

Portrait 1080×1920, 14.5 s, 30 fps, no audio. Final: `output/the-nile-kinetic-photo-edit-1080x1920.mp4`
(also saved to the Higgsfield Katana history).

Food only, no people. Type hits: THE NILE · FRESHLY GRILLED · FULL OF FLAVOUR.

| Time | Scene | Made with |
|---|---|---|
| 0.0–1.6 | Title card: THE NILE letters slam in, marquee bar, barcode | code |
| 1.6–4.6 | Burger builds itself, FRESHLY GRILLED slams in | Seedance 2.5 clip (`clips/burger-build-raw.mp4`) |
| 4.6–5.8 | Chapter 01 with the chicken burger | code + your photo |
| 5.8–7.0 | Photo collage | code + your photos |
| 7.0–8.2 | Pizza spinning like a record, FULL OF FLAVOUR around it | code + your photo |
| 8.2–11.0 | Pizza cheese pull, chapter 02 | Seedance 2.5 clip (`clips/pizza-pull-raw.mp4`) |
| 11.0–12.2 | FULL OF FLAVOUR slam with the grilled chicken plate | code + your photo |
| 12.2–13.1 | Phone-style notification / app / toggle insert | code |
| 13.1–14.5 | Logo end card | code |

Credits used: 128.24 (2 × Seedance 2.5 1080p 4 s = 128, 2 × Soul Cinematic backdrop stills = 0.24).

- `assets/photos/` – the 4 supplied photos, unchanged; `assets/cutouts/` – cut-outs (rembg run locally, plus
  `make_plate_cutouts.py` for the pizza board and chicken plate).
- `index.html` – the whole edit (GSAP timeline). Open it in a browser to play it, or `?t=5.2` to hold a moment.
- `build.sh` – rebuilds everything (needs ffmpeg, node + Playwright).
