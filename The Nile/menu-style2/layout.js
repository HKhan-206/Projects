/* PREVIEW ONLY – which sections go on which screen in this style.
   Overrides the layout in ../menu-data.js for these preview pages only;
   items and prices still come from ../menu-data.js. */
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
    "sides"
  ],
  3: [
    "sauces",
    "cakes",
    { left: ["milkshakes"], right: ["cookie", "icecream", "slushes", "drinks"], widths: "46fr 54fr" }
  ]
};
