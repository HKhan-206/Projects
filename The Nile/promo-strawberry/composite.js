/* Strawberry Millions Milkshake promo – composites the layers listed in promo.config.js,
   following the reference beat for beat:
     0 s     big strawberry drifting down, title letters already flying in
     1.7 s   milkshake drops in from the top, tilted and motion-blurred, past the title
     2.3 s   it lands on the strawberry; sauce splashes up both sides
     then    title keeps scattering and re-forming, everything keeps moving
   Preview options: ?t=3 (freeze at 3 s)   ?capture=1 (paused, for frame export)   ?standin=1 (layout test cup) */
(function () {
  "use strict";
  var C = window.PROMO, W = 1080, H = 1920, D = C.duration;
  var params = new URLSearchParams(location.search);
  var stage = document.getElementById("stage");
  stage.style.background = C.background;

  function scale() {
    var k = Math.min(innerWidth / W, innerHeight / H);
    stage.style.transform = "translate(-50%, -50%) scale(" + k + ")";
  }
  scale(); addEventListener("resize", scale);

  // seeded random, so every render is identical
  var seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function between(a, b) { return a + (b - a) * rnd(); }

  function pad(n) { return String(n).padStart(4, "0"); }
  function loadImg(src) { return new Promise(function (res) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = function () { console.warn("missing", src); res(null); }; i.src = src; }); }
  function loadSeq(s) {
    var list = [];
    for (var n = s.from; n <= s.to; n++) list.push(loadImg(s.frames.replace("%04d", pad(n))));
    return Promise.all(list);
  }

  var shakeSrc = params.has("standin") ? "source/STANDIN-milkshake-preview-only.png" : C.milkshake.src;
  Promise.all([loadSeq(C.strawberry), loadSeq(C.splash), loadSeq(C.splashLoop), loadImg(shakeSrc),
               Promise.all(C.pieces.map(function (p) { return loadImg(p.src); })), document.fonts.load("130px Marker")])
    .then(function (r) { build(r[0], r[1], r[2], r[3], r[4]); });

  function build(sbFrames, spFrames, spLoopFrames, shakeImg, pieceImgs) {
    var st = { f: 0, x: 0, y: 0, r: 0, dip: 0, sp: -1, spM: -1 };
    var spAll = spFrames.concat(spLoopFrames.filter(Boolean)), spLen = spFrames.length;

    // ---------- the big strawberry (clip frames, steered along the reference's path) ----------
    var S = C.strawberry, sbCtx = document.getElementById("strawberry").getContext("2d");
    var centres = window.SB_CENTRES.slice(S.from - 1, S.to);
    function drawStrawberry() {
      sbCtx.clearRect(0, 0, W, H);
      var i = Math.max(0, Math.min(sbFrames.length - 1, Math.round(st.f))), f = sbFrames[i], c = centres[i];
      if (!f) return;
      sbCtx.save();
      sbCtx.translate(st.x, st.y + st.dip); sbCtx.rotate(st.r * Math.PI / 180); sbCtx.scale(S.scale, S.scale);
      sbCtx.drawImage(f, -c[0], -c[1]);
      sbCtx.restore();
    }

    // ---------- sauce: the same splash on both sides, the right one mirrored and a touch later ----------
    var spCtx = document.getElementById("splash").getContext("2d");
    var k = C.splashSize * W / 1076, sw = 1076 * k, sh = 1924 * k;
    function drawSplash() {
      spCtx.clearRect(0, 0, W, H);
      [[st.sp, false], [st.spM, true]].forEach(function (s) {
        if (s[0] < 0) return;
        var f = spAll[Math.min(spAll.length - 1, Math.round(s[0]))];
        if (!f) return;
        spCtx.save();
        if (s[1]) { spCtx.translate(W, 0); spCtx.scale(-1, 1); }
        spCtx.drawImage(f, -6, H - sh + 6, sw, sh);
        spCtx.restore();
      });
    }

    // ---------- milkshake photo: placed as-is (only positioned, sized and tilted) ----------
    var M = C.milkshake, wrap = document.getElementById("shakeWrap"), shake = document.getElementById("shake");
    shake.src = shakeImg.src;
    var mw = M.width, mh = Math.round(shakeImg.naturalHeight * mw / shakeImg.naturalWidth);
    Object.assign(wrap.style, { width: mw + "px", height: mh + "px", left: (M.centreX - mw / 2) + "px", top: (M.bottom - mh) + "px", transformOrigin: "50% 88%" });

    // ---------- small strawberry halves ----------
    var host = document.getElementById("pieces");
    var pieces = C.pieces.map(function (p, i) {
      var el = document.createElement("img"); el.className = "piece"; el.src = pieceImgs[i] ? pieceImgs[i].src : p.src;
      el.style.width = p.width + "px"; el.style.left = p.x + "px"; el.style.top = p.y + "px";
      if (p.blur) el.style.filter = "blur(" + p.blur + "px) drop-shadow(0 14px 14px rgba(0,70,60,.22))";
      if (p.flip) el.style.scale = "-1 1";
      host.appendChild(el); return el;
    });

    // ---------- title letters ----------
    var T = C.title, title = document.getElementById("title"); title.style.top = T.top + "px";
    var chars = [];
    T.lines.forEach(function (t) {
      var line = document.createElement("span"); line.className = "line"; title.appendChild(line);
      Array.from(t).forEach(function (c) { var s = document.createElement("span"); s.className = "ch"; s.textContent = c; line.appendChild(s); chars.push(s); });
      var fs = T.size; line.style.fontSize = fs + "px";
      function w() { var t = 0; line.querySelectorAll(".ch").forEach(function (c) { t += c.getBoundingClientRect().width; }); return t; }
      while (w() > 1000 && fs > 60) { fs -= 4; line.style.fontSize = fs + "px"; }
    });

    var tl = gsap.timeline({ repeat: -1, paused: true, onUpdate: function () { drawStrawberry(); drawSplash(); } });
    tl.set({}, {}, D);   // fixes the loop length

    // 1. strawberry drifts down, turning onto its side, and lands low
    var P = S.path, last = sbFrames.length - 1, landT = P[P.length - 1][0];
    tl.set(st, { x: P[0][1], y: P[0][2], r: P[0][3], f: 0 }, 0);
    for (var i = 1; i < P.length; i++) {
      tl.to(st, { x: P[i][1], y: P[i][2], r: P[i][3], duration: P[i][0] - P[i - 1][0], ease: i === P.length - 1 ? "power2.in" : "none" }, P[i - 1][0]);
    }
    tl.fromTo(st, { f: 0 }, { f: last, duration: landT, ease: "none" }, 0);
    // ...gets knocked down a little when the cup lands, then keeps rocking and turning to the end
    tl.to(st, { keyframes: { dip: [34, -8, 0] }, duration: 0.7, ease: "sine.out" }, M.landAt);
    var rf = [S.rockFrames[0] - S.from, S.rockFrames[1] - S.from], rockPer = 1.3;
    tl.fromTo(st, { f: last }, { f: rf[0], duration: rockPer, ease: "sine.inOut", yoyo: true, repeat: Math.ceil((D - landT) / rockPer), immediateRender: false }, landT);
    tl.to(st, { r: 2.5, duration: 1.7, ease: "sine.inOut", yoyo: true, repeat: Math.ceil((D - landT) / 1.7) }, landT);

    // 2. milkshake falls in from the top past the title, blurred, tilted – lands, bounces, floats
    tl.set(wrap, { autoAlpha: 0 }, 0);
    tl.fromTo(wrap, { autoAlpha: 1, y: -mh - 300, rotation: M.angle - 16, filter: "blur(9px)" },
                    { y: 0, rotation: M.angle - 3, filter: "blur(0px)", duration: M.landAt - M.dropAt, ease: "power2.in", immediateRender: false }, M.dropAt);
    tl.to(wrap, { y: -48, rotation: M.angle + 2, duration: 0.24, ease: "power2.out" }, M.landAt);
    tl.to(wrap, { y: 0, rotation: M.angle, duration: 0.4, ease: "power2.in" }, M.landAt + 0.24);
    var fStart = M.landAt + 0.64, fPer = 1.6;
    tl.to(wrap, { y: -18, rotation: M.angle + 1.8, duration: fPer, ease: "sine.inOut", yoyo: true, repeat: Math.ceil((D - fStart) / fPer) }, fStart);

    // 3. sauce splashes up both sides from the impact and carries straight on into the continuation clip
    function sauce(key, delay) {
      var o = {}, a = C.splash.start + delay;
      tl.set(st, (o = {}, o[key] = -1, o), 0);
      tl.fromTo(st, (o = {}, o[key] = 0, o), (o = { duration: C.splash.end - C.splash.start, ease: "none", immediateRender: false }, o[key] = spLen - 1, o), a);
      if (spAll.length > spLen) {
        tl.fromTo(st, (o = {}, o[key] = spLen, o), (o = { duration: C.splashLoop.end - C.splash.end - delay, ease: "none", immediateRender: false }, o[key] = spAll.length - 1, o), C.splash.end + delay);
      }
    }
    sauce("sp", 0); sauce("spM", C.splashMirrorDelay);

    // 4. small halves are there from the start, drifting and turning gently the whole time
    pieces.forEach(function (el, i) {
      var p = C.pieces[i], dx = p.x < W / 2 ? -90 : 90;
      tl.fromTo(el, { autoAlpha: 0, x: dx, rotation: p.rotate - 25 * Math.sign(dx) }, { autoAlpha: 1, x: 0, rotation: p.rotate, duration: 0.9, ease: "power2.out" }, 0.05 * i);
      var per = 1.5 + (i % 3) * 0.35;
      tl.to(el, { y: (i % 2 ? -22 : 22), x: (i % 2 ? 10 : -10), rotation: p.rotate + (i % 2 ? 9 : -9), duration: per, ease: "sine.inOut", yoyo: true, repeat: Math.ceil((D - 1) / per) }, 0.9 + 0.05 * i);
    });

    // 5. title: letters fly in from all over, assemble, change colour, scatter, re-form...
    var cyc = T.cycle, nCyc = Math.floor(D / cyc), col = T.colours;
    tl.set(chars, { autoAlpha: 0 }, 0);
    for (var k2 = 0; k2 < nCyc; k2++) {
      var t0 = k2 * cyc, cIn = col[k2 % 2], cHold = col[(k2 + 1) % 2], lastCyc = k2 === nCyc - 1;
      chars.forEach(function (ch, j) {
        var s = t0 + between(0, 0.55);
        tl.fromTo(ch, { autoAlpha: 0, x: between(-260, 260), y: between(-200, 220), rotation: between(-70, 70), scale: between(0.15, 0.5), color: cIn },
                      { autoAlpha: 1, x: 0, y: 0, rotation: between(-4, 4), scale: 1, duration: 0.45, ease: "back.out(1.7)", immediateRender: false }, s);
        tl.to(ch, { color: cHold, duration: 0.3, ease: "none" }, t0 + 1.2 + between(0, 0.35));
        tl.to(ch, { y: (j % 2 ? -6 : 6), rotation: between(-5, 5), duration: 0.55, ease: "sine.inOut", yoyo: true, repeat: lastCyc ? 5 : 1 }, t0 + 1.0);
        if (!lastCyc) {
          tl.to(ch, { autoAlpha: 0, x: between(-220, 220), y: between(-160, 180), rotation: between(-60, 60), scale: between(0.2, 0.5), duration: 0.4, ease: "power2.in" }, t0 + cyc - 0.62 + between(0, 0.2));
        }
      });
    }

    // slow continuous push-in, drifting light
    tl.fromTo("#world", { scale: 1 }, { scale: 1.04, duration: D, ease: "none" }, 0);
    tl.fromTo("#glow", { x: -40 }, { x: 40, duration: D, ease: "sine.inOut" }, 0);
    // everything fades back to the plain background so the loop restarts cleanly
    var all = [wrap, title, host, "#strawberry", "#splash"];
    tl.to(all, { autoAlpha: 0, duration: 0.45, ease: "power1.in" }, D - 0.5);
    tl.set(["#strawberry", "#splash", title, host], { autoAlpha: 1 }, D);

    window.PROMO_TL = tl;
    tl.time(0.001); tl.time(0);
    if (params.has("t")) tl.pause(parseFloat(params.get("t")));
    else if (!params.has("capture")) tl.play(0);
    document.body.setAttribute("data-ready", "1");
  }
})();
