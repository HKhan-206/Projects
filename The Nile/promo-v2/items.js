/* =====================================================================
   THE NILE – PROMO SCREEN v2 (test mock-up)
   ---------------------------------------------------------------------
   Each item is a COMPLETE photograph (not cut out). Its background was
   recoloured to orange and its own backdrop extended above and below, so
   the whole photo slides in as one layer with no visible edges.

   title    = the big brush lettering, one line each: ["WORD", "white" or "yellow"]
   tagline  = the two lines on the small dark brush panel (top line white, bottom yellow)
   veg      = true to show the flying tomato and cucumber slices
   bgStops  = background colours sampled from the photo edge – do not edit
   ===================================================================== */

window.PROMO2 = {
  itemSeconds: 7.5,
  items: [
    {
      id: "grilled-chicken-burger",
      image: "images/grilled-chicken-burger.jpg",
      front: { src: "images/grilled-chicken-burger-front.png", x: 318, y: 1578, w: 1389, h: 847 },   // burger-only top layer (same pixels as the photo)
      layerW: 2000, layerH: 3193,
      title: [["GRILLED", "white"], ["CHICKEN", "white"], ["BURGER", "yellow"]],
      tagline: ["FRESHLY GRILLED", "FULL OF FLAVOUR"],
      veg: true,
      bgStops: [[0.0, "#fc9105"], [2.47, "#fc9105"], [4.95, "#fd9105"], [7.42, "#fd9105"], [9.9, "#fd9105"], [12.37, "#fd9105"], [14.84, "#fd9105"], [17.32, "#fd9105"], [19.79, "#fd9005"], [22.27, "#fd8f05"], [24.74, "#fd8f05"], [27.22, "#fd8e05"], [29.69, "#fd8d05"], [32.16, "#fd8d05"], [34.64, "#fd8c05"], [37.11, "#fd8b05"], [39.59, "#fc8a05"], [42.06, "#fc8805"], [44.53, "#fd8805"], [47.01, "#fd8705"], [49.48, "#fd8705"], [51.96, "#fd8705"], [54.43, "#fc8405"], [56.91, "#fd8206"], [59.38, "#fd8206"], [61.85, "#fd8105"], [64.33, "#fd8006"], [66.8, "#fd8006"], [69.28, "#fd7805"], [71.75, "#fc7505"], [74.22, "#fd8206"], [76.7, "#fd8305"], [79.17, "#fd8605"], [81.65, "#fc8705"], [84.12, "#fc8805"], [86.6, "#fc8905"], [89.07, "#fc8a05"], [91.54, "#fc8a05"], [94.02, "#fd8b05"], [96.49, "#fd8b05"], [98.97, "#fd8b04"], [100, "#fd8b04"]]
    },
    {
      id: "peri-burger",
      image: "images/peri-burger.jpg",
      front: { src: "images/peri-burger-front.png", x: 393, y: 1631, w: 1386, h: 775 },   // burger-only top layer (same pixels as the photo)
      layerW: 2000, layerH: 3193,
      title: [["PERI", "white"], ["BURGER", "yellow"]],
      tagline: ["BRING THE HEAT", "TURN UP THE FLAVOUR"],
      veg: true,
      bgStops: [[0.0, "#fc9005"], [2.47, "#fc9005"], [4.95, "#fc9005"], [7.42, "#fc9005"], [9.9, "#fc9005"], [12.37, "#fc9005"], [14.84, "#fc9005"], [17.32, "#fc9005"], [19.79, "#fc8f05"], [22.27, "#fc8f05"], [24.74, "#fc8e05"], [27.22, "#fc8d05"], [29.69, "#fc8d05"], [32.16, "#fc8c05"], [34.64, "#fc8c05"], [37.11, "#fc8b05"], [39.59, "#fc8905"], [42.06, "#fc8805"], [44.53, "#fd8705"], [47.01, "#fd8605"], [49.48, "#fd8605"], [51.96, "#fd8405"], [54.43, "#fd8306"], [56.91, "#fd8306"], [59.38, "#fd8106"], [61.85, "#fd7f05"], [64.33, "#fc7e05"], [66.8, "#fd7f05"], [69.28, "#fd7f05"], [71.75, "#fd7a06"], [74.22, "#fd8005"], [76.7, "#fd8005"], [79.17, "#fd8305"], [81.65, "#fc8405"], [84.12, "#fc8505"], [86.6, "#fc8705"], [89.07, "#fc8805"], [91.54, "#fc8805"], [94.02, "#fc8804"], [96.49, "#fc8905"], [98.97, "#fc8905"], [100, "#fd8905"]]
    },
    {
      id: "chicken-fillet-burger",
      image: "images/chicken-fillet-burger.jpg",
      front: { src: "images/chicken-fillet-burger-front.png", x: 356, y: 1566, w: 1309, h: 858 },   // burger-only top layer (same pixels as the photo)
      layerW: 2000, layerH: 3194,
      title: [["CHICKEN", "white"], ["FILLET", "white"], ["BURGER", "yellow"]],
      tagline: ["CRISPY & GOLDEN", "BUILT TO SATISFY"],
      veg: true,
      bgStops: [[0.0, "#fc9105"], [2.47, "#fc9105"], [4.95, "#fc9105"], [7.42, "#fc9105"], [9.89, "#fc9105"], [12.37, "#fc9105"], [14.84, "#fc9105"], [17.31, "#fc9005"], [19.79, "#fc8f05"], [22.26, "#fc8f05"], [24.73, "#fc8e06"], [27.21, "#fc8e06"], [29.68, "#fc8d06"], [32.15, "#fc8c06"], [34.63, "#fc8c06"], [37.1, "#fc8b06"], [39.57, "#fc8906"], [42.05, "#fc8706"], [44.52, "#fd8706"], [46.99, "#fd8606"], [49.47, "#fd8606"], [51.94, "#fd8305"], [54.41, "#fd8305"], [56.89, "#fc8205"], [59.36, "#fd8106"], [61.83, "#fd8005"], [64.31, "#fd7f05"], [66.78, "#fd7e05"], [69.25, "#fc7606"], [71.73, "#fd7305"], [74.2, "#fc7d05"], [76.68, "#fd8005"], [79.15, "#fd8005"], [81.62, "#fc8205"], [84.1, "#fc8405"], [86.57, "#fc8605"], [89.04, "#fd8704"], [91.52, "#fc8704"], [93.99, "#fc8705"], [96.46, "#fd8804"], [98.94, "#fc8805"], [100, "#fc8804"]]
    }
  ]
};
