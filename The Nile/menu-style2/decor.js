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
    el("div", "brand", h, '<img src="../promo-v2/images/logo-triangle-dark.png" alt=""><div class="n">THE NILE</div><div class="o">ORIGIN<img class="fl" src="../promo-v2/images/flame-small.png" alt="A">L</div><div class="u"></div>');
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
  // once the menu has been drawn: tag the allergy panel and apply any fixed text size
  function finish() {
    document.querySelectorAll(".panel").forEach(function (p) {
      var t = p.querySelector(".title");
      if (t && /allergy/i.test(t.textContent)) p.classList.add("allergy-note");
    });
    var fixed = window.PREVIEW_FS && window.PREVIEW_FS[n];
    if (fixed) document.getElementById("board").style.setProperty("--fs", fixed + "px");
    tweaks();
  }

  // ---- small spacing tweaks (preview only) ----
  function panelByTitle(t) {
    return Array.prototype.find.call(document.querySelectorAll(".panel"), function (p) {
      var h = p.querySelector(".title"); return h && h.textContent.trim().toLowerCase() === t;
    });
  }
  function rowCells(first) {        // the cells that make up the grid row starting at "first"
    var cells = [first], top = first.offsetTop, el = first.nextElementSibling;
    while (el && el.offsetTop === top && !el.classList.contains("name") && !el.classList.contains("blank")) { cells.push(el); el = el.nextElementSibling; }
    return cells;
  }
  function gapAbove(cells, px) { cells.forEach(function (c) { c.style.marginTop = px + "px"; }); }   // margin keeps the orange header boxes their normal size
  function nameCell(panel, text) {
    return Array.prototype.find.call(panel.querySelectorAll(".name"), function (c) { return c.firstChild && c.firstChild.nodeValue === text; });
  }
  function tweaks() {
    var fs = parseFloat(getComputedStyle(document.getElementById("board")).getPropertyValue("--fs")) || 22;
    var sides = panelByTitle("side orders");
    if (sides) {                     // small gap between the Reg/Lrg items and the Only/Meal items
      var cp = nameCell(sides, "Chilli Pepper Cheese Nuggets");
      if (cp) gapAbove(rowCells(cp), Math.round(fs * 0.9));
    }
    var keb = panelByTitle("kebabs");
    if (keb) {                       // one row of space between Mix Kebab and the second Reg/Lrg/Meal row
      var heads = keb.querySelectorAll(".items > .blank");
      var mid = heads[heads.length - 1];
      if (mid) gapAbove(rowCells(mid), Math.round(fs * 1.35));
    }
    var bur = panelByTitle("burgers");
    if (keb && bur) {                // move Burgers down so Double/Triple lines up with Reg/Lrg in Kebabs
      var kh = keb.querySelector(".head"), bh = bur.querySelector(".head");
      var kTop = keb.querySelectorAll(".items > .blank")[1] || kh;   // the Reg/Lrg row (below Naan/Pitta)
      var diff = kTop.getBoundingClientRect().top - bh.getBoundingClientRect().top;
      if (diff > 0) bur.querySelector(".items").style.marginTop = diff + "px";
    }
  }
  new MutationObserver(function (m, obs) {
    if (document.body.getAttribute("data-ready") === "1") { obs.disconnect(); finish(); }
  }).observe(document.body, { attributes: true, attributeFilter: ["data-ready"] });
})();
