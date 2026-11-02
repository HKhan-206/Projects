/* PREVIEW ONLY – adds the header, geometric pattern and floor strip before the menu is drawn. */
(function () {
  var stage = document.getElementById("stage");
  var n = String(window.SCREEN || 1);
  function el(tag, cls, parent, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; parent.appendChild(e); return e; }

  // embossed line pattern built from the logo's triangle shape
  var ns = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(ns, "svg"); svg.setAttribute("class", "geo"); svg.setAttribute("viewBox", "0 0 600 200"); svg.setAttribute("preserveAspectRatio", "xMaxYMin slice");
  var g = '<g fill="none" stroke-linecap="square">';
  for (var r = 0; r < 2; r++) for (var c = 0; c < 5; c++) {
    var x = c * 150 - 75 + (r % 2 ? 75 : 0), y = r * 130 - 30, up = (r + c) % 2 === 0;
    var pts = up ? [[x, y + 130], [x + 75, y], [x + 150, y + 130]] : [[x, y], [x + 75, y + 130], [x + 150, y]];
    var d = "M" + pts.map(function (p) { return p.join(","); }).join("L") + "Z";
    g += '<path d="' + d + '" stroke="#ffffff" stroke-width="7" transform="translate(-2,-2)"/>';
    g += '<path d="' + d + '" stroke="#ded5ca" stroke-width="5"/>';
    var inset = up ? "M" + (x + 40) + "," + (y + 105) + "L" + (x + 110) + "," + (y + 105) : "M" + (x + 40) + "," + (y + 25) + "L" + (x + 110) + "," + (y + 25);
    g += '<path d="' + inset + '" stroke="#ded5ca" stroke-width="5"/>';
  }
  svg.innerHTML = g + "</g>";
  stage.appendChild(svg);

  // logo only on screen 1, centred; other screens get no header at all
  if (n === "1") {
    var h = el("div", "hdr", stage);
    el("div", "brand", h, '<img src="../promo-v2/images/logo-triangle-dark.png" alt=""><div class="n">THE NILE</div><div class="o">ORIGINAL</div><div class="u"></div>');
  } else {
    document.documentElement.classList.add("no-head");
  }

  var f = el("div", "foot", stage);
  var terr = el("div", "terr", f);
  // terrazzo chips
  var chips = "";
  var seed = 7; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  for (var i = 0; i < 160; i++) {
    var col = ["#c4602b", "#2a2420", "#9d9389", "#ffffff"][Math.floor(rnd() * 4)];
    chips += '<span style="position:absolute;left:' + (rnd() * 1080).toFixed(0) + 'px;top:' + (rnd() * 28).toFixed(0) + 'px;width:' + (3 + rnd() * 9).toFixed(0) + 'px;height:' + (3 + rnd() * 6).toFixed(0) + 'px;border-radius:40%;background:' + col + ';transform:rotate(' + (rnd() * 180).toFixed(0) + 'deg)"></span>';
  }
  terr.innerHTML = chips;
  el("div", "wood", f);
  [70, 250, 520, 800, 980].forEach(function (x, i) { var b = el("div", "bar", f); b.style.left = x + "px"; b.style.height = (i % 2 ? 84 : 60) + "px"; });
})();
