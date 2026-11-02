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
    { left: ["burgers", "steak"], right: ["kebabs", "chicken"], widths: "44fr 56fr" },
    "sides"
  ],
  3: [
    "sauces",
    "cakes",
    { left: ["milkshakes"], right: ["cookie", "icecream", "slushes", "drinks"], widths: "46fr 54fr" }
  ]
};
