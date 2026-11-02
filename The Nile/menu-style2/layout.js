/* PREVIEW ONLY – which sections go on which screen in this style.
   Overrides the layout in ../menu-data.js for these preview pages only;
   items and prices still come from ../menu-data.js. */
// allergy notice shown at the bottom of screen 2 (preview only)
window.MENU.sections.allergy = {
  title: "Allergy Advice",
  items: [],
  info: ["Please tell a member of staff about any allergies before ordering. Our food is prepared in a kitchen that handles all 14 major allergens, including nuts, sesame, gluten, milk and eggs, so we cannot guarantee any dish is allergen-free."]
};

window.MENU.screens = {
  1: [
    "starters",
    "pizzas",
    "garlic"
  ],
  2: [
    // three tidy rows, headings level with each other
    { left: ["kebabs"], right: ["burgers"], widths: "53fr 47fr" },
    { left: ["steak"], right: ["chicken"], widths: "46fr 54fr" },
    "sides",
    "allergy"
  ],
  3: [
    "sauces",
    "cakes",
    { left: ["milkshakes"], right: ["cookie", "icecream", "slushes", "drinks"], widths: "46fr 54fr" }
  ]
};

// fixed text sizes: screens 2 and 3 as large as fits (a few long names wrap);
// screen 1 sizes itself. The allergy advice keeps its own size.
window.PREVIEW_FS = { 2: 22.5, 3: 26.75 };
