# The Nile – Strawberry Millions Milkshake promo (Higgsfield Hypermotion)

**Final video:** `output/the-nile-strawberry-millions-milkshake-1080x1920.mp4` (1080 × 1920, 9:16, 10.5 s, 24 fps, silent, loops seamlessly)

How it's made:
1. **0 – 6.6 s:** Higgsfield Marketing Studio → Hypermotion → *Coral Burst Splash* preset, generated from the original milkshake photo with a strawberry brief (`higgsfield/coral-burst-splash-raw.mp4`, 1440 × 2560).
2. **6.1 – 10.5 s:** end card (`endcard.html`). The **original photograph** (`assets/milkshake-original.png`, pixels unchanged) takes over from the AI cup at the same position, settles lower, and the code-drawn title and The Nile logo animate in.
3. The last half-second fades back into the clip's first frame, so it loops without a jump.

Edit the text in `endcard.config.js` (headline, supporting phrase and price are empty and hidden until you add them), then run `./build.sh` to rebuild the video. No Higgsfield credits are needed to rebuild.
