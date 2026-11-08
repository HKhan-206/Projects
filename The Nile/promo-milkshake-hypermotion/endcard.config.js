/* =====================================================================
   THE NILE – milkshake promo end card (1080 x 1920)
   ---------------------------------------------------------------------
   The Higgsfield Hypermotion clip plays first; this end card follows it,
   with the ORIGINAL milkshake photograph (unchanged) and code-drawn text.
   Leave a text field empty ("") to hide it. Times are in seconds.
   ===================================================================== */
window.ENDCARD = {
  duration: 4.4,

  // product name (supplied by The Nile) – lines of the main title
  productLines: ["STRAWBERRY", "MILLIONS"],
  productBanner: "MILKSHAKE",        // last line, white on a red banner

  // optional extras – add text here when you have it, never invented
  headline: "",                      // e.g. a promotional line above the name
  phrase: "",                        // short supporting phrase under the name
  price: "",                         // e.g. "£4.99"

  // the photo starts exactly where the AI clip's cup finishes, then settles here
  cupStart: { width: 692, centreX: 542, top: 166 },
  cupEnd:   { width: 520, centreX: 540, bottom: 1700 },

  colours: {
    bgTop: "#d4aba4", bgBottom: "#efd2ce", glow: "rgba(255,240,236,0.75)",
    red: "#b0142d", redDark: "#7d0b1f", cream: "#fff6f2"
  }
};
