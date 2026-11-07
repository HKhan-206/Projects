/* =====================================================================
   STRAWBERRY MILLIONS MILKSHAKE – promo settings (1080 x 1920 portrait)
   ---------------------------------------------------------------------
   Every layer is separate and can be changed here without touching the
   animation code. Times are in seconds.
   ===================================================================== */
window.PROMO = {
  background: "#78DCC8",              // turquoise mint
  duration: 10,                       // whole loop length

  // the milkshake photograph – used exactly as supplied (only moved, tilted and sized)
  milkshake: {
    src: "source/milkshake.png",
    width: 520,                       // on-screen width in pixels
    centreX: 560, bottom: 1640,       // it settles resting on the strawberry, like the reference
    angle: -10,                       // tilt in degrees, like the reference
    enterAt: 1.5
  },

  // Higgsfield clips, keyed onto transparent frame sequences (layers/...)
  // offsetY moves a whole clip down; the strawberry ends large at the bottom, partly off-screen
  strawberry: { frames: "layers/strawberry/f%04d.png", count: 151, from: 1, to: 130, start: 0, end: 2.6, offsetY: 470 },
  splash:     { frames: "layers/splash/f%04d.png",     count: 151, from: 1, to: 151, start: 1.9, end: 5.6, offsetY: 120 },
  // continuation clip: starts on the splash's last frame, so the sauce never stops moving
  splashLoop: { frames: "layers/splash-loop/f%04d.png", from: 2, to: 140, start: 5.6, end: 10 },

  // small strawberry halves (all the same half, flipped and rotated) – subtle, like the mango pieces
  pieces: [
    { src: "layers/strawberry-piece-1.png", x: 250, y: 690,  width: 105, rotate: -25, flip: false, blur: 0,   from: "left",  at: 2.6 },
    { src: "layers/strawberry-piece-1.png", x: 770, y: 620,  width: 95,  rotate: 30,  flip: true,  blur: 0,   from: "right", at: 2.75 },
    { src: "layers/strawberry-piece-1.png", x: 955, y: 1030, width: 110, rotate: 15,  flip: true,  blur: 2,   from: "right", at: 2.9 },
    { src: "layers/strawberry-piece-1.png", x: 30,  y: 1180, width: 100, rotate: -40, flip: false, blur: 2,   from: "left",  at: 3.0 }
  ],

  // title at the top
  title: { lines: ["STRAWBERRY", "MILLIONS", "MILKSHAKE"], top: 60, at: 2.7, size: 140 }
};
