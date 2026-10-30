/* =====================================================================
   THE NILE – PROMO SCREEN v2 (test mock-up)
   ---------------------------------------------------------------------
   Each item is a COMPLETE photograph (not cut out). Its background was
   recoloured to orange, and its own backdrop was extended above and below
   so the whole photo can slide in as one layer with no visible edges.

   name      = item name ( \n = new line )
   nameStyle = "write" (hand-drawn, writes itself on) or "build" (chunky letters pop and shake)
   bgStops   = background colours sampled from the photo edge – do not edit
   ===================================================================== */

window.PROMO2 = {
  logo: "../assets/logo.png",
  itemSeconds: 6.5,
  items: [
    {
      id: "grilled-chicken-burger",
      image: "images/grilled-chicken-burger.jpg",
      layerW: 2000, layerH: 3171,        // size of the extended photo (pixels)
      name: "GRILLED CHICKEN\nBURGER",
      nameStyle: "write",
      bgStops: [[0.0, "#fc9105"], [2.49, "#fc9105"], [4.98, "#fd9105"], [7.47, "#fd9105"], [9.97, "#fd9005"], [12.46, "#fd8f05"], [14.95, "#fd8f05"], [17.44, "#fd8e05"], [19.93, "#fd8e05"], [22.42, "#fd8d05"], [24.91, "#fd8c05"], [27.4, "#fd8b05"], [29.9, "#fc8a05"], [32.39, "#fc8905"], [34.88, "#fc8805"], [37.37, "#fd8705"], [39.86, "#fd8605"], [42.35, "#fd8506"], [44.84, "#fd8605"], [47.34, "#fd8405"], [49.83, "#fd8305"], [52.32, "#fc8206"], [54.81, "#fd8005"], [57.3, "#fd7f05"], [59.79, "#fd7906"], [62.28, "#fd7706"], [64.77, "#fc7706"], [67.27, "#fd8205"], [69.76, "#fc8505"], [72.25, "#fd8705"], [74.74, "#fc8705"], [77.23, "#fc8905"], [79.72, "#fc8905"], [82.21, "#fc8a05"], [84.71, "#fc8a05"], [87.2, "#fc8b05"], [89.69, "#fd8b05"], [92.18, "#fc8b05"], [94.67, "#fd8b05"], [97.16, "#fd8b05"], [99.65, "#fd8b04"], [100, "#fc8b04"]]
    },
    {
      id: "peri-burger",
      image: "images/peri-burger.jpg",
      layerW: 2000, layerH: 3171,        // size of the extended photo (pixels)
      name: "PERI\nBURGER",
      nameStyle: "build",
      bgStops: [[0.0, "#fc9005"], [2.49, "#fc9005"], [4.98, "#fc9005"], [7.47, "#fc9005"], [9.97, "#fc8f05"], [12.46, "#fc8f05"], [14.95, "#fc8e05"], [17.44, "#fc8e05"], [19.93, "#fc8d05"], [22.42, "#fc8d05"], [24.91, "#fc8c05"], [27.4, "#fc8b05"], [29.9, "#fc8a05"], [32.39, "#fc8905"], [34.88, "#fd8705"], [37.37, "#fd8705"], [39.86, "#fc8505"], [42.35, "#fc8505"], [44.84, "#fd8406"], [47.34, "#fd8306"], [49.83, "#fd8206"], [52.32, "#fd8005"], [54.81, "#fd7f05"], [57.3, "#fd7e05"], [59.79, "#fd7f06"], [62.28, "#fd8005"], [64.77, "#fc7d06"], [67.27, "#fd7f05"], [69.76, "#fd8106"], [72.25, "#fd8306"], [74.74, "#fc8505"], [77.23, "#fc8605"], [79.72, "#fc8705"], [82.21, "#fc8805"], [84.71, "#fd8805"], [87.2, "#fc8905"], [89.69, "#fc8905"], [92.18, "#fc8904"], [94.67, "#fc8904"], [97.16, "#fd8905"], [99.65, "#fd8904"], [100, "#fc8904"]]
    },
    {
      id: "chicken-fillet-burger",
      image: "images/chicken-fillet-burger.jpg",
      layerW: 2000, layerH: 3172,        // size of the extended photo (pixels)
      name: "CHICKEN FILLET\nBURGER",
      nameStyle: "write",
      bgStops: [[0.0, "#fc9105"], [2.49, "#fc9105"], [4.98, "#fc9105"], [7.47, "#fc9005"], [9.96, "#fc9005"], [12.45, "#fc8f05"], [14.94, "#fc8f06"], [17.43, "#fc8e05"], [19.92, "#fc8d06"], [22.41, "#fc8d06"], [24.91, "#fc8c06"], [27.4, "#fc8b06"], [29.89, "#fc8a06"], [32.38, "#fc8806"], [34.87, "#fc8705"], [37.36, "#fd8606"], [39.85, "#fd8606"], [42.34, "#fd8505"], [44.83, "#fd8305"], [47.32, "#fd8205"], [49.81, "#fd8205"], [52.3, "#fd7f05"], [54.79, "#fd7f05"], [57.28, "#fd7e05"], [59.77, "#fd7e05"], [62.26, "#fd7405"], [64.75, "#fd7405"], [67.24, "#fd7e06"], [69.74, "#fd8005"], [72.23, "#fd8105"], [74.72, "#fc8404"], [77.21, "#fc8504"], [79.7, "#fc8605"], [82.19, "#fc8705"], [84.68, "#fc8704"], [87.17, "#fd8805"], [89.66, "#fc8805"], [92.15, "#fc8804"], [94.64, "#fc8805"], [97.13, "#fc8805"], [99.62, "#fd8804"], [100, "#fd8805"]]
    }
  ]
};
