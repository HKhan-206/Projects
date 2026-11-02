/* PREVIEW ONLY – which sections go on which screen in this style, plus a few
   shortened sections. Overrides ../menu-data.js for these preview pages only;
   the live menu screens and their data are not affected. */

// Drinks: just the groups and prices (no list of drink names)
window.MENU.sections.drinks.items = [
  ["Cans", "1.39"],
  ["0.5 Bottles", "1.99"],
  ["1.25 Bottles", "3.49"],
  ["Water Bottle", "0.99"]
];

// Sauces: tubs and bottles only
window.MENU.sections.sauces.items = [
  ["Tubs", "0.50"],
  ["Bottles", "3.99"]
];
window.MENU.sections.sauces.split = 2;

window.MENU.sections.chicken.split = 2;   // Chicken shown in two columns

window.MENU.screens = {
  1: [
    "starters",
    "pizzas",
    "garlic"
  ],
  2: [
    { left: ["burgers"], right: ["steak"], widths: "52fr 48fr" },
    "kebabs",
    "chicken"
  ],
  3: [
    "sauces",
    "sides",
    "cakes",
    { left: ["milkshakes"], right: ["cookie", "icecream", "slushes", "drinks"], widths: "46fr 54fr" }
  ]
};
