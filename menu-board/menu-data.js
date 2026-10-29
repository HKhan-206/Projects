/* =====================================================================
   THE NILE – MENU DATA
   ---------------------------------------------------------------------
   This is the only file you need to edit to change names or prices.

   HOW TO EDIT
   - Change a price:   edit the text in quotes, e.g. "3.49" -> "3.59"
   - Change a name:    edit the name in quotes.
   - Add an item:      copy a whole line like
                         ["Beef Burger", "3.59"],
                       paste it where you want it and change it.
   - Remove an item:   delete its whole line.
   - Leave a price cell empty:  use ""  (it shows as a blank space).
   - A price with a small label in front:  { l: "Only", p: "3.99" }

   Each item is:  ["Name", price, price, ...]
   In sections with column headings (head), the prices line up
   under the headings from left to right.
   In sections without headings, prices sit on the right.

   After saving, refresh the browser on the TV (or restart it).
   The text size adjusts itself automatically so everything fits.
   ===================================================================== */

window.MENU = {

  /* ---------------- SECTIONS ---------------- */
  sections: {

    starters: {
      title: "Starters",
      items: [
        ["2x Seekh Kebabs", "3.49"],
        ["2x Meat Samosas", "3.29"],
        ["5x Chicken Pakoras", "3.29"],
        ["4x Lamb Chops", "6.99"],
        ["Chicken Tikka", { l: "Reg", p: "4.99" }, { l: "Lrg", p: "6.48" }],
        ["Mix Grill Starters", "8.99"],
        ["Nachos", "4.99"]
      ]
    },

    pizzas: {
      title: "Pizzas",
      head: ["7”", "9”", "12”", "14”"],
      items: [
        ["Asian Style Pizza", "3.99", "7.49", "9.99", "13.49"],
        ["Caribbean Pizza", "3.49", "6.99", "8.99", "12.99"],
        ["Chicken Feast Pizza", "3.49", "6.99", "8.99", "12.99"],
        ["Chicken and Pineapple Pizza", "3.49", "6.99", "8.99", "12.99"],
        ["Chicken Tikka Special Pizza", "3.49", "6.99", "8.99", "12.99"],
        ["Donner Delight Pizza", "4.49", "7.99", "10.99", "13.99"],
        ["Hawaiian Pizza", "3.49", "6.99", "8.99", "12.99"],
        ["Hot Spicy Mince Pizza", "3.49", "6.99", "8.99", "12.99"],
        ["Hot and Spicy Pizza", "3.49", "6.99", "8.99", "12.99"],
        ["Margherita Pizza", "2.99", "5.49", "6.99", "8.99"],
        ["Meat Feast Pizza", "3.99", "7.49", "9.99", "13.49"],
        ["Mexican Special Pizza", "3.49", "6.99", "8.99", "12.99"],
        ["Nile Special Pizza", "3.99", "7.49", "9.99", "13.49"],
        ["Pepperoni Special Pizza", "3.49", "6.99", "8.99", "12.99"],
        ["Pepperoni Pizza", "3.49", "6.99", "8.99", "12.99"],
        ["Pollo Pizza", "3.49", "6.99", "8.99", "12.99"],
        ["Seafood Pizza", "3.99", "7.49", "9.99", "13.49"],
        ["Steak Grill Mixed Pizza", "4.49", "7.99", "10.99", "13.99"],
        ["Tuna and Sweet Corn Pizza", "3.49", "6.99", "8.99", "12.99"],
        ["Vegetarian Pizza", "3.49", "6.99", "8.99", "12.99"],
        ["Vegetarian Hot Pizza", "3.49", "6.99", "8.99", "12.99"],
        ["Vegetarian Sweet Pizza", "3.49", "6.99", "8.99", "12.99"],
        ["Two Halves Pizza", "", "7.49", "9.99", "13.49"],
        ["Asian Style Calzone", "", "7.49", "9.99", "12.49"],
        ["Calzone Pizza", "", "7.99", "10.99", "13.99"]
      ],
      note: "Make it a meal +2.50"
    },

    garlic: {
      title: "Garlic Breads",
      head: ["7”", "9”", "12”", "14”"],
      items: [
        ["Garlic Bread with Garlic Butter", "2.99", "3.79", "4.79", "7.49"],
        ["Garlic Bread with Cheese and Garlic Butter", "3.99", "4.99", "5.99", "9.99"],
        ["Garlic Bread with Tomato and Garlic Butter", "3.99", "5.49", "5.99", "9.99"],
        ["Garlic Bread with Cheese, Garlic Butter and Mushroom", "4.49", "5.59", "6.59", "9.99"],
        ["Garlic Bread with Cheese, Tomato and Garlic Butter", "4.49", "5.99", "6.99", "11.99"]
      ],
      note: "Make it a meal +2.50"
    },

    burgers: {
      title: "Burgers",
      items: [
        ["Beef Burger", "3.59"],
        ["Cheese Burger", "3.69"],
        ["Hot Mexican Burger", "3.79"],
        ["Hawaiian Burger", "3.69"],
        ["Grilled Chicken Burger", "4.29"],
        ["Peri Burger", "4.30"],
        ["Chicken Fillet Burger", "3.89"],
        ["Sizzler Burger", "3.99"],
        ["Chicken Burger", "3.59"],
        ["Mega Burger", "4.49"],
        ["Egg Burger", "4.49"],
        ["Vegetarian Burger", "3.59"],
        ["Fish Burger", "3.49"],
        ["Donner Burger", "3.59"]
      ],
      note: "Make it a meal +2.50, all burgers +2.00 for double apart from Donner burger no double option, +3.50 for triple only beef burger, cheese burger, hot Mexican burger, Hawaiian burger, and egg burger"
    },

    steak: {
      title: "The Steak House",
      head: ["Reg", "Lrg"],
      items: [
        ["Nile Special", "11.99", "13.98"],
        ["Beef Steak", "9.99", "11.98"],
        ["Beef Steak and Chicken", "9.99", "11.98"],
        ["Beef Steak and Donner", "9.99", "11.98"],
        ["Chicken and Donner", "9.99", "11.98"],
        ["Chicken Stir Fry", "8.49", "10.48"],
        ["Donner Stir Fry", "7.99", "9.98"],
        ["Mix Grill", "7.99", "9.98"],
        ["Lamb Chops Meal", "9.99", "12.99"]
      ],
      note: "All items under steak house can come on either chips, naan, rice, spiral fries, or potato wedges. Extra charges may apply"
    },

    kebabs: {
      title: "Kebabs",
      group: [["Naan", 2], ["Pitta", 2]],
      head: ["Reg", "Lrg", "Reg", "Lrg"],
      items: [
        ["Shish Kebab", "9.99", "11.99", "7.99", "9.99"],
        ["Mixed Shish Kebab", "9.99", "11.99", "7.99", "9.99"],
        ["Shish and Donner Kebab", "9.99", "11.99", "7.99", "9.99"],
        ["Peri Chicken Kebab", "7.50", "9.49", "", ""],
        ["Chicken Kebab", "6.99", "8.48", "6.49", "8.28"],
        ["Donner Kebab", "6.49", "7.98", "5.99", "6.49"],
        ["Mix Kebab", "7.49", "8.98", "6.99", "8.98"],
        { head: ["", "", "Reg", "Lrg"] },
        ["Kebab Roll", "", "", "3.99", "5.98"],
        ["Donner Meat on Chips", "", "", "5.69", "7.68"],
        ["Donner Wrap", "", "", "", "2.99"]
      ],
      note: "Make it a meal +2.50 all items under kebabs apart from Donner meat chips no option for meal"
    },

    chicken: {
      title: "Chicken",
      cols: 2,           // items with more prices continue on a second line
      items: [
        ["Chicken Tikka Wrap", { l: "Only", p: "3.99" }, { l: "Meal", p: "5.99" }],
        ["Chicken Tikka on Chips", { l: "Reg", p: "6.99" }, { l: "Lrg", p: "8.98" }],
        ["Chicken Tikka Rice", { l: "Reg", p: "7.00" }, { l: "Lrg", p: "8.99" }],
        ["Chicken Tikka Spirals", { l: "Reg", p: "7.50" }, { l: "Lrg", p: "9.50" }],
        ["Peri Chicken and Chips", { l: "Reg", p: "7.50" }, { l: "Lrg", p: "9.49" }],
        ["Chicken Wrap", { l: "Only", p: "3.79" }, { l: "Meal", p: "5.79" }],
        ["Chicken Nuggets", { l: "Only", p: "3.49" }, { l: "Meal", p: "5.98" }],
        ["Hot and Spicy Wings", { l: "Only", p: "3.49" }, { l: "Meal", p: "5.49" }],
        ["Popcorn Chicken", { l: "Reg Only", p: "3.49" }, { l: "Meal", p: "5.49" }, { l: "Lrg Only", p: "4.50" }, { l: "Meal", p: "6.50" }],
        ["Chicken Strips", { l: "Only", p: "3.69" }, { l: "Meal", p: "5.69" }]
      ]
    },

    sides: {
      title: "Side Orders",
      // shown as two columns side by side: the first list on the left, the second on the right
      columns: [
        {
          head: ["Reg", "Lrg"],
          items: [
            ["Fries", "1.99", "2.99"],
            ["Cheesy Fries", "2.99", "3.99"],
            ["Spiral Fries", "2.99", "3.99"],
            ["Cheesy Spiral Fries", "4.19", "5.29"],
            ["Potato Wedges", "2.99", "3.99"],
            ["Cheesy Potato Wedges", "4.19", "5.29"],
            ["Donner Portion", "3.99", "5.99"],
            ["Onion Rings", "2.99", "3.99"]
          ]
        },
        {
          items: [
            ["Chilli Pepper Cheese Nuggets", { l: "Only", p: "3.79" }, { l: "Meal", p: "5.79" }],
            ["Hash Browns", "1.99"],
            ["Mozzarella Cheese Sticks", { l: "Only", p: "3.99" }, { l: "Meal", p: "5.99" }],
            ["Garlic Mushrooms", "4.00"],
            ["Garlic Mushrooms Cheese", "5.00"],
            ["Naan", "0.99"],
            ["Garlic Naan", "1.49"],
            ["Cheese Naan", "1.99"],
            ["Toasted Pitta Bread", "0.49"],
            ["Portion of Rice", "1.79"],
            ["Salad Portion", "1.09"],
            ["Chilli Pickles Tray", "1.19"]
          ]
        }
      ]
    },

    sauces: {
      title: "Sauces",
      items: [
        ["Chilli Sauce", "0.50"],
        ["Garlic Sauce", "0.50"],
        ["Ketchup", "0.50"],
        ["Mayo", "0.50"],
        ["BBQ Sauce", "0.50"],
        ["Mint Sauce", "0.50"],
        ["Mango Chutney", "0.50"],
        ["Onion Chutney", "0.50"],
        ["Garlic Sauce Bottle", "3.99"],
        ["Chilli Sauce Bottle", "3.99"]
      ]
    },

    cakes: {
      title: "Cakes",
      items: [
        ["Chocolate Gateau", "3.49"],
        ["Matilda Fudge Cake", "5.49"],
        ["Victoria Sponge Cake", "3.49"],
        ["New York Cheesecake", "3.49"],
        ["Peanut Butter Stack", "3.99"],
        ["Original Dream Cake", "4.99"],
        ["Biscoff Milk Cake", "4.99"],
        ["Nutella Milk Cake", "4.99"],
        ["Oreo Milk Cake", "4.99"],
        ["Pistachio Milk Cake", "4.99"],
        ["Flake Milk Cake", "4.99"],
        ["Jam and Coconut Pudding", "5.49"],
        ["Classic Tiramisu", "4.99"]
      ],
      note: "All items under cakes +1.00 for ice cream, +1.99 for custard"
    },

    milkshakes: {
      title: "Milkshakes",
      items: [
        ["Ferrero Rocher Milkshake", "4.99"],
        ["Snickers Milkshake", "4.99"],
        ["Kinder Bueno Milkshake", "4.99"],
        ["Flake Milkshake", "4.99"],
        ["Aero Mint Milkshake", "4.99"],
        ["Aero Chocolate Milkshake", "4.99"],
        ["Terry’s Chocolate Orange Milkshake", "4.99"],
        ["Skittles Milkshake", "4.99"],
        ["Bubblegum Millions Milkshake", "4.99"],
        ["Strawberry Millions Milkshake", "4.99"],
        ["Maltesers Milkshake", "4.99"],
        ["Lotus Biscoff Milkshake", "4.99"],
        ["Oreo Milkshake", "4.99"],
        ["White Kinder Bueno Milkshake", "4.99"],
        ["Vanilla Milkshake", "4.99"],
        ["007 Milkshake", "6.00"],
        ["Ghost Milkshake", "6.00"],
        ["Avatar Milkshake", "6.00"],
        ["The Nile Milkshake", "6.50"],
        ["Shake Your Own"]
      ]
    },

    cookie: {
      title: "Cookie Doughs",
      items: [
        ["Chocolate Cookie Dough", "4.99"],
        ["White Chocolate Cookie Dough", "4.99"],
        ["Mix Cookie Dough", "4.99"]
      ]
    },

    icecream: {
      title: "Ice Creams",
      items: [
        ["Regular Ice Cream", "1.69"],
        ["Large Ice Cream", "2.80"],
        ["Ben & Jerry’s Chocolate Fudge Brownie", "4.99"],
        ["Ben & Jerry’s Cookie Dough", "4.99"]
      ]
    },

    slushes: {
      title: "Slushes",
      items: [
        ["Mix Slush", "2.49"],
        ["Blue Raspberry Slush", "2.49"],
        ["Strawberry Slush", "2.49"],
        ["Mango & Orange Slush", "2.49"]
      ]
    },

    drinks: {
      title: "Drinks",
      items: [
        ["Coke", "1.39"],
        ["Coke Zero", "1.39"],
        ["Diet Coke", "1.39"],
        ["Dr Pepper", "1.39"],
        ["Fanta Fruit Twist", "1.39"],
        ["Irn-Bru", "1.39"],
        ["Pepsi", "1.39"],
        ["Pepsi Max", "1.39"],
        ["Vimto", "1.39"],
        ["7up", "1.39"],
        ["Rio", "1.39"],
        ["Irn Bru Xtra", "1.39"],
        ["Rubicon Mango", "1.39"],
        ["Rubicon Guava", "1.39"],
        ["Rubicon Passion", "1.39"],
        ["Tango", "1.39"],
        ["Strawberry Miranda", "1.39"],
        ["Water bottle", "0.99"],
        ["Coke Bottle 0.5", "1.99"],
        ["Diet Coke Bottle 0.5", "1.99"],
        ["Fanta Fruit Twist Bottle 0.5", "1.99"],
        ["Irn Bru Bottle 0.5", "1.99"],
        ["Oasis Bottle 0.5", "1.99"],
        ["Coke Bottle 1.25", "3.49"],
        ["Diet Coke Bottle 1.25", "3.49"]
      ]
    }
  },

  /* ---------------- SCREEN LAYOUT ----------------
     Which sections go on which screen.
     A plain name = full width.
     { left: [...], right: [...] } = two columns side by side
       (read the left column top to bottom, then the right).
       widths: "46fr 54fr" makes one column wider than the other.
     "logo" = the small logo.
  ------------------------------------------------ */
  screens: {
    1: [
      { left: ["starters"], right: ["logo"], widths: "60fr 40fr" },
      "pizzas",
      "garlic"
    ],
    2: [
      { left: ["burgers", "steak"], right: ["logo", "kebabs", "chicken"], widths: "45fr 55fr" },
      "sides"
    ],
    3: [
      { left: ["sauces", "cakes", "milkshakes"], right: ["logo", "cookie", "icecream", "slushes", "drinks"] }
    ]
  }
};
