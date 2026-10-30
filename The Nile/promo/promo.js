/* The Nile – animated promo screen engine.
   All words, prices and photos live in promos.js – you should not need to edit this file.

   Preview options (add to the address):
     ?promo=wrap      play only one promotion (use its id from promos.js)
     ?t=5             freeze at 5 seconds (handy for checking a layout)
     ?rotate=90       if the screen is mounted on its side but the player outputs landscape */
(function () {
  "use strict";

  var CFG = window.PROMO_CONFIG || { promos: [] };
  var S = Object.assign({
    logo: "../assets/logo.png",
    motionBlur: true,
    wipeColour: "#111111",
    refreshHours: 3
  }, CFG.settings || {});

  var params = new URLSearchParams(location.search);
  var onlyId = params.get("promo");
  var freezeAt = params.has("t") ? parseFloat(params.get("t")) : null;
  var rotate = parseInt(params.get("rotate") || "0", 10);
  if (params.get("blur") === "0") S.motionBlur = false;   // ?blur=0 turns motion blur off

  var W = 1080, H = 1920;
  var L = { headlineY: 300, foodCY: 1000, bigCY: 990 };
  var MAXW = 1000;   // widest any word may be (screen is 1080)
  // where the name, details and price sit (closer together when there are no details)
  function slots(p) {
    if (p.deal) return { titleY: 1390, detailsY: 1470, priceY: 1480 };
    if (!p.price) return { titleY: 1450, detailsY: 1660, priceY: 1700 };   // name only, no price
    return p.details ? { titleY: 1392, detailsY: 1484, priceY: 1576 } : { titleY: 1420, detailsY: 1500, priceY: 1530 };
  }
  var NS = "http://www.w3.org/2000/svg";

  var stage = document.getElementById("stage");
  var defs = document.getElementById("fx-defs");
  var images = {};

  /* ---------- small helpers ---------- */
  function el(tag, cls, parent, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  function rgb(hex) {
    hex = String(hex).replace("#", "");
    if (hex.length === 3) hex = hex.split("").map(function (c) { return c + c; }).join("");
    var n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mix(hex, target, amt) {
    var a = rgb(hex), b = rgb(target);
    return "rgb(" + a.map(function (v, i) { return Math.round(v + (b[i] - v) * amt); }).join(",") + ")";
  }
  // stacked shadows give lettering a solid 3D "extruded" edge
  function extrude(colour, depth, soft) {
    var s = [];
    for (var i = 1; i <= depth; i++) s.push((i * 0.6).toFixed(1) + "px " + i + "px 0 " + colour);
    if (soft) s.push((depth * 0.6) + "px " + (depth * 2.2) + "px " + (depth * 2.6) + "px rgba(40,8,0,0.28)");
    return s.join(",");
  }
  function paint(node, style, size, base, soft) {
    var depth = Math.max(3, Math.round(size * 0.034));
    if (style === "white") {
      node.style.color = "#ffffff";
      node.style.textShadow = extrude(mix(base, "#000000", 0.38), depth, soft);
    } else {
      node.style.color = "#121212";
      node.style.textShadow = extrude(mix(base, "#000000", 0.62), depth, soft);
    }
  }
  function fitWidth(node, maxW, minPx) {
    var fs = parseFloat(node.style.fontSize || getComputedStyle(node).fontSize);
    while (node.offsetWidth > maxW && fs > minPx) { fs -= 2; node.style.fontSize = fs + "px"; }
    return fs;
  }
  function splitChars(node) {
    var text = node.textContent, out = [];
    node.textContent = "";
    Array.from(text).forEach(function (c) { out.push(el("span", "ch", node, c === " " ? " " : c)); });
    return out;
  }

  /* ---------- motion blur (SVG filter, horizontal or vertical) ---------- */
  var fxCount = 0;
  function blur(tl, target, amount, dur, at, dir) {
    if (!S.motionBlur || !amount) return;
    var id = "mb" + (fxCount++);
    var f = document.createElementNS(NS, "filter");
    f.setAttribute("id", id);
    f.setAttribute("x", "-25%"); f.setAttribute("y", "-25%");
    f.setAttribute("width", "150%"); f.setAttribute("height", "150%");
    f.setAttribute("color-interpolation-filters", "sRGB");
    var g = document.createElementNS(NS, "feGaussianBlur");
    g.setAttribute("stdDeviation", "0 0");
    f.appendChild(g);
    defs.appendChild(f);
    var from = dir === "y" ? "0 " + amount : dir === "xy" ? amount + " " + amount : amount + " 0";
    tl.set(target, { filter: "url(#" + id + ")" }, at);
    tl.fromTo(g, { attr: { stdDeviation: from } }, { attr: { stdDeviation: "0 0" }, duration: dur, ease: "power2.out", immediateRender: false }, at);
    tl.set(target, { filter: "none" }, at + dur);
  }

  function blurOut(tl, target, amount, dur, at, dir) {
    if (!S.motionBlur || !amount) return;
    var id = "mb" + (fxCount++);
    var f = document.createElementNS(NS, "filter");
    f.setAttribute("id", id);
    f.setAttribute("x", "-25%"); f.setAttribute("y", "-25%");
    f.setAttribute("width", "150%"); f.setAttribute("height", "150%");
    var g = document.createElementNS(NS, "feGaussianBlur");
    g.setAttribute("stdDeviation", "0 0");
    f.appendChild(g);
    defs.appendChild(f);
    var to = dir === "y" ? "0 " + amount : dir === "xy" ? amount + " " + amount : amount + " 0";
    tl.set(target, { filter: "url(#" + id + ")" }, at);
    tl.fromTo(g, { attr: { stdDeviation: "0 0" } }, { attr: { stdDeviation: to }, duration: dur, ease: "power2.in", immediateRender: false }, at);
    tl.set(target, { filter: "none" }, at + dur + 0.05);
  }

  /* ---------- building blocks ---------- */
  function buildScene(p) {
    var sc = { p: p, base: p.background || "#EE6A2E" };
    sc.root = el("section", "scene", stage);
    sc.bg = el("div", "bg", sc.root);
    sc.bg.style.background = "radial-gradient(120% 78% at 50% 46%, " + mix(sc.base, "#ffffff", 0.14) + " 0%, " +
      sc.base + " 50%, " + mix(sc.base, "#000000", 0.24) + " 100%)";
    sc.tone = mix(sc.base, "#000000", 0.14);
    sc.glow = el("div", "glow", sc.root);
    sc.back = el("div", "layer back", sc.root);
    sc.foodWrap = el("div", "food-wrap", sc.root);
    sc.shadow = el("div", "food-shadow", sc.foodWrap);
    sc.img = el("img", "food", sc.foodWrap);
    sc.img.src = p.image;
    sc.img.alt = "";
    sc.front = el("div", "layer front", sc.root);
    sc.logo = el("div", "logo", sc.root);
    var li = el("img", null, sc.logo);
    li.src = S.logo;
    li.alt = "The Nile";
    placeFood(sc, p);
    return sc;
  }

  function placeFood(sc, p) {
    var im = images[p.image];
    var ratio = im && im.naturalWidth ? im.naturalHeight / im.naturalWidth : 0.62;
    var w = p.imageWidth || 940, h = Math.round(w * ratio);
    var cx = p.imageX || 540;
    var top = p.anchorBottom ? H - h + (p.bottomOffset || 30) : (p.imageY || L.foodCY) - h / 2;
    Object.assign(sc.foodWrap.style, { left: (cx - w / 2) + "px", top: top + "px", width: w + "px", height: h + "px" });
    var kind = p.shadow || (p.anchorBottom ? "none" : "floor");
    var s = sc.shadow.style;
    if (kind === "none") s.display = "none";
    else if (kind === "round") Object.assign(s, { left: (w * 0.02) + "px", top: (h * 0.07) + "px", width: (w * 0.98) + "px", height: (h * 0.98) + "px" });
    else Object.assign(s, { left: (w * 0.06) + "px", top: (h - w * 0.075) + "px", width: (w * 0.88) + "px", height: (w * 0.14) + "px" });
    sc.foodTop = top; sc.foodH = h; sc.foodW = w;
  }

  function bigWord(sc, text, size, cy, style, letters) {
    var wrap = el("div", "big-wrap", sc.back);
    var strong = el("div", "big", wrap, text);
    var tone = el("div", "big tone", wrap, text);
    var fs = size;
    wrap.style.fontSize = fs + "px";
    while (strong.offsetWidth > MAXW && fs > 80) { fs -= 6; wrap.style.fontSize = fs + "px"; }   // always fits on screen
    wrap.style.top = Math.round(cy - fs * 0.41) + "px";
    paint(strong, style || "black", fs, sc.base, true);
    tone.style.color = sc.tone;
    var b = { wrap: wrap, strong: strong, tone: tone, x0: (W - strong.offsetWidth) / 2 };
    if (letters) b.chars = splitChars(strong);
    sc.big = b;
    return b;
  }

  function headline(sc, lines, y, size) {
    var box = el("div", "headline", sc.front);
    box.style.top = (y || L.headlineY) + "px";
    return (lines || []).map(function (t, i) {
      var row = el("div", "row", box);
      var line = el("span", "line", row, t);
      line.style.fontSize = (size || 118) + "px";
      var fs = fitWidth(line, 1000, 56);
      paint(line, i % 2 ? "white" : "black", fs, sc.base, false);
      return line;
    });
  }

  function titleBlock(sc, p, y) {
    var box = el("div", "title", sc.front);
    box.style.top = y + "px";
    var chars = [];
    String(p.title || "").split("\n").forEach(function (t) {
      var row = el("div", "row", box);
      var line = el("span", "line", row, t);
      line.style.fontSize = (p.titleSize || 74) + "px";
      fitWidth(line, 1000, 40);
      chars = chars.concat(splitChars(line));
    });
    return { box: box, chars: chars };
  }

  function detailsBlock(sc, p, y) {
    var d = el("div", "details", sc.front);
    var line = el("span", "line", d, p.details || "");
    line.style.fontSize = "44px";
    fitWidth(line, 960, 28);          // keep details on one line
    d.style.top = y + "px";
    return d;
  }

  function priceBlock(sc, p, cx, y, size, maxW) {
    var b = el("div", "price", sc.root);
    if (p.priceLabel) el("div", "price-label", b, p.priceLabel);
    var row = el("div", "price-row", b);
    el("span", "cur", row, "£");
    var val = el("span", "val", row, p.price || "");
    row.style.fontSize = (size || 214) + "px";
    var fs = size || 214;
    while (b.offsetWidth > (maxW || 960) && fs > 60) { fs -= 4; row.style.fontSize = fs + "px"; }
    b.style.left = (cx - b.offsetWidth / 2) + "px";
    b.style.top = y + "px";
    return { box: b, val: val };
  }

  // deal message instead of a price: [small top line, BIG middle line, bottom line]
  function dealBlock(sc, p, cx, y, maxW) {
    var b = el("div", "price deal", sc.root);
    var lim = (maxW || 960) - 108;
    if (p.deal[0]) {
      var top = el("div", "price-label", b);
      var tl0 = el("span", "line", top, p.deal[0]);
      tl0.style.fontSize = "40px";
      fitWidth(tl0, lim, 24);
    }
    var row = el("div", "deal-row", b);
    var big = el("span", "line", row, p.deal[1] || "");
    big.style.fontSize = "165px";
    fitWidth(big, lim, 60);
    if (p.deal[2]) {
      var sub = el("div", "deal-sub", b);
      var sl = el("span", "line", sub, p.deal[2]);
      sl.style.fontSize = "76px";
      fitWidth(sl, lim, 30);
    }
    b.style.left = (cx - b.offsetWidth / 2) + "px";
    b.style.top = y + "px";
    return { box: b, val: big };
  }
  function offerBlock(sc, p, cx, y, size, maxW) {
    var pr = p.deal ? dealBlock(sc, p, cx, y, maxW) : p.price ? priceBlock(sc, p, cx, y, size, maxW) : null;
    if (pr && p.mealPrice) {
      // second price box: replaces the item price with "MAKE IT A MEAL" later in the same scene
      sc.meal = priceBlock(sc, { priceLabel: p.mealLabel || "MAKE IT A MEAL", price: p.mealPrice }, cx, y, Math.min(size || 214, 200), maxW);
      gsap.set(sc.meal.box, { autoAlpha: 0 });
    }
    sc.pr = pr;
    return pr;
  }

  /* ---------- reusable moves ---------- */
  function hide(tl, nodes) { tl.set(nodes.filter(Boolean), { autoAlpha: 0 }, 0); }
  function box(pr) { return pr ? pr.box : null; }
  function logoIn(tl, sc, at) {
    tl.fromTo(sc.logo, { autoAlpha: 0, y: -220 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, at);
  }
  function lineFromSide(tl, line, dir, at) {
    tl.fromTo(line, { autoAlpha: 1, x: dir * 1300 }, { x: 0, duration: 0.9, ease: "expo.out" }, at);
    blur(tl, line, 55, 0.55, at);
  }
  function lineSlam(tl, sc, line, at) {
    tl.fromTo(line, { autoAlpha: 0, scale: 2.4 }, { autoAlpha: 1, scale: 1, duration: 0.38, ease: "power4.out" }, at);
    blur(tl, line, 18, 0.32, at, "xy");
    shake(tl, sc, at + 0.3, 0.6);
  }
  function lineRise(tl, line, at) {
    tl.fromTo(line, { autoAlpha: 0, y: 140, rotationX: -70 }, { autoAlpha: 1, y: 0, rotationX: 0, duration: 0.8, ease: "expo.out" }, at);
    blur(tl, line, 30, 0.45, at, "y");
  }
  function charsDrop(tl, line, at) {
    var chars = splitChars(line);
    tl.set(line, { autoAlpha: 1 }, at);
    tl.fromTo(chars, { autoAlpha: 0, y: -260 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "back.out(1.8)", stagger: 0.035 }, at);
  }
  function titleIn(tl, t, at) {
    tl.fromTo(t.chars, { autoAlpha: 0, yPercent: 110, rotationX: -85 },
      { autoAlpha: 1, yPercent: 0, rotationX: 0, duration: 0.55, ease: "power3.out", stagger: 0.025 }, at);
  }
  function detailsIn(tl, d, at) {
    tl.fromTo(d, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, at);
  }
  function priceIn(tl, pr, at, tilt) {
    if (!pr) return;
    tl.fromTo(pr.box, { autoAlpha: 0, scale: 0.3, rotationX: -70, rotation: 0, y: 70, transformPerspective: 900 },
      { autoAlpha: 1, scale: 1, rotationX: 0, rotation: tilt || 0, y: 0, duration: 0.95, ease: "back.out(2.4)" }, at);
    tl.fromTo(pr.val, { scale: 1.3 }, { scale: 1, duration: 0.55, ease: "back.out(3)" }, at + 0.35);
  }
  function shadowIn(tl, sc, at) {
    tl.fromTo(sc.shadow, { autoAlpha: 0, scaleX: 0.4 }, { autoAlpha: 1, scaleX: 1, duration: 0.7, ease: "power2.out" }, at);
  }
  function toneDown(tl, big, at) {
    tl.to(big.strong, { autoAlpha: 0, duration: 0.7, ease: "power1.inOut" }, at);
    tl.fromTo(big.tone, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7, ease: "power1.inOut" }, at);
  }
  function shake(tl, sc, at, k) {
    k = k || 1;
    tl.to(sc.root, { keyframes: { x: [14 * k, -11 * k, 7 * k, -3 * k, 0], y: [-6 * k, 5 * k, -3 * k, 1 * k, 0] }, duration: 0.28, ease: "none" }, at);
  }

  /* ---------- animation styles ---------- */
  var styles = {};

  // big word sweeps right-to-left, food slides in, headline lines arrive from opposite sides
  styles.sweep = function (sc, p) {
    var tl = gsap.timeline();
    var dir = p.from === "left" ? -1 : 1;
    var big = bigWord(sc, p.bigWord || "", p.bigSize || 470, p.bigY || L.bigCY, "black");
    var hl = headline(sc, p.headline, L.headlineY);
    var at = slots(p);
    var title = titleBlock(sc, p, at.titleY), det = p.details ? detailsBlock(sc, p, at.detailsY) : null;
    var pr = offerBlock(sc, p, 540, at.priceY);
    hide(tl, [sc.foodWrap, sc.logo, det, box(pr)].concat(hl, title.chars));
    tl.set(big.tone, { autoAlpha: 0 }, 0);

    var startX = dir > 0 ? W + 80 : -big.strong.offsetWidth - 120;
    tl.fromTo(big.wrap, { x: startX, rotationY: -38 * dir, transformPerspective: 1200 }, { x: big.x0, rotationY: 0, duration: 1.6, ease: "expo.out" }, 0.1);
    blur(tl, big.wrap, 80, 0.8, 0.1);
    logoIn(tl, sc, 1.1);
    tl.fromTo(sc.foodWrap, { autoAlpha: 0, x: 950 * dir, rotationY: -40 * dir, scale: 0.78, transformPerspective: 1400 },
      { autoAlpha: 1, x: 0, rotationY: 0, scale: 1, duration: 1.3, ease: "power3.out" }, 1.8);
    blur(tl, sc.foodWrap, 40, 0.6, 1.8);
    shadowIn(tl, sc, 2.5);
    toneDown(tl, big, 2.0);
    lineFromSide(tl, hl[0], -dir, 3.4);
    if (hl[1]) lineFromSide(tl, hl[1], dir, 3.8);
    titleIn(tl, title, 4.8);
    if (det) detailsIn(tl, det, 5.3);
    priceIn(tl, pr, 5.8);
    return { tl: tl, introEnd: 7.0 };
  };

  // words slam in one at a time; the last becomes the giant word behind the food
  styles.slam = function (sc, p) {
    var tl = gsap.timeline();
    var words = p.slamWords && p.slamWords.length ? p.slamWords : [p.bigWord || ""];
    var last = words[words.length - 1];
    var big = bigWord(sc, last, p.bigSize || 440, p.bigY || L.bigCY, "white");
    var hl = headline(sc, p.headline, L.headlineY);
    var at = slots(p);
    var title = titleBlock(sc, p, at.titleY), det = p.details ? detailsBlock(sc, p, at.detailsY) : null;
    var pr = offerBlock(sc, p, 540, at.priceY);
    hide(tl, [sc.foodWrap, sc.logo, det, box(pr), big.wrap].concat(hl, title.chars));
    tl.set(big.tone, { autoAlpha: 0 }, 0);

    var t = 0.15;
    words.slice(0, -1).forEach(function (w, i) {
      var n = el("div", "slam-word", sc.front);
      var inner = el("span", "line", n, w);
      inner.style.fontSize = "300px";
      var fs = fitWidth(inner, 960, 80);           // always fits on screen
      n.style.top = Math.round(L.bigCY - fs * 0.42) + "px";
      paint(inner, i % 2 ? "black" : "white", fs, sc.base, true);
      tl.set(n, { autoAlpha: 0 }, 0);
      tl.fromTo(n, { autoAlpha: 1, scale: 2.6 }, { scale: 1, duration: 0.32, ease: "power4.out" }, t);
      blur(tl, n, 24, 0.3, t, "xy");
      shake(tl, sc, t + 0.27);
      tl.to(n, { autoAlpha: 0, scale: 0.7, duration: 0.18, ease: "power2.in" }, t + 0.5);
      t += 0.62;
    });
    tl.fromTo(big.wrap, { autoAlpha: 1, x: big.x0, scale: 2.6, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.36, ease: "power4.out" }, t);
    blur(tl, big.wrap, 26, 0.34, t, "xy");
    shake(tl, sc, t + 0.3, 1.3);
    var z = t + 0.7;
    toneDown(tl, big, z);
    tl.fromTo(sc.foodWrap, { autoAlpha: 0, scale: 1.9 }, { autoAlpha: 1, scale: 1, duration: 1.0, ease: "expo.out" }, z + 0.15);
    blur(tl, sc.foodWrap, 22, 0.5, z + 0.15, "xy");
    shadowIn(tl, sc, z + 0.7);
    logoIn(tl, sc, z + 0.9);
    lineSlam(tl, sc, hl[0], z + 1.5);
    if (hl[1]) lineSlam(tl, sc, hl[1], z + 1.85);
    titleIn(tl, title, z + 2.6);
    if (det) detailsIn(tl, det, z + 3.1);
    priceIn(tl, pr, z + 3.5);
    return { tl: tl, introEnd: z + 4.7 };
  };

  // letters rise from below, food rises from the bottom edge
  styles.rise = function (sc, p) {
    var tl = gsap.timeline();
    var big = bigWord(sc, p.bigWord || "", p.bigSize || 520, p.bigY || (p.anchorBottom ? 1040 : L.bigCY), "black", true);
    var hl = headline(sc, p.headline, L.headlineY);
    var title, det, pr;
    if (p.anchorBottom) {
      title = titleBlock(sc, p, 590);
      det = p.details ? detailsBlock(sc, p, 680) : null;
      pr = offerBlock(sc, p, 815, 1320, 190, 450);
    } else {
      var at = slots(p);
      title = titleBlock(sc, p, at.titleY);
      det = p.details ? detailsBlock(sc, p, at.detailsY) : null;
      pr = offerBlock(sc, p, 540, at.priceY);
    }
    hide(tl, [sc.foodWrap, sc.logo, det, box(pr)].concat(hl, title.chars));
    tl.set(big.tone, { autoAlpha: 0 }, 0);
    tl.set(big.wrap, { x: big.x0 }, 0);

    tl.fromTo(big.chars, { autoAlpha: 0, y: 900 }, { autoAlpha: 1, y: 0, duration: 1.0, ease: "expo.out", stagger: 0.08 }, 0.1);
    blur(tl, big.wrap, 45, 0.8, 0.1, "y");
    tl.fromTo(sc.foodWrap, { autoAlpha: 1, y: H - sc.foodTop + 40, rotation: -5 }, { y: 0, rotation: 0, duration: 1.5, ease: "power3.out" }, 1.0);
    if (!p.anchorBottom) shadowIn(tl, sc, 2.1);
    blur(tl, sc.foodWrap, 35, 0.7, 1.0, "y");
    toneDown(tl, big, 1.7);
    logoIn(tl, sc, 1.6);
    lineRise(tl, hl[0], 2.7);
    if (hl[1]) lineRise(tl, hl[1], 2.95);
    titleIn(tl, title, 3.9);
    if (det) detailsIn(tl, det, 4.4);
    priceIn(tl, pr, 4.9, p.anchorBottom ? -3 : 0);
    return { tl: tl, introEnd: 6.2 };
  };

  // big word sweeps left-to-right, food rolls in spinning
  styles.spin = function (sc, p) {
    var tl = gsap.timeline();
    var big = bigWord(sc, p.bigWord || "", p.bigSize || 500, p.bigY || L.bigCY, "black");
    var hl = headline(sc, p.headline, L.headlineY);
    var at = slots(p);
    var title = titleBlock(sc, p, at.titleY), det = p.details ? detailsBlock(sc, p, at.detailsY) : null;
    var pr = offerBlock(sc, p, 540, at.priceY);
    hide(tl, [sc.foodWrap, sc.logo, det, box(pr)].concat(hl, title.chars));
    tl.set(big.tone, { autoAlpha: 0 }, 0);

    tl.fromTo(big.wrap, { x: -big.strong.offsetWidth - 120, rotationY: 38, transformPerspective: 1200 }, { x: big.x0, rotationY: 0, duration: 1.6, ease: "expo.out" }, 0.1);
    blur(tl, big.wrap, 80, 0.8, 0.1);
    logoIn(tl, sc, 1.0);
    tl.fromTo(sc.foodWrap, { autoAlpha: 1, x: 1150, scale: 0.8 }, { x: 0, scale: 1, duration: 1.6, ease: "power3.out" }, 1.0);
    tl.fromTo(sc.img, { rotation: 240 }, { rotation: 0, duration: 1.6, ease: "power3.out" }, 1.0);
    shadowIn(tl, sc, 1.9);
    toneDown(tl, big, 1.9);
    lineFromSide(tl, hl[0], 1, 3.0);
    if (hl[1]) lineFromSide(tl, hl[1], -1, 3.35);
    titleIn(tl, title, 4.3);
    if (det) detailsIn(tl, det, 4.8);
    priceIn(tl, pr, 5.3);
    return { tl: tl, introEnd: 6.5 };
  };

  // letters drop from the top, food drops and lands
  styles.drop = function (sc, p) {
    var tl = gsap.timeline();
    var big = bigWord(sc, p.bigWord || "", p.bigSize || 480, p.bigY || L.bigCY, "white", true);
    var hl = headline(sc, p.headline, L.headlineY);
    var at = slots(p);
    var title = titleBlock(sc, p, at.titleY), det = p.details ? detailsBlock(sc, p, at.detailsY) : null;
    var pr = offerBlock(sc, p, 540, at.priceY);
    hide(tl, [sc.foodWrap, sc.logo, det, box(pr)].concat(hl, title.chars));
    tl.set(big.tone, { autoAlpha: 0 }, 0);
    tl.set(big.wrap, { x: big.x0 }, 0);

    tl.fromTo(big.chars, { autoAlpha: 0, y: -1100 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "back.out(1.6)", stagger: 0.07 }, 0.1);
    blur(tl, big.wrap, 40, 0.7, 0.1, "y");
    tl.fromTo(sc.foodWrap, { autoAlpha: 1, y: -1600, rotation: 7 }, { y: 0, rotation: 0, duration: 1.15, ease: "back.out(1.3)" }, 1.0);
    blur(tl, sc.foodWrap, 30, 0.6, 1.0, "y");
    shadowIn(tl, sc, 1.75);
    toneDown(tl, big, 1.8);
    logoIn(tl, sc, 1.6);
    charsDrop(tl, hl[0], 2.6);
    if (hl[1]) charsDrop(tl, hl[1], 3.0);
    titleIn(tl, title, 4.0);
    if (det) detailsIn(tl, det, 4.5);
    priceIn(tl, pr, 5.0);
    return { tl: tl, introEnd: 6.2 };
  };

  /* ---------- slogan slides (words only, no food) ---------- */
  var COLOURS = { white: "#ffffff", black: "#111111", orange: "#EE6A2E", cream: "#F7F3EE", dark: "#0E0E0E" };
  function col(c) { return COLOURS[c] || c || "#ffffff"; }
  function lum(hex) { var c = rgb(hex); return c[0] * 0.299 + c[1] * 0.587 + c[2] * 0.114; }

  function buildSlogan(p) {
    var sc = { p: p, slogan: true };
    sc.root = el("section", "scene slogan", stage);
    sc.root.style.background = col((p.beats[0] || {}).bg || "dark");
    sc.bgs = el("div", "layer", sc.root);
    sc.beatsBox = el("div", "layer", sc.root);
    return sc;
  }

  function styleLine(span, L, bg, fs) {
    var c = col(L.colour || (lum(bg) > 150 ? "black" : "white"));
    var lb = lum(bg);
    if (L.style === "outline") {
      span.style.color = bg;                       // fill hides the inner glyph lines
      span.style.webkitTextStroke = Math.max(6, Math.round(fs * 0.045)) + "px " + c;
      span.style.paintOrder = "stroke fill";
    } else if (L.style === "box") {
      var bc = col(L.box || "orange");
      span.style.background = bc;
      span.style.color = c;
      span.style.padding = "0.07em 0.24em 0.02em";
      span.style.borderRadius = "0.07em";
      span.style.boxShadow = "0 0.06em 0 " + mix(bc, "#000000", 0.45);
    } else {
      span.style.color = c;
      if (lb > 60 && lb < 200) span.style.textShadow = extrude(mix(bg, "#000000", 0.38), Math.max(3, Math.round(fs * 0.03)), false);
    }
  }

  function sloganLineIn(tl, sc, L, span, la) {
    var fx = L.in || "slam", chars, n;
    if (fx === "fromLeft" || fx === "fromRight") {
      var dir = fx === "fromLeft" ? -1 : 1;
      tl.fromTo(span, { autoAlpha: 1, x: dir * 1300 }, { x: 0, duration: 0.75, ease: "expo.out" }, la);
      blur(tl, span, 60, 0.5, la);
      return la + 0.6;
    }
    if (fx === "slam") {
      tl.fromTo(span, { autoAlpha: 0, scale: 2.6 }, { autoAlpha: 1, scale: 1, duration: 0.36, ease: "power4.out" }, la);
      blur(tl, span, 20, 0.3, la, "xy");
      shake(tl, sc, la + 0.3, L.shake || 1);
      return la + 0.4;
    }
    if (fx === "stretch") {
      tl.fromTo(span, { autoAlpha: 0, scaleX: 3.2, scaleY: 0.7 }, { autoAlpha: 1, scaleX: 1, scaleY: 1, duration: 0.7, ease: "expo.out" }, la);
      blur(tl, span, 70, 0.55, la);
      return la + 0.6;
    }
    if (fx === "zoom") {
      tl.fromTo(span, { autoAlpha: 0, scale: 0.12 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: "expo.out" }, la);
      blur(tl, span, 16, 0.4, la, "xy");
      return la + 0.6;
    }
    if (fx === "flip") {
      tl.fromTo(span, { autoAlpha: 0, rotationX: -95, transformPerspective: 900, transformOrigin: "50% 100%" },
        { autoAlpha: 1, rotationX: 0, duration: 0.7, ease: "back.out(1.6)" }, la);
      return la + 0.6;
    }
    if (fx === "wipe") {
      tl.fromTo(span, { autoAlpha: 1, clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power3.inOut" }, la);
      return la + 0.6;
    }
    if (fx === "spin") {
      tl.fromTo(span, { autoAlpha: 0, scale: 0, rotation: -200 }, { autoAlpha: 1, scale: 1, rotation: L.tilt || 0, duration: 0.9, ease: "back.out(1.7)" }, la);
      return la + 0.8;
    }
    // letter by letter
    chars = splitChars(span); n = chars.length;
    tl.set(span, { autoAlpha: 1 }, la);
    if (fx === "rise") {
      tl.fromTo(chars, { autoAlpha: 0, yPercent: 110, rotationX: -80 }, { autoAlpha: 1, yPercent: 0, rotationX: 0, duration: 0.6, ease: "power3.out", stagger: 0.04 }, la);
      return la + 0.5 + 0.04 * n;
    }
    if (fx === "drop") {
      tl.fromTo(chars, { autoAlpha: 0, y: -420 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "back.out(1.8)", stagger: 0.06 }, la);
      blur(tl, span, 30, 0.5, la, "y");
      return la + 0.55 + 0.06 * n;
    }
    tl.fromTo(chars, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, stagger: 0.055 }, la);   // "type"
    return la + 0.055 * n;
  }

  function sloganExit(tl, beat, kind, at) {
    if (kind === "none") return 0;
    var d = 0.38;
    if (kind === "whipL" || kind === "whipR") {
      tl.to(beat, { x: kind === "whipL" ? -1400 : 1400, duration: d, ease: "power3.in" }, at);
      blurOut(tl, beat, 60, d, at);
    } else if (kind === "up" || kind === "down") {
      tl.to(beat, { y: kind === "up" ? -1500 : 1500, duration: d, ease: "power3.in" }, at);
      blurOut(tl, beat, 40, d, at, "y");
    } else if (kind === "zoom") {
      d = 0.42;
      tl.to(beat, { scale: 5, autoAlpha: 0, duration: d, ease: "power2.in" }, at);
    } else {
      d = 0.3;
      tl.to(beat, { autoAlpha: 0, duration: d }, at);
    }
    tl.set(beat, { autoAlpha: 0 }, at + d + 0.02);
    return d;
  }

  function sloganTimeline(sc, p) {
    var tl = gsap.timeline();
    var T = 0.45;                                   // starts as the screen is uncovered
    var cur = col((p.beats[0] || {}).bg || "dark");
    var side = 1;
    p.beats.forEach(function (b) {
      var bg = col(b.bg || cur), start = T;
      if (bg !== cur) {                             // new background colour sweeps across
        var panel = el("div", "bg-panel", sc.bgs);
        panel.style.background = bg;
        side = -side;
        gsap.set(panel, { skewX: -14 });
        tl.fromTo(panel, { x: side > 0 ? 1400 : -2050 }, { x: -310, duration: 0.55, ease: "power3.inOut" }, T - 0.25);
        start = T + 0.25;
        cur = bg;
      }
      var beat = el("div", "beat", sc.beatsBox);
      tl.set(beat, { autoAlpha: 0 }, 0);
      tl.set(beat, { autoAlpha: 1 }, start);

      if (b.ghost) {                                // giant faint word drifting behind
        var g = el("div", "ghost", beat, b.ghost);
        g.style.color = lum(bg) > 150 ? "rgba(0,0,0,0.06)" : lum(bg) < 60 ? "rgba(255,255,255,0.06)" : mix(bg, "#000000", 0.12);
        g.style.top = ((b.y || 960) - 250) + "px";
        tl.fromTo(g, { x: 500 }, { x: -g.offsetWidth + 200, duration: 6, ease: "none" }, start);
      }

      // stack: optional centred logo, then the lines
      var stack = [], logoEl = null;
      if (b.logo === "center" || b.logo === "top") {
        logoEl = el("div", "logo" + (b.logo === "center" ? " logo-center" : ""), beat);
        var li = el("img", null, logoEl); li.src = S.logo; li.alt = "The Nile";
        if (b.logo === "center") stack.push({ node: logoEl, h: logoEl.offsetHeight });
      }
      var lines = (b.lines || []).map(function (L) {
        var row = el("div", "sl-line", beat);
        var span = el("span", "sl-text", row, L.t);
        span.style.fontSize = (L.size || 160) + "px";
        var fs = fitWidth(span, L.maxW || 980, 30);
        styleLine(span, L, bg, fs);
        fitWidth(span, L.maxW || 980, 30);
        if (L.dx) { row.style.left = L.dx + "px"; row.style.right = (-L.dx) + "px"; }
        stack.push({ node: row, h: span.offsetHeight });
        return { L: L, row: row, span: span };
      });
      var gap = b.gap != null ? b.gap : 26;
      var total = stack.reduce(function (a, it) { return a + it.h; }, 0) + gap * Math.max(0, stack.length - 1);
      var y = (b.y || 960) - total / 2;
      stack.forEach(function (it) { it.node.style.top = Math.round(y) + "px"; y += it.h + gap; });

      lines.forEach(function (o) { tl.set(o.span, { autoAlpha: 0 }, 0); });
      var end = start + 0.2;
      if (logoEl) {
        tl.fromTo(logoEl, { autoAlpha: 0, scale: 0.6, y: -40 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(1.7)" }, start);
        end = start + 0.6;
      }
      lines.forEach(function (o, i) {
        var la = start + (o.L.at != null ? o.L.at : (logoEl ? 0.35 : 0) + i * 0.3);
        end = Math.max(end, sloganLineIn(tl, sc, o.L, o.span, la));
      });
      var holdEnd = end + (b.hold != null ? b.hold : 1.0);
      tl.fromTo(beat, { scale: 1 }, { scale: 1.04, duration: holdEnd - start, ease: "none" }, start);   // slow push-in
      var d = sloganExit(tl, beat, b.out || "whipL", holdEnd);
      T = holdEnd + d * 0.6;
    });
    return { tl: tl, introEnd: T + 0.15 };
  }

  /* ---------- gentle movement while the final layout is held ---------- */
  function hold(tl, sc, p, at, dur) {
    if (dur <= 0) return;
    tl.to(sc.foodWrap, { y: p.anchorBottom ? -10 : -16, scale: 1.025, duration: dur, ease: "sine.inOut" }, at);
    if (p.animation === "spin") tl.to(sc.img, { rotation: 12, duration: dur, ease: "none" }, at);
    if (sc.big) tl.to(sc.big.wrap, { x: sc.big.x0 - 30, duration: dur, ease: "none" }, at);
    tl.fromTo(sc.glow, { scale: 1, opacity: 0.8 }, { scale: 1.1, opacity: 1, duration: dur, ease: "sine.inOut" }, at);
  }

  /* ---------- sweep between promotions ---------- */
  var wipe, bandA, bandB;
  var COVER = -310, RIGHT = 1400, LEFT = -2050;
  function buildWipe() {
    wipe = el("div", "wipe", stage);
    bandA = el("div", "wipe-band", wipe);
    bandB = el("div", "wipe-band", wipe);
    bandA.style.background = "#C9471C";
    bandB.style.background = S.wipeColour;
    gsap.set([bandA, bandB], { skewX: -14, x: COVER });
  }
  function wipeIn(tl, at) {   // covers the screen, finishing exactly at "at"
    tl.fromTo(bandA, { x: RIGHT }, { x: COVER, duration: 0.45, ease: "power3.in" }, at - 0.55);
    tl.fromTo(bandB, { x: RIGHT }, { x: COVER, duration: 0.5, ease: "power3.in" }, at - 0.5);
  }
  function wipeOut(tl, at) {  // uncovers the screen, starting at "at"
    tl.fromTo(bandB, { x: COVER }, { x: LEFT, duration: 0.55, ease: "power3.out", immediateRender: false }, at + 0.02);
    tl.fromTo(bandA, { x: COVER }, { x: LEFT, duration: 0.6, ease: "power3.out", immediateRender: false }, at + 0.12);
  }

  /* ---------- stage scaling ---------- */
  function scale() {
    var turned = rotate === 90 || rotate === 270;
    var sw = turned ? H : W, sh = turned ? W : H;
    var k = Math.min(window.innerWidth / sw, window.innerHeight / sh);
    stage.style.transform = "translate(-50%, -50%) rotate(" + (rotate || 0) + "deg) scale(" + k + ")";
  }
  scale();
  window.addEventListener("resize", scale);

  /* ---------- load everything first, then play (no loading flashes) ---------- */
  function loadImage(src) {
    return new Promise(function (resolve) {
      var im = new Image();
      im.onload = function () {
        (im.decode ? im.decode().catch(function () {}) : Promise.resolve()).then(function () { images[src] = im; resolve(); });
      };
      im.onerror = function () { console.warn("Promo image not found:", src); resolve(); };
      im.src = src;
    });
  }

  var promos = [];
  (CFG.promos || []).forEach(function (p) {
    if (p.enabled === false || (onlyId && p.id !== onlyId)) return;
    promos.push(p);
  });
  var fonts = ["900 100px Montserrat", "800 100px Montserrat", "600 40px 'Barlow Semi Condensed'"].map(function (f) {
    return document.fonts ? document.fonts.load(f) : Promise.resolve();
  });
  var loads = promos.filter(function (p) { return p.image; }).map(function (p) { return loadImage(p.image); }).concat([loadImage(S.logo)], fonts);

  Promise.all(loads).then(function () { return document.fonts ? document.fonts.ready : null; }).then(start);

  function start() {
    if (!promos.length) { console.warn("No enabled promotions in promos.js"); return; }
    var scenes = promos.map(function (p) { return p.type === "slogan" ? buildSlogan(p) : buildScene(p); });
    var roots = scenes.map(function (s) { return s.root; });
    buildWipe();

    var loadedAt = Date.now();
    var master = gsap.timeline({ repeat: -1, paused: true, onRepeat: function () {
      // every few hours, reload to pick up edits – only when the files can be reached
      if ((Date.now() - loadedAt) / 3600000 < S.refreshHours) return;
      if (location.protocol === "file:") { location.reload(); return; }
      fetch("promos.js?check=" + Date.now(), { cache: "no-store" })
        .then(function (r) { if (r.ok) location.reload(); })
        .catch(function () {});
    } });

    var t = 0, starts = [];
    scenes.forEach(function (sc) {
      var p = sc.p;
      starts.push({ id: p.id, at: t });
      var built, dur;
      if (sc.slogan) {
        built = sloganTimeline(sc, p);
        dur = Math.max(p.duration || 0, built.introEnd);
      } else {
        built = (styles[p.animation] || styles.sweep)(sc, p);
        dur = Math.max(p.duration || 12, built.introEnd + 3 + (sc.meal ? 3.4 : 0));
      }
      master.set(roots, { autoAlpha: 0 }, t);
      master.set(sc.root, { autoAlpha: 1 }, t);
      wipeOut(master, t);
      master.add(built.tl, t);
      if (!sc.slogan) hold(master, sc, p, t + built.introEnd, dur - built.introEnd - 0.5);
      if (sc.meal) {                     // item price flips away, "MAKE IT A MEAL" price pops up
        var m = t + built.introEnd + 1.9;
        master.set(sc.meal.box, { autoAlpha: 0 }, t);
        master.to(sc.pr.box, { rotationX: 90, y: -40, autoAlpha: 0, duration: 0.32, ease: "power2.in", transformPerspective: 900 }, m);
        master.fromTo(sc.meal.box, { autoAlpha: 0, scale: 0.3, rotationX: -70, y: 70, transformPerspective: 900 },
          { autoAlpha: 1, scale: 1, rotationX: 0, y: 0, duration: 0.95, ease: "back.out(2.4)", immediateRender: false }, m + 0.22);
        master.fromTo(sc.meal.val, { scale: 1.3 }, { scale: 1, duration: 0.55, ease: "back.out(3)", immediateRender: false }, m + 0.57);
        shake(master, sc, m + 0.5, 0.5);
      }
      wipeIn(master, t + dur);
      t += dur;
    });

    window.NILE_PROMO = { master: master, duration: t, starts: starts };
    if (freezeAt != null) master.pause(freezeAt);
    else if (!params.has("capture")) master.play(0);
    else master.pause(0);
    document.body.setAttribute("data-ready", "1");
  }
})();
