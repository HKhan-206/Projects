/* The Nile – promo screen v2 engine (test mock-up).
   Preview options:  ?item=peri-burger   ?t=3 (freeze at 3 s)   ?rotate=90 */
(function () {
  "use strict";
  var CFG = window.PROMO2;
  var params = new URLSearchParams(location.search);
  var only = params.get("item");
  var freezeAt = params.has("t") ? parseFloat(params.get("t")) : null;
  var rotate = parseInt(params.get("rotate") || "0", 10);
  var W = 1080, H = 1920, K = 0.7;      // photo shown at 70% of its pixel size (1400px wide)
  var stage = document.getElementById("stage");

  function el(tag, cls, parent, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }

  function scale() {
    var turned = rotate === 90 || rotate === 270;
    var k = Math.min(window.innerWidth / (turned ? H : W), window.innerHeight / (turned ? W : H));
    stage.style.transform = "translate(-50%, -50%) rotate(" + (rotate || 0) + "deg) scale(" + k + ")";
  }
  scale();
  window.addEventListener("resize", scale);

  var items = CFG.items.filter(function (it) { return !only || it.id === only; });

  function build(it) {
    var sc = { it: it };
    sc.root = el("section", "scene", stage);
    var lw = it.layerW * K, lh = it.layerH * K;
    sc.bg = el("div", "bg", sc.root);
    sc.bg.style.height = lh + "px";
    sc.bg.style.background = "linear-gradient(180deg," + it.bgStops.map(function (s) { return s[1] + " " + s[0] + "%"; }).join(",") + ")";
    sc.photo = el("div", "photo", sc.root);
    Object.assign(sc.photo.style, { width: lw + "px", height: lh + "px", left: ((W - lw) / 2) + "px" });
    var img = el("img", null, sc.photo); img.src = it.image; img.alt = "";
    sc.name = el("div", "name " + (it.nameStyle || "write"), sc.root);
    sc.chars = [];
    it.name.split("\n").forEach(function (line) {
      var row = el("div", "row", sc.name);
      Array.from(line).forEach(function (c) { sc.chars.push(el("span", "ch", row, c === " " ? " " : c)); });
    });
    // keep long names inside the screen
    var fs = parseFloat(getComputedStyle(sc.name).fontSize);
    function widest() {
      var m = 0;
      sc.name.querySelectorAll(".row").forEach(function (r) {
        var wsum = 0; r.querySelectorAll(".ch").forEach(function (c) { wsum += c.offsetWidth; }); m = Math.max(m, wsum);
      });
      return m;
    }
    while (widest() > 960 && fs > 60) { fs -= 4; sc.name.style.fontSize = fs + "px"; }
    sc.logo = el("div", "logo", sc.root);
    var li = el("img", null, sc.logo); li.src = CFG.logo; li.alt = "The Nile";
    return sc;
  }

  /* ---- the photo entrance: whole photograph slides in from the right ---- */
  function photoIn(tl, sc, at) {
    var p = sc.photo;
    tl.set(p, { x: W + 260, scale: 1.14 }, 0);
    // fast start, long smooth slow-down, slight overshoot past centre
    tl.to(p, { x: -34, duration: 0.95, ease: "expo.out" }, at);
    tl.to(p, { scale: 0.985, duration: 1.05, ease: "power3.out" }, at);
    // settle back
    tl.to(p, { x: 0, duration: 0.7, ease: "sine.inOut" }, at + 0.95);
    tl.to(p, { scale: 1, duration: 0.8, ease: "sine.inOut" }, at + 1.05);
    return at + 1.75;
  }

  /* ---- item name, like the reference ---- */
  function nameIn(tl, sc, at) {
    var ch = sc.chars;
    tl.set(ch, { autoAlpha: 0 }, 0);
    if (sc.it.nameStyle === "build") {
      // chunky letters pop on one by one with a wobble, then the word shakes
      ch.forEach(function (c, i) {
        var r = ((i * 47) % 30) - 15;
        tl.fromTo(c, { autoAlpha: 0, scale: 0, rotation: r * 2, y: -80 },
          { autoAlpha: 1, scale: 1, rotation: r * 0.25, y: 0, duration: 0.45, ease: "back.out(3)" }, at + i * 0.07);
      });
      var end = at + ch.length * 0.07 + 0.3;
      tl.to(sc.name, { keyframes: { x: [16, -13, 10, -6, 3, 0], rotation: [1.5, -1.2, 0.8, -0.4, 0.2, 0] }, duration: 0.5, ease: "none" }, end);
      tl.to(ch, { rotation: 0, duration: 0.4, ease: "power2.out" }, end + 0.4);
      return end + 0.5;
    }
    // hand-drawn: letters write on left to right, like a marker stroke
    ch.forEach(function (c, i) {
      tl.fromTo(c, { autoAlpha: 1, clipPath: "inset(-20% 100% -20% 0%)", y: 6 },
        { clipPath: "inset(-20% -10% -20% 0%)", y: 0, duration: 0.2, ease: "power1.in" }, at + i * 0.06);
    });
    var e = at + ch.length * 0.06 + 0.2;
    tl.fromTo(sc.name, { scale: 1 }, { keyframes: { scale: [1.07, 0.98, 1] }, duration: 0.45, ease: "power1.out" }, e);
    return e + 0.45;
  }

  function play() {
    var scenes = items.map(build);
    var flash = el("div", "flash", stage);
    var master = gsap.timeline({ repeat: -1, paused: true });
    var T = CFG.itemSeconds || 6.5, t = 0;
    scenes.forEach(function (sc, i) {
      var tl = gsap.timeline();
      tl.set(sc.logo, { autoAlpha: 0 }, 0);
      photoIn(tl, sc, 0.15);
      nameIn(tl, sc, 1.15);
      tl.fromTo(sc.logo, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 1.6);
      // slow push-in while holding
      tl.to(sc.photo, { scale: 1.035, duration: T - 2.6, ease: "none" }, 2.0);
      // exit: name pops away, photo pushes forward into a flash
      tl.to(sc.name, { scale: 0.85, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, T - 0.55);
      tl.to(sc.photo, { scale: 1.2, duration: 0.45, ease: "power2.in" }, T - 0.45);
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

  var loads = items.map(function (it) {
    return new Promise(function (res) { var im = new Image(); im.onload = function () { (im.decode ? im.decode().catch(function () {}) : Promise.resolve()).then(res); }; im.onerror = res; im.src = it.image; });
  });
  loads.push(document.fonts ? document.fonts.load("128px Marker") : Promise.resolve());
  loads.push(document.fonts ? document.fonts.load("900 120px Montserrat") : Promise.resolve());
  Promise.all(loads).then(play);
})();
