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
   duration   = seconds this promotion stays on screen (10–14 works well).
   price      = the item price.
   mealPrice  = add this to play the same animation a second time showing
                "MAKE IT A MEAL" and this price. Leave it out for no meal run.
   deal       = show a message instead of a price, e.g. ["TOP LINE", "BIG LINE"].
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
      enabled: true,
      animation: "sweep",
      duration: 10.5,
      background: "#EE6A2E",
      image: "images/hot-mexican-burger.png",
      imageWidth: 960,                       // size of the photo on screen (pixels)
      bigWord: "BURGER",                     // giant word behind the food
      headline: ["BIG. BOLD.", "LOADED."],
      title: "HOT MEXICAN BURGER",
      price: "3.79",
      mealPrice: "6.29"
    },
    {
      id: "grilled-chicken-burger",
      enabled: true,
      animation: "slam",
      duration: 10.5,
      background: "#EC632B",
      image: "images/grilled-chicken-burger.png",
      imageWidth: 960,
      slamWords: ["BRING", "THE", "HEAT."],  // shown one at a time; the last one stays behind the food
      headline: ["TURN UP", "THE FLAVOUR."],
      title: "GRILLED CHICKEN BURGER",
      price: "4.29",
      mealPrice: "6.79"
    },
    {
      id: "chicken-tikka-wrap",
      enabled: true,
      animation: "rise",
      duration: 10.5,
      background: "#EE6A2E",
      image: "images/chicken-tikka-wrap.png",
      imageWidth: 880,
      bigWord: "WRAP",
      headline: ["WRAPPED TO", "PERFECTION."],
      title: "CHICKEN TIKKA WRAP",
      price: "3.99",
      mealPrice: "5.99"
    },
    {
      id: "peri-burger",
      enabled: true,
      animation: "sweep",
      from: "left",                          // big word and food come in from the left
      duration: 10.5,
      background: "#EC632B",
      image: "images/peri-burger.png",
      imageWidth: 960,
      bigWord: "PERI",
      headline: ["BIG BITE.", "BIG FLAVOUR."],
      title: "PERI BURGER",
      price: "4.30",
      mealPrice: "6.80"
    },
    {
      id: "pizza",
      enabled: true,
      animation: "spin",
      duration: 11,
      background: "#EA6029",
      image: "images/pizza.png",
      imageWidth: 800,
      shadow: "round",
      bigWord: "PIZZA",
      headline: ["SLICE INTO", "FLAVOUR."],
      title: "CHICKEN TIKKA SPECIAL PIZZA",
      deal: ["ENJOY EXCLUSIVE DEALS ON", "2 x 12”", "PIZZAS"]   // no price shown: small line, BIG line, bottom line
    },
    {
      id: "chicken-fillet-burger",
      enabled: true,
      animation: "rise",
      duration: 10.5,
      background: "#EE6A2E",
      image: "images/chicken-fillet-burger.png",
      imageWidth: 940,
      bigWord: "CHICKEN",
      headline: ["BUILT TO", "SATISFY."],
      title: "CHICKEN FILLET BURGER",
      price: "3.89",
      mealPrice: "6.39"
    },
    {
      id: "chicken-wrap",
      enabled: true,
      animation: "slam",
      duration: 10.5,
      background: "#EC632B",
      image: "images/chicken-wrap.png",
      imageWidth: 820,
      slamWords: ["PACKED", "WITH", "FLAVOUR."],
      headline: ["EVERY BITE", "HITS DIFFERENT."],
      title: "CHICKEN WRAP",
      price: "3.79",
      mealPrice: "5.79"
    },
    {
      id: "milkshakes",
      enabled: true,
      animation: "drop",
      duration: 11,
      background: "#EF7030",
      image: "images/milkshake.png",
      imageWidth: 380,
      imageY: 945,
      bigWord: "SHAKE",
      headline: ["YOUR NEXT", "FAVOURITE."],
      title: "MILKSHAKES",
      details: "Ferrero Rocher · Kinder Bueno · Lotus Biscoff · Oreo & more",
      priceLabel: "FROM",
      price: "4.99"
    }
  ]
};
