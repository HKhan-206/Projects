/* =====================================================================
   THE NILE – PROMO SCREEN CONTENT
   ---------------------------------------------------------------------
   This is the only file you need to edit. Change text, prices, photos,
   timings and the order of the promotions here. Save, then refresh the
   screen (or wait – it refreshes itself every few hours).

   ORDER      = the order the promotions appear in this list.
   enabled    = false hides a promotion without deleting it.
   look       = "orange" (default) or "band" (dark background, a thick diagonal
                orange band slides in and the food sits on it).
   animation  = which motion style to use:
                "sweep"  food slides in from the side (from: "left" to reverse)
                "slam"   slamWords slam on one at a time and clear, then the food zooms in
                "rise"   food rises up from the bottom
                "spin"   food rolls in spinning (good for pizza)
                "drop"   food drops in from the top and bounces
                "zoom"   the camera pulls back onto the food
   duration   = minimum seconds on screen (it stays longer if the animation needs it).
   price      = the item price.
   mealPrice  = after the item price shows, it flips over to "MAKE IT A MEAL"
                and this price. Leave it out for no meal price.
   No price   = leave out price (e.g. the pizzas) to show just the name.

   SLOGAN SLIDES (type: "slogan") are words only, no food. Each slide is a
   list of "beats" – one screen of words at a time:
     bg     = background: "dark", "orange", "cream", "white" or a colour code
     lines  = the words, top to bottom. Each line:
              t      the text
              size   size in pixels (shrinks automatically to fit)
              colour "white", "black", "orange" or a colour code
              style  "outline" (hollow letters) or "box" (words on a coloured block, box: "orange")
              in     how it arrives: slam, fromLeft, fromRight, stretch, zoom,
                     flip, wipe, spin, rise, drop, type
              at     seconds after the beat starts (optional)
     ghost  = a giant faint word drifting behind (optional)
     logo   = "center" or "top" to show the logo (optional)
     hold   = seconds to hold before leaving
     out    = how it leaves: whipL, whipR, up, down, zoom, fade, none
   background = the orange used for this promotion's background.

   Item prices are the menu prices. Burger meal prices = menu price + 2.50
   ("Make it a meal +2.50" on the menu); wrap meal prices are from the menu.
   ===================================================================== */

window.PROMO_CONFIG = {

  settings: {
    logo: "../assets/logo.png",   // The Nile logo (shown on a black badge so its colours stay exact)
    motionBlur: true,             // set to false if an older screen struggles to play smoothly
    wipeColour: "#111111",        // colour of the sweep between promotions
    refreshHours: 3               // reloads this file every few hours to pick up changes
  },

  promos: [
    {
      id: "hot-mexican-burger",
      animation: "slam",
      background: "#EE6A2E",
      image: "images/hot-mexican-burger.png",
      imageWidth: 960,                       // size of the photo on screen (pixels)
      slamWords: ["BRING", "THE", "HEAT."],  // slam in one at a time, then clear away before the food
      headline: ["BIG. BOLD.", "LOADED."],
      title: "HOT MEXICAN BURGER",
      price: "3.79",
      mealPrice: "6.29"
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
      id: "grilled-chicken-burger",
      animation: "sweep",
      look: "band",                          // dark background, diagonal orange band slides in
      background: "#EC632B",
      image: "images/grilled-chicken-burger.png",
      imageWidth: 960,
      headline: ["TURN UP", "THE FLAVOUR."],
      title: "GRILLED CHICKEN BURGER",
      price: "4.29",
      mealPrice: "6.79"
    },
    {
      id: "chicken-tikka-wrap",
      animation: "rise",
      background: "#EE6A2E",
      image: "images/chicken-tikka-wrap.png",
      imageWidth: 880,
      headline: ["WRAPPED TO", "PERFECTION."],
      title: "CHICKEN TIKKA WRAP",
      price: "3.99",
      mealPrice: "5.99"
    },
    {
      id: "peri-burger",
      animation: "drop",
      background: "#EC632B",
      image: "images/peri-burger.png",
      imageWidth: 960,
      headline: ["FEEL", "THE HEAT."],
      title: "PERI BURGER",
      price: "4.30",
      mealPrice: "6.80"
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
      id: "chicken-fillet-burger",
      animation: "sweep",
      look: "band",
      from: "left",
      background: "#EE6A2E",
      image: "images/chicken-fillet-burger.png",
      imageWidth: 940,
      headline: ["BUILT TO", "SATISFY."],
      title: "CHICKEN FILLET BURGER",
      price: "3.89",
      mealPrice: "6.39"
    },
    {
      id: "sizzler-burger",
      animation: "drop",
      background: "#EC632B",
      image: "images/sizzler-burger.png",
      imageWidth: 960,
      headline: ["CRAVINGS", "SORTED."],
      title: "SIZZLER BURGER",
      price: "3.99",
      mealPrice: "6.49"
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
      id: "chicken-tikka-pizza",
      animation: "spin",
      background: "#EA6029",
      image: "images/chicken-tikka-pizza.png",
      imageWidth: 820,
      shadow: "round",
      headline: ["SLICE INTO", "FLAVOUR."],
      title: "CHICKEN TIKKA\nSPECIAL PIZZA",   // \n = new line
      titleSize: 100                           // no price, so the name is shown bigger
    },
    {
      id: "asian-pizza",
      animation: "sweep",
      look: "band",
      background: "#EE6A2E",
      image: "images/asian-pizza.png",
      imageWidth: 820,
      shadow: "round",
      headline: ["ONE SLICE IS", "NEVER ENOUGH."],
      title: "ASIAN STYLE\nPIZZA",
      titleSize: 100
    },
    {
      id: "egg-burger",
      animation: "sweep",
      look: "band",
      background: "#EC632B",
      image: "images/egg-burger.png",
      imageWidth: 920,
      headline: ["THE ULTIMATE", "BURGER."],
      title: "EGG BURGER",
      price: "4.49",
      mealPrice: "6.99"
    },
    {
      id: "chicken-wrap",
      animation: "slam",
      background: "#EE6A2E",
      image: "images/chicken-wrap.png",
      imageWidth: 860,
      slamWords: ["PACKED", "WITH", "FLAVOUR."],
      headline: ["EVERY BITE", "HITS DIFFERENT."],
      title: "CHICKEN WRAP",
      price: "3.79",
      mealPrice: "5.79"
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
        { bg: "orange", logo: "top", ghost: "THE NILE", hold: 1.8, out: "none", lines: [
          { t: "THE", size: 200, colour: "black", in: "drop" },
          { t: "NILE.", size: 360, colour: "white", in: "slam", at: 0.45, shake: 1.4 } ] }
      ]
    },
    {
      id: "mega-burger",
      animation: "rise",
      look: "band",
      background: "#EC632B",
      image: "images/mega-burger.png",
      imageWidth: 920,
      headline: ["BIG BITE.", "BIG FLAVOUR."],
      title: "MEGA BURGER",
      price: "4.49",
      mealPrice: "6.99"
    },
    {
      id: "milkshakes",
      animation: "zoom",
      background: "#EF7030",
      image: "images/milkshake.png",
      imageWidth: 380,
      imageY: 945,
      headline: ["YOUR NEXT", "FAVOURITE."],
      title: "MILKSHAKES",
      details: "Ferrero Rocher · Kinder Bueno · Lotus Biscoff · Oreo & more",
      priceLabel: "FROM",
      price: "4.99"
    }
  ]
};
