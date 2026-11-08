# The Nile – Strawberry Millions Milkshake poster clip

**Final video:** `output/the-nile-strawberry-millions-milkshake-poster-1080x1920.mp4` (1080 × 1920 portrait, 14 s, 24 fps, silent, loops seamlessly)

- `source/poster-original.webp` – the poster as supplied
- `source/poster-clean.png` – same poster with the extra text removed (title and cup writing kept)
- `source/poster-9x16-final-frame.png` – the clean poster, untouched, placed in a 9:16 frame; only the bands above and below were AI-filled
- `source/poster-9x16-start-frame.png` – opening frame: cream background with the title
- `output/kling4-raw.mp4` – first Kling 4.0 version (strawberries drop in)
- `output/kling4-v2-raw.mp4` – current main clip: strawberries rise from the bottom, liquid keeps swirling to the end
- `output/kling4-v2-hold-raw.mp4` – 4 s moving hold on the poster (only the liquid moves)
- `output/kling4-v3-raw.mp4` – current clip: one continuous 14 s Kling 4.0 shot, poster used as a layout guide (ending not locked), liquid flows down-left to the end
- `output/kling4-v3-bob.mp4` – the v3 clip with a gentle bob added to the cup and strawberries after they settle (made by `bob.py`, free, title locked)
- `output/backup/the-nile-strawberry-millions-milkshake-poster-v3-no-bob.mp4` – **backup of the previous version, without the bob**
- `build.sh` – adds a 0.8 s dissolve back to the opening frame and removes audio (to go back to the no-bob version, set `MAIN=output/kling4-v3-raw.mp4` and run it)
