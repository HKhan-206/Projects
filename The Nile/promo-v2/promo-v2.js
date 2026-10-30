/* The Nile – promo screen engine (new style). All content lives in items.js.
   Preview options:  ?item=peri-burger   ?t=3 (freeze at 3 s)   ?rotate=90   ?blur=0 */
(function () {
  "use strict";
  var CFG = window.PROMO2;
  var params = new URLSearchParams(location.search);
  var only = params.get("item");
  var freezeAt = params.has("t") ? parseFloat(params.get("t")) : null;
  var rotate = parseInt(params.get("rotate") || "0", 10);
  var motionBlur = params.get("blur") !== "0";
  var W = 1080, H = 1920, K = 0.95;          // photos are shown at 95% of their pixel size
  var NS = "http://www.w3.org/2000/svg";
  var ORANGE = CFG.orange || "#FD7E14";
  var stage = document.getElementById("stage");

  /* ---------- helpers ---------- */
  function el(tag, cls, parent, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  function sv(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function svgLayer(parent) { return sv("svg", { "class": "gfx", viewBox: "0 0 1080 1920", width: 1080, height: 1920 }, parent); }
  function seeded(seed) {             // repeatable "random" so every loop looks identical
    return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
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
  function extrude(colour, depth) {
    var s = [];
    for (var i = 1; i <= depth; i++) s.push((i * 0.6).toFixed(1) + "px " + i + "px 0 " + colour);
    return s.join(",");
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

  function scale() {
    var turned = rotate === 90 || rotate === 270;
    var k = Math.min(window.innerWidth / (turned ? H : W), window.innerHeight / (turned ? W : H));
    stage.style.transform = "translate(-50%, -50%) rotate(" + (rotate || 0) + "deg) scale(" + k + ")";
  }
  scale();
  window.addEventListener("resize", scale);

  /* ---------- shared SVG filters ---------- */
  var defsSvg = sv("svg", { width: 0, height: 0, style: "position:absolute" }, document.body);
  var defs = sv("defs", {}, defsSvg);
  defs.innerHTML =
    // dry-brush streaks + slightly rough edges for the big lettering
    '<filter id="brushTex" x="-6%" y="-12%" width="112%" height="124%" color-interpolation-filters="sRGB">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.025 0.5" numOctaves="2" seed="4" result="n"/>' +
      '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3.2 0 0 0 1.85" result="m"/>' +
      '<feFlood flood-color="#7a4a1c" flood-opacity="0.28"/>' +
      '<feComposite in2="m" operator="in" result="streak"/>' +
      '<feComposite in="streak" in2="SourceGraphic" operator="atop" result="tex"/>' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="9" result="d"/>' +
      '<feDisplacementMap in="tex" in2="d" scale="5" xChannelSelector="R" yChannelSelector="G"/>' +
    '</filter>' +
    '<filter id="rough" x="-10%" y="-10%" width="120%" height="120%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="2" result="d"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="d" scale="14" xChannelSelector="R" yChannelSelector="G"/>' +
    '</filter>' +
    '<filter id="roughSoft" x="-10%" y="-10%" width="120%" height="120%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="5" result="d"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="d" scale="6" xChannelSelector="R" yChannelSelector="G"/>' +
    '</filter>' +
    // dry brush stroke for the big background smears (streaky, ragged ends)
    '<filter id="dryBrush" x="-10%" y="-20%" width="120%" height="140%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.004 0.035" numOctaves="2" seed="11" result="n"/>' +
      '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.55" result="m"/>' +
      '<feComposite in="SourceGraphic" in2="m" operator="in" result="s"/>' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="3" result="d"/>' +
      '<feDisplacementMap in="s" in2="d" scale="18" xChannelSelector="R" yChannelSelector="G"/>' +
    '</filter>' +
    '<linearGradient id="flameG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff4d00"/><stop offset="0.55" stop-color="#ffab00"/><stop offset="1" stop-color="#ffe066"/></linearGradient>';

  var fx = 0;
  function blur(tl, target, amount, dur, at, dir) {        // motion blur that fades out as the move slows
    if (!motionBlur) return;
    var id = "mb" + (fx++);
    var f = sv("filter", { id: id, x: "-30%", y: "-30%", width: "160%", height: "160%" }, defs);
    var g = sv("feGaussianBlur", { stdDeviation: "0 0" }, f);
    var from = dir === "y" ? "0 " + amount : dir === "xy" ? amount * 0.7 + " " + amount * 0.7 : amount + " 0";
    tl.set(target, { filter: "url(#" + id + ")" }, at);
    tl.fromTo(g, { attr: { stdDeviation: from } }, { attr: { stdDeviation: "0 0" }, duration: dur, ease: "power2.out", immediateRender: false }, at);
    tl.set(target, { filter: "none" }, at + dur);
  }
  function blurOut(tl, target, amount, dur, at, dir) {
    if (!motionBlur) return;
    var id = "mb" + (fx++);
    var f = sv("filter", { id: id, x: "-30%", y: "-30%", width: "160%", height: "160%" }, defs);
    var g = sv("feGaussianBlur", { stdDeviation: "0 0" }, f);
    var to = dir === "y" ? "0 " + amount : dir === "xy" ? amount + " " + amount : amount + " 0";
    tl.set(target, { filter: "url(#" + id + ")" }, at);
    tl.fromTo(g, { attr: { stdDeviation: "0 0" } }, { attr: { stdDeviation: to }, duration: dur, ease: "power2.in", immediateRender: false }, at);
    tl.set(target, { filter: "none" }, at + dur + 0.05);
  }
  function shake(tl, sc, at, k) {
    k = k || 1;
    tl.to(sc.root, { keyframes: { x: [14 * k, -11 * k, 7 * k, -3 * k, 0], y: [-6 * k, 5 * k, -3 * k, 1 * k, 0] }, duration: 0.28, ease: "none" }, at);
  }
  function drawIn(tl, path, at, dur) {                  // a stroke draws itself on
    var len = path.getTotalLength();
    path.style.strokeDasharray = len + " " + len;
    tl.fromTo(path, { strokeDashoffset: len, autoAlpha: 1 }, { strokeDashoffset: 0, duration: dur, ease: "power2.out" }, at);
  }

  /* ---------- brush shapes ---------- */
  function brushRect(x, y, w, h, R) {                    // rough painted panel with dry-brush ends
    var pts = [], i;
    for (i = 0; i <= w; i += 20) pts.push([x + i, y + (R() - 0.5) * 12]);
    for (i = 0; i <= h; i += 12) pts.push([x + w + R() * 38 - (i % 24 ? 0 : 24), y + i]);
    for (i = w; i >= 0; i -= 20) pts.push([x + i, y + h + (R() - 0.5) * 12]);
    for (i = h; i >= 0; i -= 12) pts.push([x - R() * 38 + (i % 24 ? 0 : 24), y + i]);
    return "M" + pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join("L") + "Z";
  }

  /* =====================================================================
     FOOD SLIDE – laid out like the supplied poster, but portrait
     ===================================================================== */
  function buildFood(it, idx) {
    var R = seeded(1000 + idx * 77);
    var sc = { it: it, food: true };
    sc.root = el("section", "scene", stage);
    var lw = it.layerW * K, lh = it.layerH * K;

    // background matched to the photo, then the complete photograph
    sc.bg = el("div", "bg", sc.root);
    sc.bg.style.height = lh + "px";
    sc.bg.style.background = "linear-gradient(180deg," + it.bgStops.map(function (s) { return s[1] + " " + s[0] + "%"; }).join(",") + ")";
    sc.photo = el("div", "photo", sc.root);
    Object.assign(sc.photo.style, { width: lw + "px", height: lh + "px", left: ((W - lw) / 2) + "px" });
    var img = el("img", null, sc.photo); img.src = "images/items/" + it.id + ".jpg"; img.alt = "";

    // big darker-orange dry-brush smears in the background (kept clear of the food)
    var back = svgLayer(sc.root);
    var gS = sv("g", { filter: "url(#dryBrush)", fill: "none", stroke: "#e24f00", "stroke-linecap": "round" }, back);
    sc.smears = [   // only in the open orange areas – never across the food
      sv("path", { d: "M-80,150 C120,90 300,60 560,40", "stroke-width": 200, opacity: 0.6 }, gS),
      sv("path", { d: "M-100,700 C60,650 140,630 240,610", "stroke-width": 150, opacity: 0.55 }, gS),
      sv("path", { d: "M880,760 C960,730 1040,700 1160,670", "stroke-width": 130, opacity: 0.5 }, gS),
      sv("path", { d: "M-80,1700 C40,1660 120,1650 220,1640", "stroke-width": 150, opacity: 0.55 }, gS),
      sv("path", { d: "M720,1930 C860,1870 990,1810 1160,1750", "stroke-width": 200, opacity: 0.6 }, gS)
    ];
    // red-pink brush strokes peeking out behind the title, top right
    var gR = sv("g", { filter: "url(#rough)", fill: "none", stroke: "#ff3b5c", "stroke-width": 34, "stroke-linecap": "round" }, back);
    sc.reds = [
      sv("path", { d: "M955,300 L1070,250" }, gR),
      sv("path", { d: "M940,355 L1075,300" }, gR),
      sv("path", { d: "M950,410 L1060,362" }, gR)
    ];

    // title on its dark brush panel
    var tw = el("div", "title-wrap", sc.root);
    var panelSvg = sv("svg", { style: "position:absolute;left:0;top:0;overflow:visible" }, tw);
    sc.title = el("div", "title", tw);
    sc.chars = [];
    sc.lines = it.title.map(function (L) {
      var line = el("div", "line " + (L[1] || "w"), sc.title);
      var chars = Array.from(L[0]).map(function (c) { return el("span", "ch", line, c === " " ? " " : c); });
      sc.chars = sc.chars.concat(chars);
      return { el: line, chars: chars };
    });
    var fs = it.title.length > 3 ? 190 : it.title.length > 2 ? 230 : 280;
    if (it.titleSize) fs = it.titleSize;
    sc.title.style.fontSize = fs + "px";
    sc.lines.forEach(function (l) { l.el.style.display = "inline-block"; l.el.style.float = "left"; l.el.style.clear = "left"; });
    function widest() { return Math.max.apply(null, sc.lines.map(function (l) { return l.el.offsetWidth; })); }
    var maxH = it.title.length > 3 ? 640 : 560;
    while ((widest() > 830 || sc.title.offsetHeight > maxH) && fs > 90) { fs -= 6; sc.title.style.fontSize = fs + "px"; }
    var tW = widest();
    sc.lines.forEach(function (l) { l.el.style.display = "block"; l.el.style.float = "none"; });
    var tH = sc.title.offsetHeight;
    var top = Math.max(150, Math.round(470 - tH / 2));
    tw.style.top = top + "px";
    var px = 40, py = 24;
    panelSvg.setAttribute("width", tW + px * 2 + 90);
    panelSvg.setAttribute("height", tH + py * 2 + 110);
    panelSvg.style.left = (-px) + "px"; panelSvg.style.top = (-py) + "px";
    var gP = sv("g", { filter: "url(#rough)" }, panelSvg);
    sc.panel = sv("path", { d: brushRect(14, 10, tW + px * 2 - 20, tH + py * 2 + 46, R), fill: "#2a1206" }, gP);
    sc.underline = sv("path", { d: "M" + (px + 40) + "," + (tH + py + 46) + " C" + (px + tW * 0.35) + "," + (tH + py + 34) + " " + (px + tW * 0.62) + "," + (tH + py + 30) + " " + (px + tW * 0.78) + "," + (tH + py + 22),
      fill: "none", stroke: "#fffaf3", "stroke-width": 20, "stroke-linecap": "round", filter: "url(#roughSoft)" }, panelSvg);
    sc.titleWrap = tw;

    // front graphics: action marks, arrow, logo badge, motion lines, zigzag
    var front = svgLayer(sc.root);
    var gA = sv("g", { fill: "none", stroke: "#ffffff", "stroke-width": 10, "stroke-linecap": "round", "stroke-linejoin": "round" }, front);
    var tTop = top - 30;
    function capsule(cx, cy, len, ang) {   // hand-drawn outlined "dash" like the poster
      var r = 15, a = ang * Math.PI / 180, dx = Math.cos(a) * len / 2, dy = Math.sin(a) * len / 2, nx = -Math.sin(a) * r, ny = Math.cos(a) * r;
      return "M" + (cx - dx + nx) + "," + (cy - dy + ny) + " L" + (cx + dx + nx) + "," + (cy + dy + ny) +
        " A" + r + "," + r + " 0 0 0 " + (cx + dx - nx) + "," + (cy + dy - ny) + " L" + (cx - dx - nx) + "," + (cy - dy - ny) +
        " A" + r + "," + r + " 0 0 0 " + (cx - dx + nx) + "," + (cy - dy + ny) + "Z";
    }
    sc.marks = [
      sv("path", { d: capsule(60, top - 30, 100, 200) }, gA),
      sv("path", { d: capsule(130, top - 95, 95, 240) }, gA),
      sv("path", { d: capsule(215, top - 125, 80, 265) }, gA)
    ];
    var gM = sv("g", { fill: "none", stroke: "#ffffff", "stroke-width": 14, "stroke-linecap": "round" }, front);
    sc.marks2 = [
      sv("path", { d: "M985,480 L1000,560" }, gM),
      sv("path", { d: "M1030,520 L1065,580" }, gM),
      sv("path", { d: "M1000,620 L1060,630" }, gM)
    ];
    // curved arrow from the title down to the food
    var ax = 230, ay = top + tH + 70;
    sc.arrow = sv("path", { d: "M" + ax + "," + ay + " C" + (ax - 20) + "," + (ay + 60) + " " + (ax + 10) + "," + (ay + 110) + " " + (ax + 80) + "," + (ay + 140),
      fill: "none", stroke: "#ffffff", "stroke-width": 9, "stroke-linecap": "round" }, front);
    sc.arrowHead = sv("path", { d: "M" + (ax + 44) + "," + (ay + 142) + " L" + (ax + 82) + "," + (ay + 141) + " L" + (ax + 70) + "," + (ay + 106),
      fill: "none", stroke: "#ffffff", "stroke-width": 9, "stroke-linecap": "round", "stroke-linejoin": "round" }, front);
    // logo badge: black brush circle, original-colour triangle inside
    var bx = 935, by = Math.max(top + tH + 60, 700);
    sc.badge = sv("g", {}, front);
    var gB = sv("g", { filter: "url(#roughSoft)" }, sc.badge);
    sv("circle", { cx: bx, cy: by, r: 112, fill: "#1c0d05" }, gB);
    sv("circle", { cx: bx, cy: by, r: 100, fill: "none", stroke: "#3a1d0c", "stroke-width": 4 }, sc.badge);
    var tri = sv("image", { href: CFG.badge, x: bx - 66, y: by - 62, width: 132, height: 111 }, sc.badge);
    tri.setAttributeNS("http://www.w3.org/1999/xlink", "href", CFG.badge);
    sc.badgeXY = bx + " " + by;
    // motion lines on the right of the food
    sc.motion = [
      sv("path", { d: "M1005,1080 q26,34 2,74", fill: "none", stroke: "#ffffff", "stroke-width": 10, "stroke-linecap": "round" }, front),
      sv("path", { d: "M1040,1062 q34,50 2,108", fill: "none", stroke: "#ffffff", "stroke-width": 10, "stroke-linecap": "round" }, front),
      sv("path", { d: "M985,1185 q30,-6 58,-34", fill: "none", stroke: "#ffffff", "stroke-width": 10, "stroke-linecap": "round" }, front)
    ];
    // zigzag scribble, bottom right (red underneath, white on top)
    var zz = "M770,1880 L900,1770 L870,1875 L1000,1760 L975,1868 L1110,1755";
    sc.zigRed = sv("path", { d: zz, fill: "none", stroke: "#ff3b5c", "stroke-width": 46, "stroke-linecap": "round", "stroke-linejoin": "round", filter: "url(#rough)", transform: "translate(18,14)" }, front);
    sc.zig = sv("path", { d: zz, fill: "none", stroke: "#ffffff", "stroke-width": 30, "stroke-linecap": "round", "stroke-linejoin": "round", filter: "url(#roughSoft)" }, front);

    // tagline on its own brush panel, with flame
    sc.tag = el("div", "tag", sc.root);
    var tagSvg = sv("svg", { style: "position:absolute;left:-30px;top:-12px;overflow:visible", width: 760, height: 170 }, sc.tag);
    var gT = sv("g", { filter: "url(#rough)" }, tagSvg);
    sc.tagPanel = sv("path", { d: "", fill: "#2a1206" }, gT);
    var flame = sv("svg", { "class": "flame", viewBox: "0 0 60 72" }, sc.tag);
    sv("path", { d: "M30,2 C36,20 54,28 52,48 C50,64 40,70 30,70 C18,70 8,62 8,48 C8,36 16,30 20,22 C22,32 26,34 28,34 C26,22 26,12 30,2 Z", fill: "url(#flameG)" }, flame);
    sv("path", { d: "M30,40 C34,48 40,52 38,60 C36,66 33,68 30,68 C26,68 22,65 22,59 C22,53 27,50 30,40 Z", fill: "#fff3b0" }, flame);
    var txt = el("div", "txt", sc.tag);
    sc.tag1 = el("div", "t t1", txt, it.tagline[0]);
    sc.tag2 = el("div", "t t2", txt, it.tagline[1]);
    [sc.tag1, sc.tag2].forEach(function (t) { t.style.fontSize = "52px"; fitWidth(t, 680, 40); });
    var tagW = Math.max(sc.tag1.offsetWidth, sc.tag2.offsetWidth) + 112 + 70;
    tagSvg.setAttribute("width", tagW + 90);
    sc.tagPanel.setAttribute("d", brushRect(8, 4, tagW, 150, R));
    sc.flame = flame;
    return sc;
  }

  function foodTimeline(sc, T) {
    var tl = gsap.timeline();
    var p = sc.photo, z = sc.it.zoom || 1;
    // the complete photograph slides in from the right: fast start, long ease-out, slight overshoot, settle
    tl.set(p, { x: W + 260, scale: 1.14 * z }, 0);
    tl.to(p, { x: -34, duration: 0.95, ease: "expo.out" }, 0.15);
    tl.to(p, { scale: 0.985 * z, duration: 1.05, ease: "power3.out" }, 0.15);
    tl.to(p, { x: 0, duration: 0.7, ease: "sine.inOut" }, 1.1);
    tl.to(p, { scale: z, duration: 0.8, ease: "sine.inOut" }, 1.2);

    // background brush smears paint across
    sc.smears.forEach(function (s, i) { drawIn(tl, s, 0.2 + i * 0.12, 0.55); });
    tl.set(sc.reds, { autoAlpha: 0 }, 0);
    sc.reds.forEach(function (s, i) { drawIn(tl, s, 1.0 + i * 0.07, 0.25); });

    // title: panel wipes in, letters slam on one by one, shake, underline draws
    var at = 1.0;
    tl.set(sc.chars, { autoAlpha: 0 }, 0);
    tl.fromTo(sc.panel, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% -5% 0% 0%)", duration: 0.4, ease: "power3.out" }, at);
    var t = at + 0.2;
    sc.lines.forEach(function (l, li) {
      l.chars.forEach(function (c, i) {
        var r = (((li * 7 + i) * 37) % 24) - 12;
        tl.fromTo(c, { autoAlpha: 0, scale: 2.3, rotation: r, y: -30 }, { autoAlpha: 1, scale: 1, rotation: 0, y: 0, duration: 0.32, ease: "power4.out" }, t + i * 0.045);
      });
      t += l.chars.length * 0.045 + 0.12;
    });
    tl.to(sc.titleWrap, { keyframes: { x: [10, -8, 6, -3, 0] }, duration: 0.35, ease: "none" }, t);
    tl.set(sc.underline, { autoAlpha: 0 }, 0);
    drawIn(tl, sc.underline, t - 0.1, 0.35);

    // the rest of the graphics
    var e = t + 0.1;
    tl.set(sc.marks.concat(sc.marks2, sc.motion, [sc.arrow, sc.arrowHead, sc.zig, sc.zigRed]), { autoAlpha: 0 }, 0);
    sc.marks.forEach(function (m, i) { drawIn(tl, m, e + i * 0.06, 0.3); });
    sc.marks2.forEach(function (m, i) { drawIn(tl, m, e + 0.15 + i * 0.06, 0.2); });
    drawIn(tl, sc.arrow, e + 0.3, 0.4);
    drawIn(tl, sc.arrowHead, e + 0.65, 0.15);
    tl.fromTo(sc.badge, { autoAlpha: 0, scale: 0, rotation: -25, svgOrigin: sc.badgeXY }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2.6)" }, e + 0.35);
    sc.motion.forEach(function (m, i) { drawIn(tl, m, e + 0.5 + i * 0.08, 0.25); });
    tl.set(sc.tag, { autoAlpha: 0 }, 0);
    tl.set(sc.tag, { autoAlpha: 1 }, e + 0.4);
    tl.fromTo(sc.tagPanel, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% -5% 0% 0%)", duration: 0.35, ease: "power3.out" }, e + 0.4);
    tl.fromTo([sc.tag1, sc.tag2], { autoAlpha: 0, x: -60 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power3.out", stagger: 0.12 }, e + 0.55);
    tl.fromTo(sc.flame, { autoAlpha: 0, scale: 0, transformOrigin: "50% 100%" }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(3)" }, e + 0.6);
    drawIn(tl, sc.zigRed, e + 0.6, 0.4);
    drawIn(tl, sc.zig, e + 0.7, 0.4);

    // slow push-in while it holds, then everything pushes forward on the way out
    tl.to(p, { scale: 1.035 * z, duration: T - 2.6, ease: "none" }, 2.0);
    tl.to(sc.badge, { rotation: 6, svgOrigin: sc.badgeXY, duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: Math.max(1, Math.floor((T - e - 1.6) / 1.2) - 1) }, e + 1.0);
    tl.to([sc.titleWrap, sc.tag], { scale: 0.9, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, T - 0.5);
    tl.to(p, { scale: 1.2 * z, duration: 0.45, ease: "power2.in" }, T - 0.45);
    return tl;
  }

  /* =====================================================================
     SLOGAN SLIDES – words only (from the original promo, new orange)
     ===================================================================== */
  var COLOURS = { white: "#ffffff", black: "#111111", orange: ORANGE, cream: "#F7F3EE", dark: "#000000" };   // dark = plain black, matches the logo
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
      span.style.color = bg;
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
      if (lb > 60 && lb < 200) span.style.textShadow = extrude(mix(bg, "#000000", 0.38), Math.max(3, Math.round(fs * 0.03)));
    }
  }
  function sloganLineIn(tl, sc, L, span, la) {
    var fxn = L.in || "slam", chars, n;
    if (fxn === "fromLeft" || fxn === "fromRight") {
      var dir = fxn === "fromLeft" ? -1 : 1;
      tl.fromTo(span, { autoAlpha: 1, x: dir * 1300 }, { x: 0, duration: 0.75, ease: "expo.out" }, la);
      blur(tl, span, 60, 0.5, la);
      return la + 0.6;
    }
    if (fxn === "slam") {
      tl.fromTo(span, { autoAlpha: 0, scale: 2.6 }, { autoAlpha: 1, scale: 1, duration: 0.36, ease: "power4.out" }, la);
      blur(tl, span, 20, 0.3, la, "xy");
      shake(tl, sc, la + 0.3, L.shake || 1);
      return la + 0.4;
    }
    if (fxn === "stretch") {
      tl.fromTo(span, { autoAlpha: 0, scaleX: 3.2, scaleY: 0.7 }, { autoAlpha: 1, scaleX: 1, scaleY: 1, duration: 0.7, ease: "expo.out" }, la);
      blur(tl, span, 70, 0.55, la);
      return la + 0.6;
    }
    if (fxn === "zoom") {
      tl.fromTo(span, { autoAlpha: 0, scale: 0.12 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: "expo.out" }, la);
      blur(tl, span, 16, 0.4, la, "xy");
      return la + 0.6;
    }
    if (fxn === "flip") {
      tl.fromTo(span, { autoAlpha: 0, rotationX: -95, transformPerspective: 900, transformOrigin: "50% 100%" },
        { autoAlpha: 1, rotationX: 0, duration: 0.7, ease: "back.out(1.6)" }, la);
      return la + 0.6;
    }
    if (fxn === "wipe") {
      tl.fromTo(span, { autoAlpha: 1, clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power3.inOut" }, la);
      return la + 0.6;
    }
    if (fxn === "spin") {
      tl.fromTo(span, { autoAlpha: 0, scale: 0, rotation: -200 }, { autoAlpha: 1, scale: 1, rotation: L.tilt || 0, duration: 0.9, ease: "back.out(1.7)" }, la);
      return la + 0.8;
    }
    chars = splitChars(span); n = chars.length;
    tl.set(span, { autoAlpha: 1 }, la);
    if (fxn === "rise") {
      tl.fromTo(chars, { autoAlpha: 0, yPercent: 110, rotationX: -80 }, { autoAlpha: 1, yPercent: 0, rotationX: 0, duration: 0.6, ease: "power3.out", stagger: 0.04 }, la);
      return la + 0.5 + 0.04 * n;
    }
    if (fxn === "drop") {
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
    var T = 0.45;
    var cur = col((p.beats[0] || {}).bg || "dark");
    var side = 1;
    p.beats.forEach(function (b) {
      var bg = col(b.bg || cur), start = T;
      if (bg !== cur) {
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
      if (b.ghost) {
        var g = el("div", "ghost", beat, b.ghost);
        g.style.color = lum(bg) > 150 ? "rgba(0,0,0,0.06)" : lum(bg) < 60 ? "rgba(255,255,255,0.06)" : mix(bg, "#000000", 0.12);
        g.style.top = ((b.y || 960) - 250) + "px";
        tl.fromTo(g, { x: 500 }, { x: -g.offsetWidth + 200, duration: 6, ease: "none" }, start);
      }
      var stack = [], logoEl = null;
      if (b.logo === "center" || b.logo === "top") {
        logoEl = el("div", "logo-big", beat);
        var li = el("img", null, logoEl); li.src = CFG.logo; li.alt = "The Nile";
        if (b.logo === "center") stack.push({ node: logoEl, h: logoEl.offsetHeight });
      }
      var lines = (b.lines || []).map(function (L) {
        var row = el("div", "sl-line", beat);
        var span = el("span", "sl-text", row, L.t);
        if (L.font === "brush") { span.style.fontFamily = '"Brush", sans-serif'; span.style.letterSpacing = "0.01em"; span.style.filter = "url(#brushTex)"; }
        span.style.fontSize = (L.size || 160) + "px";
        var fs = fitWidth(span, L.maxW || 980, 30);
        styleLine(span, L, bg, fs);
        fitWidth(span, L.maxW || 980, 30);
        stack.push({ node: row, h: span.offsetHeight, space: L.space || 0 });
        return { L: L, row: row, span: span };
      });
      var gap = b.gap != null ? b.gap : 26;
      var total = stack.reduce(function (a, s) { return a + s.h + (s.space || 0); }, 0) + gap * Math.max(0, stack.length - 1);
      var y = (b.y || 960) - total / 2;
      stack.forEach(function (s) { y += s.space || 0; s.node.style.top = Math.round(y) + "px"; y += s.h + gap; });
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
      tl.fromTo(beat, { scale: 1 }, { scale: 1.04, duration: holdEnd - start, ease: "none" }, start);
      var d = sloganExit(tl, beat, b.out || "whipL", holdEnd);
      T = holdEnd + d * 0.6;
    });
    return { tl: tl, dur: T + 0.15 };
  }

  /* =====================================================================
     TRANSITIONS + PLAYBACK
     ===================================================================== */
  var bandA, bandB, BELOW = 2700, COVER = -1250, ABOVE = -5200;
  function buildWipe() {
    var wipe = el("div", "wipe", stage);
    var rot = el("div", "wipe-rot", wipe);
    bandA = el("div", "wipe-band", rot);
    bandB = el("div", "wipe-band", rot);
    bandA.style.background = ORANGE;
    bandB.style.background = "#111111";
    gsap.set([bandA, bandB], { y: ABOVE });
  }
  function wipeIn(tl, at) {     // diagonal bands cover the screen, finishing at "at"
    tl.fromTo(bandA, { y: BELOW }, { y: COVER, duration: 0.45, ease: "power3.in", immediateRender: false }, at - 0.55);
    tl.fromTo(bandB, { y: BELOW }, { y: COVER, duration: 0.5, ease: "power3.in", immediateRender: false }, at - 0.5);
  }
  function wipeOut(tl, at) {    // and carry on off the top
    tl.fromTo(bandB, { y: COVER }, { y: ABOVE, duration: 0.6, ease: "power3.out", immediateRender: false }, at + 0.02);
    tl.fromTo(bandA, { y: COVER }, { y: ABOVE, duration: 0.65, ease: "power3.out", immediateRender: false }, at + 0.12);
  }

  var slides = CFG.slides.filter(function (s) { return s.enabled !== false && (!only || s.id === only); });

  function play() {
    var scenes = slides.map(function (s, i) { return s.type === "slogan" ? buildSlogan(s) : buildFood(s, i); });
    var flash = el("div", "flash", stage);
    buildWipe();
    var roots = scenes.map(function (s) { return s.root; });
    var master = gsap.timeline({ repeat: -1, paused: true });
    var T = CFG.itemSeconds || 7.5, t = 0, starts = [];
    scenes.forEach(function (sc, i) {
      var built, dur;
      if (sc.slogan) { built = sloganTimeline(sc, sc.p); dur = built.dur; built = built.tl; }
      else { built = foodTimeline(sc, T); dur = T; }
      starts.push({ id: sc.p ? sc.p.id : sc.it.id, at: t });
      master.set(roots, { autoAlpha: 0 }, t);
      master.set(sc.root, { autoAlpha: 1 }, t);
      master.add(built, t);
      // how this slide hands over to the next: flash between food slides, diagonal wipe around slogans
      var next = scenes[(i + 1) % scenes.length];
      var useWipe = sc.slogan || next.slogan;
      if (useWipe) { wipeIn(master, t + dur); wipeOut(master, t + dur); }
      else {
        master.to(flash, { opacity: 1, duration: 0.16, ease: "power2.in" }, t + dur - 0.16);
        master.to(flash, { opacity: 0, duration: 0.4, ease: "power2.out" }, t + dur);
      }
      t += dur;
    });
    window.NILE_PROMO = { master: master, duration: t, starts: starts };
    if (freezeAt != null) master.pause(freezeAt);
    else if (!params.has("capture")) master.play(0);
    else master.pause(0);
    document.body.setAttribute("data-ready", "1");

    // reload every few hours to pick up edits (only when the files can be reached)
    var loadedAt = Date.now();
    master.eventCallback("onRepeat", function () {
      if ((Date.now() - loadedAt) / 3600000 < 3) return;
      if (location.protocol === "file:") { location.reload(); return; }
      fetch("items.js?check=" + Date.now(), { cache: "no-store" }).then(function (r) { if (r.ok) location.reload(); }).catch(function () {});
    });
  }

  function loadImg(src) {
    return new Promise(function (res) { var im = new Image(); im.onload = function () { (im.decode ? im.decode().catch(function () {}) : Promise.resolve()).then(res); }; im.onerror = res; im.src = src; });
  }
  var loads = slides.filter(function (s) { return s.type !== "slogan"; }).map(function (s) { return loadImg("images/items/" + s.id + ".jpg"); })
    .concat([loadImg(CFG.badge), loadImg(CFG.logo)]);
  if (document.fonts) { loads.push(document.fonts.load("200px Brush")); loads.push(document.fonts.load("900 40px Montserrat")); loads.push(document.fonts.load("800 40px Montserrat")); }
  Promise.all(loads).then(play);
})();
