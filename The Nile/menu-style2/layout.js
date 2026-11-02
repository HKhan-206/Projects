/* PREVIEW ONLY – which sections go on which screen in this style.
   Overrides the layout in ../menu-data.js for these preview pages only;
   items and prices still come from ../menu-data.js. */
window.MENU.screens = {
  1: [
    // read the left column top to bottom, then the right
    { left: ["starters", "burgers", "steak"], right: ["kebabs", "chicken"], widths: "46fr 54fr" }
  ],
  2: [
    "pizzas",
    "garlic",
    "sides"
  ],
  3: [
    "sauces",
    "cakes",
    { left: ["milkshakes"], right: ["cookie", "icecream", "slushes", "drinks"], widths: "46fr 54fr" }
  ]
};

// in this preview Starters sits in a narrow column, so show it as one list
window.MENU.sections.starters.split = 1;
