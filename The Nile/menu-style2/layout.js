/* PREVIEW ONLY – which sections go on which screen in this style.
   Overrides the layout in ../menu-data.js for these preview pages only;
   items and prices still come from ../menu-data.js. */
window.MENU.screens = {
  1: [
    // sections line up in rows: headings side by side
    "starters",
    { left: ["burgers"], right: ["kebabs"], widths: "46fr 54fr" },
    { left: ["steak"], right: ["chicken"], widths: "46fr 54fr" }
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
