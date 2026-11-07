/* Strawberry Millions Milkshake promo – composites the layers listed in promo.config.js.
   Preview options: ?t=3 (freeze at 3 s)   ?capture=1 (paused, for frame export)   ?standin=1 (layout test cup) */
(function () {
  "use strict";
  var C = window.PROMO, W = 1080, H = 1920;
  var params = new URLSearchParams(location.search);
  var stage = document.getElementById("stage");
  document.getElementById("stage").style.background = C.background;

  function scale() {
    var k = Math.min(innerWidth / W, innerHeight / H);
    stage.style.transform = "translate(-50%, -50%) scale(" + k + ")";
  }
  scale(); addEventListener("resize", scale);

  function pad(n) { return String(n).padStart(4, "0"); }
  function loadImg(src) { return new Promise(function (res) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = function () { console.warn("missing", src); res(null); }; i.src = src; }); }
  function loadSeq(s) {
    var list = [];
    for (var n = s.from; n <= s.to; n++) list.push(loadImg(s.frames.replace("%04d", pad(n))));
    return Promise.all(list);
  }

  var shakeSrc = params.has("standin") ? "source/STANDIN-milkshake-preview-only.png" : C.milkshake.src;
  Promise.all([loadSeq(C.strawberry), loadSeq(C.splash), C.splashLoop ? loadSeq(C.splashLoop) : Promise.resolve([]), loadImg(shakeSrc)].concat(C.pieces.map(function (p) { return loadImg(p.src); })), document.fonts.load("150px Brush"))
    .then(function (r) { build(r[0], r[1].concat(r[2].filter(Boolean)), r[3], r.slice(4, 4 + C.pieces.length), r[1].length); });

  function build(sbFrames, syFrames, shakeImg, pieceImgs, splashLen) {
    var sbCtx = document.getElementById("strawberry").getContext("2d");
    var syCtx = document.getElementById("splash").getContext("2d");
    var state = { sb: 0, sy: 0 };

    // a frame sequence is drawn by index; frames are 1076x1924 – scaled to fill 1080x1920
    function drawSeq(ctx, frames, idx, cutoff, offsetY) {
      ctx.clearRect(0, 0, W, H);
      var f = frames[Math.max(0, Math.min(frames.length - 1, Math.round(idx)))];
      if (!f) return;
      ctx.drawImage(f, -2, -2 + (offsetY || 0), W + 4, H + 4);
      if (cutoff) {   // fade the long drips out above the title area's lower edge
        ctx.globalCompositeOperation = "destination-out";
        var g = ctx.createLinearGradient(0, cutoff - 120, 0, cutoff + 40);
        g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,1)");
        ctx.fillStyle = g; ctx.fillRect(0, cutoff - 120, W, H);
        ctx.globalCompositeOperation = "source-over";
      }
    }

    // milkshake photo: placed as-is (only positioned, sized and tilted)
    var M = C.milkshake, shake = document.getElementById("shake");
    shake.src = shakeImg.src;
    var sw = M.width, sh = Math.round(shakeImg.naturalHeight * sw / shakeImg.naturalWidth);
    Object.assign(shake.style, { width: sw + "px", height: sh + "px", left: (M.centreX - sw / 2) + "px", top: (M.bottom - sh) + "px", transformOrigin: "50% 85%" });

    // pieces
    var host = document.getElementById("pieces");
    var pieces = C.pieces.map(function (p, i) {
      var el = document.createElement("img"); el.className = "piece"; el.src = pieceImgs[i] ? pieceImgs[i].src : p.src;
      el.style.width = p.width + "px"; el.style.left = p.x + "px"; el.style.top = p.y + "px";
      if (p.blur) el.style.filter = "blur(" + p.blur + "px) drop-shadow(0 10px 10px rgba(0,70,60,.22))";
      if (p.flip) el.style.scale = "-1 1";
      host.appendChild(el); return el;
    });

    // title letters
    var title = document.getElementById("title"); title.style.top = C.title.top + "px";
    var chars = [];
    C.title.lines.forEach(function (t) {
      var line = document.createElement("span"); line.className = "line"; title.appendChild(line);
      Array.from(t).forEach(function (c) { var s = document.createElement("span"); s.className = "ch"; s.textContent = c; line.appendChild(s); chars.push(s); });
      var fs = C.title.size || 150; line.style.fontSize = fs + "px";
      function w() { var t = 0; line.querySelectorAll(".ch").forEach(function (c) { t += c.getBoundingClientRect().width; }); return t; }
      while (w() > 980 && fs > 60) { fs -= 4; line.style.fontSize = fs + "px"; }
    });

    var tl = gsap.timeline({ repeat: -1, paused: true, onUpdate: function () {
      drawSeq(sbCtx, sbFrames, state.sb, 0, C.strawberry.offsetY); drawSeq(syCtx, syFrames, state.sy, 0, C.splash.offsetY);
    } });

    // 1. strawberry falls (Higgsfield clip)
    tl.fromTo(state, { sb: 0 }, { sb: sbFrames.length - 1, duration: C.strawberry.end - C.strawberry.start, ease: "none" }, C.strawberry.start);
    // 2. milkshake rises in at an angle, overshoots, settles
    tl.fromTo(shake, { y: 1300, rotation: M.angle - 14, scale: 0.9 }, { y: -40, rotation: M.angle + 3, scale: 1.02, duration: 0.85, ease: "power3.out" }, M.enterAt);
    tl.to(shake, { y: 0, rotation: M.angle, scale: 1, duration: 0.6, ease: "sine.inOut" }, M.enterAt + 0.85);
    // 3. strawberry sauce sweeps in from the sides at the bottom (Higgsfield clip)
    tl.set(state, { sy: 0 }, 0);
    tl.fromTo(state, { sy: 0 }, { sy: splashLen - 1, duration: C.splash.end - C.splash.start, ease: "none" }, C.splash.start);
    if (syFrames.length > splashLen) {   // carry straight on into the continuation clip – the sauce never stops
      var L2 = C.splashLoop;
      tl.fromTo(state, { sy: splashLen }, { sy: syFrames.length - 1, duration: L2.end - L2.start, ease: "none", immediateRender: false }, L2.start);
    }
    // 4. cut strawberries slide in from the sides
    C.pieces.forEach(function (p, i) {
      var dx = p.from === "left" ? -500 : 500;
      tl.fromTo(pieces[i], { x: dx, rotation: p.rotate - 60 * Math.sign(dx), autoAlpha: 1 }, { x: 0, rotation: p.rotate, duration: 0.9, ease: "back.out(1.4)" }, p.at);
      var per = 1.5 + (i % 3) * 0.3, reps = Math.ceil((C.duration - p.at - 0.9) / per);
      tl.to(pieces[i], { y: (i % 2 ? -16 : 16), rotation: p.rotate + (i % 2 ? 6 : -6), duration: per, ease: "sine.inOut", yoyo: true, repeat: reps }, p.at + 0.9);
    });
    // 5. title letters pop on one by one, then a little shake
    tl.set(chars, { autoAlpha: 0 }, 0);
    chars.forEach(function (c, i) {
      var r = ((i * 37) % 30) - 15;
      tl.fromTo(c, { autoAlpha: 0, scale: 0, rotation: r * 2, y: -60 }, { autoAlpha: 1, scale: 1, rotation: r * 0.2, y: 0, duration: 0.4, ease: "back.out(3)" }, C.title.at + i * 0.045);
    });
    var tEnd = C.title.at + chars.length * 0.045 + 0.35;
    tl.to(title, { keyframes: { x: [12, -10, 7, -3, 0] }, duration: 0.4, ease: "none" }, tEnd);
    // 6. gentle float while it holds
    var fStart = M.enterAt + 1.45, fPer = 1.6;
    tl.to(shake, { y: -20, rotation: M.angle + 1.6, duration: fPer, ease: "sine.inOut", yoyo: true, repeat: Math.ceil((C.duration - fStart) / fPer) }, fStart);
    // strawberry keeps gently bobbing after it lands
    var sbCan = document.getElementById("strawberry");
    tl.to(sbCan, { y: -12, rotation: 0.8, transformOrigin: "50% 90%", duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: Math.ceil((C.duration - C.strawberry.end) / 1.4) }, C.strawberry.end);
    // title sways gently once it is on
    tl.to(title, { y: 8, rotation: -2.5, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: Math.ceil((C.duration - tEnd - 0.4) / 1.8) }, tEnd + 0.4);
    // slow continuous push-in on the whole scene, and a drifting light
    tl.fromTo("#world", { scale: 1 }, { scale: 1.05, duration: C.duration, ease: "none" }, 0);
    tl.fromTo("#glow", { x: -40 }, { x: 40, duration: C.duration, ease: "sine.inOut" }, 0);
    // 7. everything fades back to the plain background so the loop restarts cleanly
    tl.to([shake, title, host, "#strawberry", "#splash"], { autoAlpha: 0, duration: 0.45, ease: "power1.in" }, C.duration - 0.5);
    tl.set([shake, title, host, "#strawberry", "#splash"], { autoAlpha: 1 }, C.duration);
    tl.set(pieces, { x: -2000 }, C.duration);

    window.PROMO_TL = tl;
    if (params.has("t")) tl.pause(parseFloat(params.get("t")));
    else if (!params.has("capture")) tl.play(0);
    else tl.pause(0);
    document.body.setAttribute("data-ready", "1");
  }
})();
