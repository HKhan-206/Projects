/* PREVIEW ONLY – which sections go on which screen in this style.
   Overrides the layout in ../menu-data.js for these preview pages only;
   items and prices still come from ../menu-data.js. */
// allergy notice shown at the bottom of screen 2 (preview only)
window.MENU.sections.allergy = {
  title: "Allergy Advice",
  items: [],
  info: ["If you have a food allergy or intolerance, please tell a member of staff before you order. Information on the 14 allergens in our food is available on request."]
};

window.MENU.screens = {
  1: [
    "starters",
    "pizzas",
    "garlic"
  ],
  2: [
    // three tidy rows, headings level with each other
    { left: ["kebabs"], right: ["burgers"], widths: "56fr 44fr" },
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
