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
    width: 600,                       // on-screen width in pixels
    centreX: 560, bottom: 1860,       // where it settles
    angle: -10,                       // tilt in degrees, like the reference
    enterAt: 1.5
  },

  // Higgsfield clips, keyed onto transparent frame sequences (layers/...)
  strawberry: { frames: "layers/strawberry/f%04d.png", count: 151, from: 1, to: 110, start: 0, end: 2.4 },
  syrup:      { frames: "layers/syrup/f%04d.png",      count: 151, from: 1, to: 80,  start: 2.0, end: 4.6, cutoff: 600 },

  // cut strawberry pieces (layers/strawberry-piece-N.png) – kept minimal
  pieces: [
    { src: "layers/strawberry-piece-1.png", x: 40,  y: 1080, width: 230, rotate: -18, from: "left",  at: 2.8 },
    { src: "layers/strawberry-piece-2.png", x: 830, y: 860,  width: 200, rotate: 14,  from: "right", at: 3.0 },
    { src: "layers/strawberry-piece-3.png", x: 820, y: 1480, width: 210, rotate: 22,  from: "right", at: 3.2 }
  ],

  // title at the top
  title: { lines: ["STRAWBERRY", "MILLIONS", "MILKSHAKE"], top: 80, at: 2.7 }
};
