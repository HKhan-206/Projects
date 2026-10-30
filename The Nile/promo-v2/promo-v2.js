/* The Nile – promo screen v2 engine (test mock-up).
   Preview options:  ?item=peri-burger   ?t=3 (freeze at 3 s)   ?rotate=90 */
(function () {
  "use strict";
  var CFG = window.PROMO2;
  var params = new URLSearchParams(location.search);
  var only = params.get("item");
  var freezeAt = params.has("t") ? parseFloat(params.get("t")) : null;
  var rotate = parseInt(params.get("rotate") || "0", 10);
  var W = 1080, H = 1920, K = 0.7;          // photo shown at 70% of its pixel size (1400px wide)
  var NS = "http://www.w3.org/2000/svg";
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
  function svgLayer(parent, cls) { return sv("svg", { "class": cls || "gfx", viewBox: "0 0 1080 1920", width: 1080, height: 1920 }, parent); }
  function seeded(seed) {             // repeatable "random" so every loop looks the same
    return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
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
      '<feTurbulence type="fractalNoise" baseFrequency="0.03 0.55" numOctaves="2" seed="4" result="n"/>' +
      '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3.2 0 0 0 1.9" result="m"/>' +
      '<feFlood flood-color="#8a5220" flood-opacity="0.30"/>' +
      '<feComposite in2="m" operator="in" result="streak"/>' +
      '<feComposite in="streak" in2="SourceGraphic" operator="atop" result="tex"/>' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="9" result="d"/>' +
      '<feDisplacementMap in="tex" in2="d" scale="5" xChannelSelector="R" yChannelSelector="G"/>' +
    '</filter>' +
    // organic brush edges for panels, blobs and scribbles
    '<filter id="rough" x="-10%" y="-10%" width="120%" height="120%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="2" result="d"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="d" scale="12" xChannelSelector="R" yChannelSelector="G"/>' +
    '</filter>' +
    '<filter id="roughSoft" x="-10%" y="-10%" width="120%" height="120%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="5" result="d"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="d" scale="6" xChannelSelector="R" yChannelSelector="G"/>' +
    '</filter>' +
    '<linearGradient id="flameG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff5a00"/><stop offset="0.6" stop-color="#ffb000"/><stop offset="1" stop-color="#ffe066"/></linearGradient>';

  var fx = 0;
  function blur(tl, target, amount, dur, at, dir) {        // motion blur that fades out as the move slows
    var id = "mb" + (fx++);
    var f = sv("filter", { id: id, x: "-30%", y: "-30%", width: "160%", height: "160%" }, defs);
    var g = sv("feGaussianBlur", { stdDeviation: "0 0" }, f);
    var from = dir === "y" ? "0 " + amount : dir === "xy" ? amount * 0.7 + " " + amount * 0.7 : amount + " 0";
    tl.set(target, { filter: "url(#" + id + ")" }, at);
    tl.fromTo(g, { attr: { stdDeviation: from } }, { attr: { stdDeviation: "0 0" }, duration: dur, ease: "power2.out", immediateRender: false }, at);
    tl.set(target, { filter: "none" }, at + dur);
  }

  /* ---------- brush shapes ---------- */
  // rough painted rectangle with dry-brush ends
  function brushRect(x, y, w, h, R) {
    var pts = [], i, s = 22;
    for (i = 0; i <= w; i += s) pts.push([x + i, y + (R() - 0.5) * 10]);
    for (i = 0; i <= h; i += 14) pts.push([x + w + R() * 34 - (i % 28 ? 0 : 22), y + i]);
    for (i = w; i >= 0; i -= s) pts.push([x + i, y + h + (R() - 0.5) * 10]);
    for (i = h; i >= 0; i -= 14) pts.push([x - R() * 34 + (i % 28 ? 0 : 22), y + i]);
    return "M" + pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join("L") + "Z";
  }
  // soft blotchy blob
  function blob(cx, cy, rx, ry, R) {
    var pts = [], n = 26;
    for (var i = 0; i < n; i++) {
      var a = i / n * Math.PI * 2, k = 0.8 + R() * 0.35;
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    return "M" + pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join("L") + "Z";
  }
  function scribble(x, y, w, h, n, R) {
    var d = "M" + x + "," + y;
    for (var i = 1; i <= n; i++) {
      var px = x + (i % 2 ? w : 0) + (R() - 0.5) * 30, py = y + i * h / n + (R() - 0.5) * 12;
      d += " L" + px.toFixed(1) + "," + py.toFixed(1);
    }
    return d;
  }
  function drawIn(tl, path, at, dur) {                  // stroke draws itself on
    var len = path.getTotalLength();
    path.style.strokeDasharray = len + " " + len;
    tl.fromTo(path, { strokeDashoffset: len, autoAlpha: 1 }, { strokeDashoffset: 0, duration: dur, ease: "power2.out" }, at);
  }

  /* ---------- build one scene ---------- */
  var items = CFG.items.filter(function (it) { return !only || it.id === only; });

  function build(it, idx) {
    var R = seeded(1000 + idx * 77);
    var sc = { it: it };
    sc.root = el("section", "scene", stage);
    var lw = it.layerW * K, lh = it.layerH * K;

    // background + complete photo
    sc.bg = el("div", "bg", sc.root);
    sc.bg.style.height = lh + "px";
    sc.bg.style.background = "linear-gradient(180deg," + it.bgStops.map(function (s) { return s[1] + " " + s[0] + "%"; }).join(",") + ")";
    sc.photo = el("div", "photo", sc.root);
    Object.assign(sc.photo.style, { width: lw + "px", height: lh + "px", left: ((W - lw) / 2) + "px" });
    var img = el("img", null, sc.photo); img.src = it.image; img.alt = "";

    // painted background blobs + red scribbles (in the open background around the burger)
    var back = svgLayer(sc.root);
    var gB = sv("g", { filter: "url(#rough)" }, back);
    sc.blobs = [
      sv("path", { d: blob(250, 400, 330, 250, R), fill: "#e8670a", opacity: 0.5 }, gB),
      sv("path", { d: blob(900, 640, 170, 150, R), fill: "#e8670a", opacity: 0.4 }, gB)
    ];
    var gS = sv("g", { filter: "url(#rough)", fill: "none", stroke: "#ff3b55", "stroke-width": 26, "stroke-linecap": "round", "stroke-linejoin": "round" }, back);
    sc.scribbles = [
      sv("path", { d: scribble(905, 905, 120, 120, 6, R) }, gS)
    ];

    // far veg (behind the lettering)
    sc.vegFar = el("div", "", sc.root);

    // title on its dark brush panel
    var tw = el("div", "title-wrap", sc.root);
    tw.style.cssText = "position:absolute;left:58px;top:0;transform:rotate(-6deg);transform-origin:0 50%";
    var panelSvg = sv("svg", { style: "position:absolute;left:0;top:0;overflow:visible" }, tw);
    sc.title = el("div", "title", tw);
    sc.title.style.cssText = "position:relative;left:0;top:0;transform:none";
    sc.chars = [];
    sc.lines = it.title.map(function (L) {
      var line = el("div", "line " + (L[1] || "white"), sc.title);
      var chars = Array.from(L[0]).map(function (c) { return el("span", "ch", line, c === " " ? " " : c); });
      sc.chars = sc.chars.concat(chars);
      return { el: line, chars: chars };
    });
    // one size for every line, as big as fits
    var fs = it.title.length > 2 ? 210 : 260;
    function widest() { return Math.max.apply(null, sc.lines.map(function (l) { return l.el.scrollWidth; })); }
    sc.title.style.fontSize = fs + "px";
    sc.lines.forEach(function (l) { l.el.style.display = "inline-block"; l.el.style.float = "left"; l.el.style.clear = "left"; });
    while (widest() > 870 && fs > 90) { fs -= 6; sc.title.style.fontSize = fs + "px"; }
    sc.lines.forEach(function (l) { l.el.style.display = "block"; l.el.style.float = "none"; });
    var tW = widest(), tH = sc.title.offsetHeight;
    // centre the title block in the space above the burger
    var top = Math.round(560 - tH / 2) + (it.title.length > 2 ? 10 : 0);
    tw.style.top = top + "px";
    var px = 36, py = 18;
    panelSvg.setAttribute("width", tW + px * 2 + 80);
    panelSvg.setAttribute("height", tH + py * 2 + 80);
    panelSvg.style.left = (-px) + "px"; panelSvg.style.top = (-py) + "px";
    var gP = sv("g", { filter: "url(#rough)" }, panelSvg);
    sc.panel = sv("path", { d: brushRect(14, 10, tW + px * 2 - 30, tH + py * 2 + 26, R), fill: "#2a1206" }, gP);
    // white brush underline under the title
    sc.underline = sv("path", { d: "M" + (px + 30) + "," + (tH + py + 34) + " C" + (px + tW * 0.4) + "," + (tH + py + 22) + " " + (px + tW * 0.7) + "," + (tH + py + 24) + " " + (px + tW * 0.82) + "," + (tH + py + 16),
      fill: "none", stroke: "#fffaf2", "stroke-width": 18, "stroke-linecap": "round", filter: "url(#roughSoft)" }, panelSvg);
    sc.titleWrap = tw;

    // front graphics: action lines, arrow, logo bubble
    var front = svgLayer(sc.root);
    var gA = sv("g", { fill: "none", stroke: "#ffffff", "stroke-width": 13, "stroke-linecap": "round" }, front);
    var tTop = top - 40;
    sc.actions = [
      // little burst at the top-left of the title
      sv("path", { d: "M70," + (tTop + 10) + " L28," + (tTop - 40) }, gA),
      sv("path", { d: "M118," + (tTop - 18) + " L104," + (tTop - 84) }, gA),
      sv("path", { d: "M36," + (tTop + 64) + " L-10," + (tTop + 52) }, gA),
      // burst at the top-right of the burger
      sv("path", { d: "M860,1010 L890,955" }, gA),
      sv("path", { d: "M910,1040 L965,1005" }, gA),
      // motion arcs on the right of the burger
      sv("path", { d: "M1000,1210 q28,40 0,82" }, gA),
      sv("path", { d: "M1036,1190 q38,58 0,120" }, gA)
    ];
    // curved arrow from the tagline to the burger
    sc.arrow = sv("path", { d: "M690,1785 C780,1780 830,1720 850,1625", fill: "none", stroke: "#ffffff", "stroke-width": 11, "stroke-linecap": "round" }, front);
    sc.arrowHead = sv("path", { d: "M822,1648 L852,1616 L875,1655", fill: "none", stroke: "#ffffff", "stroke-width": 11, "stroke-linecap": "round", "stroke-linejoin": "round" }, front);
    // "THE NILE" speech-bubble badge
    sc.bubble = sv("g", { transform: "translate(930,150)" }, front);
    var gBub = sv("g", { filter: "url(#roughSoft)" }, sc.bubble);
    sv("circle", { cx: 0, cy: 0, r: 112, fill: "#2a1206" }, gBub);
    sv("path", { d: "M-70,70 L-108,128 L-30,96 Z", fill: "#2a1206" }, gBub);
    var bt = sv("text", { x: 4, y: -6, "text-anchor": "middle", "font-family": "Brush", "font-size": 76, fill: "#ffb21a", transform: "rotate(-8)" }, sc.bubble);
    bt.textContent = "THE";
    var bt2 = sv("text", { x: 4, y: 64, "text-anchor": "middle", "font-family": "Brush", "font-size": 76, fill: "#ffb21a", transform: "rotate(-8)" }, sc.bubble);
    bt2.textContent = "NILE";

    // tagline on a small brush panel
    sc.tag = el("div", "tag", sc.root);
    var tagSvg = sv("svg", { style: "position:absolute;left:-30px;top:-14px;overflow:visible", width: 720, height: 160 }, sc.tag);
    var gT = sv("g", { filter: "url(#rough)" }, tagSvg);
    sc.tagPanel = sv("path", { d: brushRect(8, 4, 660, 146, R), fill: "#2a1206" }, gT);
    var flame = sv("svg", { "class": "flame", viewBox: "0 0 60 72" }, sc.tag);
    sv("path", { d: "M30,2 C36,20 54,28 52,48 C50,64 40,70 30,70 C18,70 8,62 8,48 C8,36 16,30 20,22 C22,32 26,34 28,34 C26,22 26,12 30,2 Z", fill: "url(#flameG)" }, flame);
    sv("path", { d: "M30,40 C34,48 40,52 38,60 C36,66 33,68 30,68 C26,68 22,65 22,59 C22,53 27,50 30,40 Z", fill: "#fff3b0" }, flame);
    var txt = el("div", "txt", sc.tag);
    sc.tag1 = el("div", "t t1", txt, it.tagline[0]);
    sc.tag2 = el("div", "t t2", txt, it.tagline[1]);
    var tagW = Math.max(sc.tag1.offsetWidth, sc.tag2.offsetWidth) + 82 + 60;   // panel fits the text
    tagSvg.setAttribute("width", tagW + 80);
    sc.tagPanel.setAttribute("d", brushRect(8, 4, tagW, 146, R));
    sc.flame = flame;

    // flying veg
    sc.vegNear = el("div", "", sc.root);
    sc.veg = [];
    if (it.veg) {
      var V = [
        // img, centre x, y, size, end rotation, depth
        ["tomato",   1000, 1135, 220,  18, "mid"],
        ["cucumber",  70, 1235, 290, -24, "near"],
        ["tomato",   150,  975, 125, -30, "far"],
        ["cucumber", 830,  930, 150,  35, "far"],
        ["tomato",   1020, 1830, 330,  12, "near"],
        ["cucumber", 120,  1690, 150, 50, "far"]
      ];
      V.forEach(function (v, i) {
        var host = v[5] === "near" ? sc.vegNear : sc.vegFar;
        var box = el("div", "veg", host);
        box.style.width = v[3] + "px";
        box.style.left = (v[1] - v[3] / 2) + "px";
        box.style.top = (v[2] - v[3] / 2) + "px";
        var im = el("img", null, box); im.src = "images/veg/" + v[0] + ".png"; im.alt = "";
        box.style.filter = v[5] === "near" ? "blur(5px) drop-shadow(0 18px 18px rgba(80,25,0,.35))" : v[5] === "far" ? "blur(2.2px)" : "drop-shadow(0 14px 14px rgba(80,25,0,.35))";
        sc.veg.push({ box: box, img: im, x: v[1], y: v[2], rot: v[4], depth: v[5], i: i });
      });
    }
    return sc;
  }

  /* ---------- animation ---------- */
  function photoIn(tl, sc, at) {       // the whole photograph slides in from the right
    var p = sc.photo;
    tl.set(p, { x: W + 260, scale: 1.14 }, 0);
    tl.to(p, { x: -34, duration: 0.95, ease: "expo.out" }, at);
    tl.to(p, { scale: 0.985, duration: 1.05, ease: "power3.out" }, at);
    tl.to(p, { x: 0, duration: 0.7, ease: "sine.inOut" }, at + 0.95);
    tl.to(p, { scale: 1, duration: 0.8, ease: "sine.inOut" }, at + 1.05);
  }

  function vegIn(tl, sc, at, holdEnd) {
    sc.veg.forEach(function (v, k) {
      var dx = v.x - 540, dy = v.y - 1150, d = Math.hypot(dx, dy) || 1;
      var sx = dx / d * 1100, sy = dy / d * 900 - 200;           // come in from off-screen, along the line from the burger
      var t0 = at + k * 0.07;
      tl.set(v.box, { autoAlpha: 0 }, 0);
      tl.fromTo(v.box, { autoAlpha: 1, x: sx, y: sy, rotation: v.rot - 220 * (k % 2 ? 1 : -1), scale: 0.7 },
        { x: 0, y: 0, rotation: v.rot, scale: 1, duration: 1.05, ease: "expo.out" }, t0);
      blur(tl, v.img, v.depth === "near" ? 26 : 18, 0.55, t0, "xy");
      // gentle floating while the scene holds
      var amp = v.depth === "near" ? 18 : v.depth === "far" ? 8 : 12, per = 1.5 + (k % 3) * 0.35;
      var reps = Math.max(1, Math.floor((holdEnd - (t0 + 1.05)) / per) - 1);
      tl.to(v.box, { y: (k % 2 ? -amp : amp), rotation: v.rot + (k % 2 ? 7 : -7), duration: per, ease: "sine.inOut", yoyo: true, repeat: reps }, t0 + 1.05);
    });
  }

  function titleIn(tl, sc, at) {
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
    return t + 0.25;
  }

  function extrasIn(tl, sc, at) {
    sc.blobs.forEach(function (b, i) {
      tl.fromTo(b, { autoAlpha: 0, scale: 0.6, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "power3.out" }, 0.25 + i * 0.1);
    });
    tl.set(sc.scribbles.concat(sc.actions, [sc.arrow, sc.arrowHead]), { autoAlpha: 0 }, 0);
    sc.scribbles.forEach(function (s, i) { drawIn(tl, s, at + i * 0.15, 0.5); });
    sc.actions.forEach(function (a, i) { drawIn(tl, a, at + 0.25 + i * 0.05, 0.22); });
    tl.set(sc.tag, { autoAlpha: 0 }, 0);
    tl.set(sc.tag, { autoAlpha: 1 }, at + 0.3);
    tl.fromTo(sc.tagPanel, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% -5% 0% 0%)", duration: 0.35, ease: "power3.out" }, at + 0.3);
    tl.fromTo([sc.tag1, sc.tag2], { autoAlpha: 0, x: -60 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power3.out", stagger: 0.12 }, at + 0.45);
    tl.fromTo(sc.flame, { autoAlpha: 0, scale: 0, transformOrigin: "50% 100%" }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(3)" }, at + 0.5);
    drawIn(tl, sc.arrow, at + 0.75, 0.45);
    drawIn(tl, sc.arrowHead, at + 1.15, 0.15);
    tl.fromTo(sc.bubble, { autoAlpha: 0, scale: 0, rotation: -25, svgOrigin: "930 150" }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2.6)" }, at + 0.6);
  }

  function play() {
    var scenes = items.map(build);
    var flash = el("div", "flash", stage);
    var master = gsap.timeline({ repeat: -1, paused: true });
    var T = CFG.itemSeconds || 7.5, t = 0;
    scenes.forEach(function (sc) {
      var tl = gsap.timeline();
      photoIn(tl, sc, 0.15);
      vegIn(tl, sc, 0.95, T - 0.5);
      var e = titleIn(tl, sc, 1.05);
      extrasIn(tl, sc, e - 0.3);
      tl.to(sc.photo, { scale: 1.035, duration: T - 2.6, ease: "none" }, 2.0);
      // exit: everything pushes forward into a flash
      tl.to([sc.titleWrap, sc.tag], { scale: 0.9, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, T - 0.5);
      tl.to(sc.photo, { scale: 1.2, duration: 0.45, ease: "power2.in" }, T - 0.45);
      sc.veg.forEach(function (v) { tl.to(v.box, { x: (v.x - 540) * 0.8, y: (v.y - 1150) * 0.5, scale: 1.4, duration: 0.45, ease: "power2.in" }, T - 0.45); });
      master.set(scenes.map(function (s) { return s.root; }), { autoAlpha: 0 }, t);
      master.set(sc.root, { autoAlpha: 1 }, t);
      master.add(tl, t);
      master.to(flash, { opacity: 1, duration: 0.16, ease: "power2.in" }, t + T - 0.16);
      master.to(flash, { opacity: 0, duration: 0.4, ease: "power2.out" }, t + T);
      t += T;
    });
    window.NILE_PROMO = { master: master, duration: t };
    if (freezeAt != null) master.pause(freezeAt);
    else if (!params.has("capture")) master.play(0);
    else master.pause(0);
    document.body.setAttribute("data-ready", "1");
  }

  function loadImg(src) {
    return new Promise(function (res) { var im = new Image(); im.onload = function () { (im.decode ? im.decode().catch(function () {}) : Promise.resolve()).then(res); }; im.onerror = res; im.src = src; });
  }
  var loads = items.map(function (it) { return loadImg(it.image); }).concat([loadImg("images/veg/tomato.png"), loadImg("images/veg/cucumber.png")]);
  if (document.fonts) { loads.push(document.fonts.load("200px Brush")); loads.push(document.fonts.load("900 40px Montserrat")); }
  Promise.all(loads).then(play);
})();
