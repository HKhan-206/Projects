/* =====================================================================
   THE NILE – PROMO SCREEN (new style)
   ---------------------------------------------------------------------
   The list below plays top to bottom, then loops. No prices are shown.

   FOOD SLIDES – each uses the complete original photograph (not cut out);
   its own orange backdrop is extended to fill the portrait screen.
     id       = the photo in images/items/<id>.jpg
     title    = the big brush lettering, one line each: ["WORD", "w" white / "y" yellow]
     tagline  = two lines on the small dark panel (top white, bottom yellow)
     zoom     = optional, e.g. 1.04 shows the photo a little bigger, 0.9 smaller
     enabled  = false hides a slide without deleting it

   SLOGAN SLIDES (type: "slogan") – words only, animated. Each "beat" is one
   screen of words:
     bg    = "dark", "orange", "cream" or a colour code
     lines = t (text), size, colour, style ("outline" / "box"),
             in (slam, fromLeft, fromRight, stretch, zoom, flip, wipe, spin, rise, drop, type),
             at (seconds after the beat starts)
     ghost = giant faint word drifting behind   logo = "center" or "top"
     hold  = seconds to hold                    out  = whipL, whipR, up, down, zoom, fade, none
   ===================================================================== */

window.PROMO2 = {
  logo: "images/logo-stacked.png",     // stacked logo (used big on slogan slides)
  badge: "images/logo-triangle.png",   // triangle only, in the black circle on food slides
  orange: "#FD7E14",                   // the orange of the new photos (used on slogan slides)
  itemSeconds: 12,                     // seconds each food slide stays on screen
  slides: [
    {
      id: "grilled-chicken-burger",
      title: [["GRILLED", "w"], ["CHICKEN", "w"], ["BURGER", "y"]],
      tagline: ["FRESHLY GRILLED", "FULL OF FLAVOUR"],
      layerW: 1536, layerH: 2402,   // size of the extended photo – do not edit
      bgStops: [[0.0, "#fd7c14"], [3.3, "#fd7c14"], [6.7, "#fd7c14"], [10.0, "#fd7c14"], [13.3, "#fd7c14"], [16.7, "#fd7c13"], [20.0, "#fd7c14"], [23.3, "#fd7c14"], [26.6, "#fd7c14"], [30.0, "#fd7c14"], [33.3, "#fd7c14"], [36.6, "#fd7c14"], [40.0, "#fd7c14"], [43.3, "#fd7c14"], [46.6, "#fd7c14"], [50.0, "#fd7c14"], [53.3, "#fd7a15"], [56.6, "#fc7b15"], [60.0, "#fd7914"], [63.3, "#fd7912"], [66.6, "#fe7610"], [69.9, "#fe740f"], [73.3, "#fd7c14"], [76.6, "#fd7e17"], [79.9, "#fe7d15"], [83.3, "#fd7d14"], [86.6, "#fd7d15"], [89.9, "#fd7d14"], [93.3, "#fd7d15"], [96.6, "#fd7d15"], [99.9, "#fc7c14"], [100, "#fc7c14"]]
    },
    {
      id: "hot-mexican-burger",
      title: [["HOT", "w"], ["MEXICAN", "w"], ["BURGER", "y"]],
      tagline: ["BRING THE HEAT", "LOADED WITH CHILLIES"],
      layerW: 1536, layerH: 2402,   // size of the extended photo – do not edit
      bgStops: [[0.0, "#fc7d11"], [3.3, "#fc7d11"], [6.7, "#fc7d11"], [10.0, "#fc7d12"], [13.3, "#fc7d11"], [16.7, "#fc7d11"], [20.0, "#fc7d12"], [23.3, "#fc7d11"], [26.6, "#fc7d12"], [30.0, "#fc7d12"], [33.3, "#fc7d12"], [36.6, "#fc7d12"], [40.0, "#fc7d12"], [43.3, "#fd7e11"], [46.6, "#fd7e13"], [50.0, "#fd7e13"], [53.3, "#fd7e13"], [56.6, "#fd7d12"], [60.0, "#fc7d12"], [63.3, "#fd7d12"], [66.6, "#fc7d14"], [69.9, "#fe7b0f"], [73.3, "#fd7a0e"], [76.6, "#fd7e13"], [79.9, "#fd7e13"], [83.3, "#fd8013"], [86.6, "#fd7f13"], [89.9, "#fd7f12"], [93.3, "#fd7f12"], [96.6, "#fd7f12"], [99.9, "#fd7f12"], [100, "#fc7f12"]]
    },
    {
      id: "slogan-good-food",
      type: "slogan",
      beats: [
        { bg: "dark", hold: 0.5, out: "whipL", lines: [
          { t: "SOMETIMES", size: 210, colour: "white", in: "fromRight" },
          { t: "ALL YOU NEED IS", size: 122, colour: "orange", in: "rise", at: 0.4 } ] },
        { bg: "dark", ghost: "GOOD FOOD", hold: 0.8, out: "zoom", lines: [
          { t: "GOOD", size: 330, colour: "white", in: "slam" },
          { t: "FOOD.", size: 330, colour: "orange", in: "slam", at: 0.45 } ] },
        { bg: "orange", hold: 1.5, out: "whipL", lines: [
          { t: "WE’VE GOT", size: 175, colour: "black", in: "fromLeft" },
          { t: "THAT", size: 280, colour: "white", style: "outline", in: "stretch", at: 0.35 },
          { t: "COVERED.", size: 180, colour: "white", style: "box", box: "black", in: "flip", at: 0.75 } ] },
        { bg: "dark", logo: "center", hold: 1.2, out: "none", lines: [] }
      ]
    },
    {
      id: "chicken-tikka-wrap",
      title: [["CHICKEN", "w"], ["TIKKA", "w"], ["WRAP", "y"]],
      tagline: ["CHICKEN TIKKA", "PACKED WITH FLAVOUR"],
      layerW: 1536, layerH: 2402,   // size of the extended photo – do not edit
      bgStops: [[0.0, "#fd7c11"], [3.3, "#fd7c11"], [6.7, "#fd7c11"], [10.0, "#fd7c11"], [13.3, "#fd7c11"], [16.7, "#fd7c11"], [20.0, "#fd7c11"], [23.3, "#fd7c11"], [26.6, "#fd7c12"], [30.0, "#fd7c12"], [33.3, "#fd7c12"], [36.6, "#fd7c12"], [40.0, "#fd7d13"], [43.3, "#fe7e13"], [46.6, "#fd7c14"], [50.0, "#fd7e13"], [53.3, "#fe7d15"], [56.6, "#fd7c12"], [60.0, "#fd7d15"], [63.3, "#fd7f18"], [66.6, "#fd7c15"], [69.9, "#fd8013"], [73.3, "#fe8011"], [76.6, "#fd7f11"], [79.9, "#fc7f11"], [83.3, "#fd8111"], [86.6, "#fd8011"], [89.9, "#fd8011"], [93.3, "#fd8011"], [96.6, "#fd8011"], [99.9, "#fd8011"], [100, "#fd8012"]]
    },
    {
      id: "peri-burger",
      title: [["PERI", "w"], ["BURGER", "y"]],
      tagline: ["PERI SPICED", "TURN UP THE FLAVOUR"],
      layerW: 1536, layerH: 2402,   // size of the extended photo – do not edit
      bgStops: [[0.0, "#fd8113"], [3.3, "#fd8113"], [6.7, "#fd8113"], [10.0, "#fd8113"], [13.3, "#fd8113"], [16.7, "#fd8112"], [20.0, "#fd8112"], [23.3, "#fd8112"], [26.6, "#fd8113"], [30.0, "#fd8112"], [33.3, "#fd8112"], [36.6, "#fd8113"], [40.0, "#fd8013"], [43.3, "#fe8113"], [46.6, "#fe8115"], [50.0, "#fe8114"], [53.3, "#fe8113"], [56.6, "#fe8115"], [60.0, "#fe8115"], [63.3, "#fd7e13"], [66.6, "#fd7e13"], [69.9, "#fe770c"], [73.3, "#fd7d10"], [76.6, "#fd7f11"], [79.9, "#fd8014"], [83.3, "#fd8013"], [86.6, "#fd8013"], [89.9, "#fd8113"], [93.3, "#fd8113"], [96.6, "#fd8013"], [99.9, "#fd8113"], [100, "#fe8013"]]
    },
    {
      id: "chicken-fillet-burger",
      title: [["CHICKEN", "w"], ["FILLET", "w"], ["BURGER", "y"]],
      tagline: ["CRISPY & GOLDEN", "BUILT TO SATISFY"],
      layerW: 1536, layerH: 2402,   // size of the extended photo – do not edit
      bgStops: [[0.0, "#fd7e12"], [3.3, "#fd7e12"], [6.7, "#fd7e12"], [10.0, "#fd7e12"], [13.3, "#fd7e12"], [16.7, "#fd7e12"], [20.0, "#fd7f12"], [23.3, "#fc7f12"], [26.6, "#fc7f12"], [30.0, "#fd7f11"], [33.3, "#fc7f11"], [36.6, "#fd7f11"], [40.0, "#fd7f11"], [43.3, "#fd7f11"], [46.6, "#fd7f12"], [50.0, "#fd7f12"], [53.3, "#fe8012"], [56.6, "#fd8012"], [60.0, "#fd7e13"], [63.3, "#fd7f11"], [66.6, "#fe780d"], [69.9, "#fe770c"], [73.3, "#fd7d0f"], [76.6, "#fd7f11"], [79.9, "#fd7e11"], [83.3, "#fd7f12"], [86.6, "#fd7f12"], [89.9, "#fd7f12"], [93.3, "#fd7f11"], [96.6, "#fd7f12"], [99.9, "#fd7f12"], [100, "#fc7e11"]]
    },
    {
      id: "slogan-quality",
      type: "slogan",
      beats: [
        { bg: "dark", ghost: "QUALITY", hold: 0.7, out: "whipL", lines: [
          { t: "QUALITY", size: 250, colour: "white", in: "drop" } ] },
        { bg: "orange", hold: 1.1, out: "zoom", lines: [
          { t: "IS OUR", size: 220, colour: "black", in: "fromRight" },
          { t: "RECIPE.", size: 250, colour: "white", in: "slam", at: 0.4, shake: 1.3 } ] },
        { bg: "cream", logo: "center", hold: 1.6, out: "none", lines: [
          { t: "QUALITY IS OUR RECIPE", size: 64, colour: "black", in: "type", at: 0.6 } ] }
      ]
    },
    {
      id: "sizzler-burger",
      title: [["SIZZLER", "w"], ["BURGER", "y"]],
      tagline: ["EXTRA CRUNCHY", "CRAVINGS SORTED"],
      layerW: 1536, layerH: 2402,   // size of the extended photo – do not edit
      bgStops: [[0.0, "#fd8010"], [3.3, "#fd8010"], [6.7, "#fd8010"], [10.0, "#fd8010"], [13.3, "#fd8010"], [16.7, "#fd7f10"], [20.0, "#fd7f10"], [23.3, "#fd7f0f"], [26.6, "#fd7f10"], [30.0, "#fd7f0f"], [33.3, "#fd7f10"], [36.6, "#fd7f10"], [40.0, "#fd7f12"], [43.3, "#fe8115"], [46.6, "#fe8115"], [50.0, "#fe8115"], [53.3, "#fd8014"], [56.6, "#fd7e13"], [60.0, "#fd7e13"], [63.3, "#fe7e11"], [66.6, "#fd7d12"], [69.9, "#fd8111"], [73.3, "#fd8413"], [76.6, "#fd8413"], [79.9, "#fd8515"], [83.3, "#fc8214"], [86.6, "#fc8113"], [89.9, "#fc8113"], [93.3, "#fc8113"], [96.6, "#fc8113"], [99.9, "#fc8113"], [100, "#fc8113"]]
    },
    {
      id: "bubblegum-millions-milkshake",
      title: [["BUBBLEGUM", "w"], ["MILLIONS", "w"], ["MILKSHAKE", "y"]],
      tagline: ["SWEET & CREAMY", "TOPPED WITH CREAM"],
      layerW: 1536, layerH: 2402,   // size of the extended photo – do not edit
      bgStops: [[0.0, "#fd830f"], [3.3, "#fd830e"], [6.7, "#fd830f"], [10.0, "#fd830e"], [13.3, "#fd820e"], [16.7, "#fd820e"], [20.0, "#fd820e"], [23.3, "#fd820e"], [26.6, "#fd820e"], [30.0, "#fd810e"], [33.3, "#fd810e"], [36.6, "#fd810e"], [40.0, "#fd800e"], [43.3, "#fd8110"], [46.6, "#fd8010"], [50.0, "#fd7f10"], [53.3, "#fd7f0f"], [56.6, "#fd8010"], [60.0, "#fd7f10"], [63.3, "#fd7f0e"], [66.6, "#fd7d0f"], [69.9, "#fd7b0b"], [73.3, "#fc800c"], [76.6, "#fd840c"], [79.9, "#fd870c"], [83.3, "#fc880b"], [86.6, "#fc870b"], [89.9, "#fc870b"], [93.3, "#fc870b"], [96.6, "#fc860b"], [99.9, "#fd870b"], [100, "#fc870c"]]
    },
    {
      id: "slogan-pizza",
      type: "slogan",
      beats: [
        { bg: "orange", ghost: "PIZZA", hold: 0.9, out: "whipR", lines: [
          { t: "THERE’S ALWAYS", size: 120, colour: "black", in: "fromLeft" },
          { t: "TIME", size: 380, colour: "white", in: "slam", at: 0.35 },
          { t: "FOR PIZZA.", size: 170, colour: "black", in: "rise", at: 0.8 } ] },
        { bg: "dark", hold: 0.6, out: "up", lines: [
          { t: "THE ONLY", size: 230, colour: "white", in: "type" },
          { t: "QUESTION IS,", size: 140, colour: "orange", in: "fromRight", at: 0.55 } ] },
        { bg: "cream", hold: 1.6, out: "zoom", gap: 18, lines: [
          { t: "WHICH ONE", size: 160, colour: "black", in: "fromLeft" },
          { t: "ARE YOU", size: 160, colour: "black", in: "fromRight", at: 0.25 },
          { t: "HAVING", size: 190, colour: "white", style: "box", box: "orange", in: "wipe", at: 0.55 },
          { t: "?", size: 380, colour: "orange", in: "spin", at: 0.95, tilt: 12 } ] }
      ]
    },
    {
      id: "asian-style-pizza",
      title: [["ASIAN STYLE", "w"], ["PIZZA", "y"]],
      zoom: 1.04,
      tagline: ["LOADED TOPPINGS", "CRAVING A SLICE?"],
      layerW: 1536, layerH: 2402,   // size of the extended photo – do not edit
      bgStops: [[0.0, "#fd8313"], [3.3, "#fd8313"], [6.7, "#fd8313"], [10.0, "#fd8313"], [13.3, "#fd8313"], [16.7, "#fd8313"], [20.0, "#fd8313"], [23.3, "#fd8212"], [26.6, "#fd8212"], [30.0, "#fd8213"], [33.3, "#fe8212"], [36.6, "#fd8213"], [40.0, "#fd8113"], [43.3, "#ff8214"], [46.6, "#fd8314"], [50.0, "#fd8314"], [53.3, "#fd8314"], [56.6, "#fc8214"], [60.0, "#fc8115"], [63.3, "#fd8213"], [66.6, "#fd8113"], [69.9, "#fc8113"], [73.3, "#fc8214"], [76.6, "#fc8213"], [79.9, "#fc8213"], [83.3, "#fc8113"], [86.6, "#fc8213"], [89.9, "#fc8213"], [93.3, "#fc8212"], [96.6, "#fc8212"], [99.9, "#fd8113"], [100, "#fc8112"]]
    },
    {
      id: "chicken-tikka-special-pizza",
      title: [["CHICKEN TIKKA", "w"], ["SPECIAL PIZZA", "y"]],
      zoom: 1.04,               // shows the photo slightly bigger
      tagline: ["CHICKEN & JALAPEÑOS", "SLICE INTO FLAVOUR"],
      layerW: 1536, layerH: 2402,   // size of the extended photo – do not edit
      bgStops: [[0.0, "#fd8111"], [3.3, "#fc8011"], [6.7, "#fc8011"], [10.0, "#fd8111"], [13.3, "#fd8011"], [16.7, "#fd8011"], [20.0, "#fd8111"], [23.3, "#fd8011"], [26.6, "#fc8011"], [30.0, "#fc8111"], [33.3, "#fc8012"], [36.6, "#fd8012"], [40.0, "#fd8013"], [43.3, "#fe8113"], [46.6, "#fd8113"], [50.0, "#fd8012"], [53.3, "#fc8115"], [56.6, "#fc8215"], [60.0, "#fe8113"], [63.3, "#fe8113"], [66.6, "#fc8215"], [69.9, "#fd8215"], [73.3, "#fd8012"], [76.6, "#fd8014"], [79.9, "#fe8115"], [83.3, "#fc8214"], [86.6, "#fc8114"], [89.9, "#fc8113"], [93.3, "#fc8113"], [96.6, "#fd8114"], [99.9, "#fc8013"], [100, "#fc8114"]]
    },
    {
      id: "egg-burger",
      title: [["EGG", "w"], ["BURGER", "y"]],
      tagline: ["RUNNY YOLK", "THE ULTIMATE BURGER"],
      layerW: 1536, layerH: 2402,   // size of the extended photo – do not edit
      bgStops: [[0.0, "#fd7c14"], [3.3, "#fd7c14"], [6.7, "#fd7c14"], [10.0, "#fd7c14"], [13.3, "#fd7c14"], [16.7, "#fd7c14"], [20.0, "#fd7c14"], [23.3, "#fd7c14"], [26.6, "#fd7d14"], [30.0, "#fd7c14"], [33.3, "#fd7d14"], [36.6, "#fd7c14"], [40.0, "#fd7c14"], [43.3, "#fd7e15"], [46.6, "#fd7c14"], [50.0, "#fd7d13"], [53.3, "#fe7d13"], [56.6, "#fc7c11"], [60.0, "#fd7c14"], [63.3, "#fe7d15"], [66.6, "#fe7d15"], [69.9, "#fe7610"], [73.3, "#fd7e13"], [76.6, "#fd7e13"], [79.9, "#fd7d15"], [83.3, "#fd7d13"], [86.6, "#fd7d13"], [89.9, "#fd7e13"], [93.3, "#fd7d13"], [96.6, "#fc7d12"], [99.9, "#fd7d13"], [100, "#fd7d13"]]
    },
    {
      id: "chicken-wrap",
      title: [["CHICKEN", "w"], ["WRAP", "y"]],
      tagline: ["CRISPY CHICKEN", "FULL OF FLAVOUR"],
      layerW: 1536, layerH: 2402,   // size of the extended photo – do not edit
      bgStops: [[0.0, "#fd7b12"], [3.3, "#fc7b12"], [6.7, "#fc7b12"], [10.0, "#fc7b12"], [13.3, "#fd7b12"], [16.7, "#fd7c12"], [20.0, "#fc7c12"], [23.3, "#fc7c12"], [26.6, "#fd7c12"], [30.0, "#fc7c12"], [33.3, "#fc7c12"], [36.6, "#fd7d12"], [40.0, "#fd7e12"], [43.3, "#fd7e15"], [46.6, "#fd7f14"], [50.0, "#fd7e13"], [53.3, "#fd7e15"], [56.6, "#fd7e14"], [60.0, "#fd7e14"], [63.3, "#fd7e14"], [66.6, "#fd7d12"], [69.9, "#fc7c10"], [73.3, "#fc7c0f"], [76.6, "#fd7d12"], [79.9, "#fd7d12"], [83.3, "#fc7d13"], [86.6, "#fd7c12"], [89.9, "#fc7c12"], [93.3, "#fc7c12"], [96.6, "#fc7c12"], [99.9, "#fc7b12"], [100, "#fc7b12"]]
    },
    {
      id: "slogan-the-nile",
      type: "slogan",
      beats: [
        { bg: "cream", hold: 1.2, out: "up", lines: [
          { t: "GOOD FOOD", size: 200, colour: "black", in: "drop" },
          { t: "IS ALWAYS A", size: 96, colour: "orange", in: "type", at: 0.9 },
          { t: "GOOD IDEA.", size: 190, colour: "white", style: "box", box: "orange", in: "wipe", at: 1.6 } ] },
        { bg: "dark", hold: 0.5, out: "zoom", lines: [
          { t: "ESPECIALLY", size: 190, colour: "white", in: "stretch" },
          { t: "WHEN IT’S", size: 190, colour: "white", in: "fromRight", at: 0.35 },
          { t: "FROM", size: 250, colour: "orange", in: "fromLeft", at: 0.55 } ] },
        { bg: "orange", logo: "center", hold: 2.2, out: "none", lines: [] }
      ]
    },
    {
      id: "mega-burger",
      title: [["MEGA", "w"], ["BURGER", "y"]],
      tagline: ["BEEF & CHICKEN", "BIG BITE. BIG FLAVOUR."],
      layerW: 1536, layerH: 2402,   // size of the extended photo – do not edit
      bgStops: [[0.0, "#fd7c11"], [3.3, "#fc7c11"], [6.7, "#fd7c11"], [10.0, "#fd7c11"], [13.3, "#fd7c11"], [16.7, "#fd7d11"], [20.0, "#fd7d11"], [23.3, "#fd7d10"], [26.6, "#fd7d10"], [30.0, "#fd7d10"], [33.3, "#fd7d10"], [36.6, "#fd7c10"], [40.0, "#fd7d10"], [43.3, "#fd7d10"], [46.6, "#fd7d10"], [50.0, "#fd7d11"], [53.3, "#fd7d10"], [56.6, "#fe7b0f"], [60.0, "#fd7d10"], [63.3, "#fe7b0f"], [66.6, "#fd7b11"], [69.9, "#fe7108"], [73.3, "#fb780b"], [76.6, "#fd7a0e"], [79.9, "#fc7c0f"], [83.3, "#fd7d10"], [86.6, "#fd7d10"], [89.9, "#fd7d10"], [93.3, "#fd7d10"], [96.6, "#fc7d10"], [99.9, "#fd7d10"], [100, "#fd7d11"]]
    },
    {
      id: "the-nile-milkshake",
      title: [["THE NILE", "w"], ["MILKSHAKE", "y"]],
      tagline: ["OUR SIGNATURE SHAKE", "YOUR NEXT FAVOURITE"],
      layerW: 1536, layerH: 2402,   // size of the extended photo – do not edit
      bgStops: [[0.0, "#fd8011"], [3.3, "#fd8010"], [6.7, "#fd8010"], [10.0, "#fd8010"], [13.3, "#fd8011"], [16.7, "#fd8011"], [20.0, "#fd8011"], [23.3, "#fd8011"], [26.6, "#fd8011"], [30.0, "#fd8011"], [33.3, "#fd8011"], [36.6, "#fd8011"], [40.0, "#fd8112"], [43.3, "#fe8113"], [46.6, "#fd8012"], [50.0, "#fd8313"], [53.3, "#fe8113"], [56.6, "#fe8112"], [60.0, "#fd8212"], [63.3, "#fd8111"], [66.6, "#fd8111"], [69.9, "#fd7e10"], [73.3, "#fd7d0f"], [76.6, "#fd7f10"], [79.9, "#fd7f0e"], [83.3, "#fc800e"], [86.6, "#fd7f0e"], [89.9, "#fd7f0e"], [93.3, "#fd7f0e"], [96.6, "#fd7f0e"], [99.9, "#fc7e0e"], [100, "#fc7f0e"]]
    }
  ]
};
