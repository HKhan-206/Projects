/* =====================================================================
   STRAWBERRY MILLIONS MILKSHAKE – promo settings (1080 x 1920 portrait)
   ---------------------------------------------------------------------
   Timed beat for beat against the reference (Straight Outta Nashville
   mango shake, left screen). Times are in seconds, sizes in pixels.
   ===================================================================== */
window.PROMO = {
  background: "#78DCC8",              // turquoise mint
  duration: 10,                       // whole loop length

  // 1. the big strawberry: on screen from the first frame, drifting down and
  //    turning onto its side (like the mango), then rocking at the bottom for good
  strawberry: {
    frames: "layers/strawberry/f%04d.png", from: 1, to: 130,
    scale: 1.25,                      // ~900 px wide at the start, wider than the screen lying down (like the mango)
    path: [                           // [time, centre x, centre y, rotation]
      [0.0, 600, 520, -6],
      [1.0, 570, 1010, -2],
      [1.6, 550, 1330, 0],
      [2.15, 540, 1840, 0]            // lands low, mostly below the cup, partly off-screen
    ],
    rockFrames: [122, 130]            // keeps turning gently between these frames after landing
  },

  // 2. the milkshake photograph – used exactly as supplied (only moved, tilted and sized)
  milkshake: {
    src: "source/milkshake.png",
    width: 580,                       // on-screen width
    centreX: 540, bottom: 1800,       // rests on the strawberry
    angle: -16,                       // leans like the reference cup
    dropAt: 1.7, landAt: 2.3          // falls in from the top, motion-blurred
  },

  // 3. strawberry sauce – splashes up both sides behind the strawberry on impact, never stops
  splash:     { frames: "layers/splash/f%04d.png",      from: 30, to: 151, start: 2.25, end: 5.9 },  // sauce enters at frame 30
  splashLoop: { frames: "layers/splash-loop/f%04d.png", from: 2, to: 140, start: 5.9, end: 10 },
  splashSize: 0.72,                   // each side's splash, as a share of the screen width
  splashMirrorDelay: 0.25,            // the right-hand splash lags slightly so the sides aren't twins

  // 4. small strawberry halves floating at the edges from the start (like the mango chunks)
  pieces: [
    { src: "layers/strawberry-piece-1.png", x: 880, y: 850,  width: 135, rotate: 25,  flip: true,  blur: 0 },
    { src: "layers/strawberry-piece-1.png", x: 10,  y: 1330, width: 155, rotate: -35, flip: false, blur: 3 },
    { src: "layers/strawberry-piece-1.png", x: 915, y: 400,  width: 115,  rotate: 40,  flip: true,  blur: 1 },
    { src: "layers/strawberry-piece-1.png", x: 50,  y: 740,  width: 110,  rotate: -20, flip: false, blur: 2 }
  ],

  // 5. title – letters fly in, assemble, change colour, scatter and re-form, over and over
  title: {
    lines: ["STRAWBERRY", "MILLIONS", "MILKSHAKE"],
    top: 40, size: 132,
    cycle: 2.9,                       // seconds per assemble → hold → scatter
    colours: ["#ffffff", "#ff3b5c"]   // white, then strawberry (the reference goes white → mango yellow)
  }
};
