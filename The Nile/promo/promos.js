/* =====================================================================
   THE NILE – PROMO SCREEN CONTENT
   ---------------------------------------------------------------------
   This is the only file you need to edit. Change text, prices, photos,
   timings and the order of the promotions here. Save, then refresh the
   screen (or wait – it refreshes itself every few hours).

   ORDER      = the order the promotions appear in this list.
   enabled    = false hides a promotion without deleting it.
   animation  = which motion style to use:
                "sweep"  big word sweeps across, food slides in from the side
                "slam"   words slam onto the screen one at a time, food zooms in
                "rise"   letters and food rise up from the bottom
                "spin"   big word sweeps, food rolls in spinning (good for pizza)
                "drop"   letters and food drop in from the top
   duration   = total seconds this promotion stays on screen (10–14 works well).
   background = the orange used for this promotion's background.

   PRICES MARKED "PLACEHOLDER" ARE NOT REAL – replace them with your offer.
   Prices marked "from the menu" are copied from the menu screens.
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
      id: "beef-burger",
      enabled: true,
      animation: "sweep",
      duration: 12,
      background: "#EE6A2E",
      image: "images/beef-burger.png",
      imageWidth: 1000,                       // size of the photo on screen (pixels)
      bigWord: "BURGER",                     // giant word behind the food
      headline: ["BIG BITE.", "BIG FLAVOUR."],
      title: "BURGER MEAL",                  // CHECK: product name for this photo
      details: "Make it a meal +2.50",       // from the menu
      priceLabel: "MEAL",
      price: "X.XX"                          // PLACEHOLDER – put your offer price here
    },
    {
      id: "chicken-burger",
      enabled: true,
      animation: "slam",
      duration: 12,
      background: "#EC632B",
      image: "images/chicken-burger.png",
      imageWidth: 1000,
      slamWords: ["BRING", "THE", "HEAT."],  // shown one at a time; the last one stays behind the food
      headline: ["TURN UP", "THE FLAVOUR."],
      title: "CHICKEN BURGER MEAL",          // CHECK: product name for this photo
      details: "Make it a meal +2.50",       // from the menu
      priceLabel: "MEAL",
      price: "X.XX"                          // PLACEHOLDER – put your offer price here
    },
    {
      id: "wrap",
      enabled: true,
      animation: "rise",
      duration: 12,
      background: "#EE6A2E",
      image: "images/wrap.png",
      imageWidth: 580,
      anchorBottom: true,                    // the photo sits on the bottom edge of the screen
      imageX: 370,
      bigWord: "WRAP",
      headline: ["WRAPPED TO", "PERFECTION."],
      title: "CHICKEN TIKKA WRAP",           // from the menu
      details: "Wrap only 3.99",             // from the menu
      priceLabel: "MEAL",
      price: "5.99"                          // from the menu (Chicken Tikka Wrap meal)
    },
    {
      id: "pizza",
      enabled: true,
      animation: "spin",
      duration: 12,
      background: "#EA6029",
      image: "images/pizza.png",
      imageWidth: 800,
      shadow: "round",
      bigWord: "PIZZA",
      headline: ["SLICE INTO", "FLAVOUR."],
      title: "CHICKEN TIKKA SPECIAL PIZZA",  // from the menu (chicken, jalapeños)
      details: "7” 3.49  ·  9” 6.99  ·  12” 8.99  ·  14” 12.99",   // from the menu
      priceLabel: "FROM",
      price: "3.49"                          // from the menu (7")
    },
    {
      id: "milkshake",
      enabled: true,
      animation: "drop",
      duration: 12,
      background: "#EF7030",
      image: "images/milkshake.png",
      imageWidth: 380,
      imageY: 945,
      bigWord: "SHAKE",
      headline: ["YOUR NEXT", "FAVOURITE."],
      title: "MILKSHAKES",
      details: "Ferrero Rocher · Kinder Bueno · Lotus Biscoff · Oreo & more",   // from the menu
      priceLabel: "FROM",
      price: "4.99"                          // from the menu
    }
  ]
};
