/* The Nile – draws a menu screen from menu-data.js. You should not need to edit this file. */
(function () {
  var params = new URLSearchParams(location.search);
  var screenNo = String(window.SCREEN || params.get("screen") || "1");
  var rotate = parseInt(params.get("rotate") || "0", 10); // 90 or 270 if the TV is turned on its side but the PC outputs landscape
  var menu = window.MENU;
  var stage = document.getElementById("stage");
  var board = document.getElementById("board");

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function priceCell(v) {
    var c = el("div", "price");
    if (v && typeof v === "object") {
      c.appendChild(el("span", "lbl", v.l));
      c.appendChild(el("span", "val", v.p));
    } else if (v) {
      c.appendChild(el("span", "val", v));
      if (v.charAt(0) === "+") c.classList.add("plus");
    }
    return c;
  }

  function buildSection(key) {
    var s = menu.sections[key];
    if (!s) { console.warn("Unknown section:", key); return el("div"); }

    var panel = el("div", "panel");
    panel.appendChild(el("div", "title", s.title));

    // number of price columns
    var n = s.head ? s.head.length : (s.cols || 0);
    if (!n && s.items) {
      s.items.forEach(function (it) { if (Array.isArray(it)) n = Math.max(n, it.length - 1); });
    }
    n = Math.max(n, 1);

    var wrap;
    if (s.columns) { // section shown as side-by-side lists
      wrap = el("div", "split-items");
      s.columns.forEach(function (part) {
        var m = part.head ? part.head.length : 0;
        part.items.forEach(function (it) { if (Array.isArray(it)) m = Math.max(m, it.length - 1); });
        wrap.appendChild(buildGrid({ head: part.head, group: part.group }, part.items, Math.max(m, 1)));
      });
    } else if (s.split > 1) { // same list spread over several columns
      wrap = el("div", "split-items");
      wrap.style.gridTemplateColumns = "repeat(" + s.split + ", 1fr)";
      var at = 0;
      for (var q = 0; q < s.split; q++) { // spread items as evenly as possible, e.g. 10 -> 4, 3, 3
        var size = Math.ceil((s.items.length - at) / (s.split - q));
        wrap.appendChild(buildGrid(s, s.items.slice(at, at + size), n));
        at += size;
      }
    } else {
      wrap = el("div", "single-items");
      wrap.appendChild(buildGrid(s, s.items, n));
    }
    panel.appendChild(wrap);
    if (s.extras || s.info) {
      var ex = el("div", "extras");
      (s.extras || []).forEach(function (x) {
        var tag = el("div", "tag");
        tag.appendChild(el("span", "tag-l", x[0]));
        tag.appendChild(el("span", "tag-p", x[1]));
        ex.appendChild(tag);
      });
      (s.info || []).forEach(function (t, i) { ex.appendChild(el("div", i ? "info small" : "info", t)); });
      panel.appendChild(ex);
    }
    return panel;
  }

  function buildGrid(s, items, n) {
    var grid = el("div", "items");
    grid.style.gridTemplateColumns = "minmax(0, 1fr) repeat(" + n + ", auto)";
    var rows = [];

    function headRow(labels) {
      var r = [el("div", "blank")];
      var offset = n - labels.length;
      for (var i = 0; i < n; i++) r.push(el("div", "head", i >= offset ? labels[i - offset] : ""));
      rows.push(r);
    }

    if (s.group) {
      var g = [el("div", "blank")];
      s.group.forEach(function (gr) {
        var c = el("div", "group");
        c.style.gridColumn = "span " + gr[1];
        if (gr[0]) c.appendChild(el("span", null, gr[0]));
        g.push(c);
      });
      rows.push(g);
    }
    if (s.head) headRow(s.head);

    items.forEach(function (it) {
      if (!Array.isArray(it)) {
        if (it.head) headRow(it.head);
        if (it.list) { // group: one price, names listed underneath
          var gr = [el("div", "name cont", it.name)];
          for (var g2 = 1; g2 < n; g2++) gr.push(priceCell(""));
          gr.push(priceCell(it.price));
          gr.forEach(function (c) { c.classList.add("cont"); });
          rows.push(gr);
          var li = el("div", "list", it.list.map(function (d) { return d.replace(/ /g, "\u00A0"); }).join("  ·  "));
          li.style.gridColumn = "1 / -1";
          rows.push([li]);
        }
        return;
      }
      var prices = it.slice(1);
      var start = 0;
      do { // more prices than columns: continue on the next line
        var chunk = prices.slice(start, start + n);
        var r = [el("div", "name", start === 0 ? it[0] : "")];
        var desc = start === 0 && s.toppings && s.toppings[it[0]];
        if (desc) { r[0].classList.add("has-desc"); r[0].appendChild(el("span", "desc", desc)); }
        for (var i = chunk.length; i < n; i++) r.push(priceCell("")); // short rows sit on the right
        chunk.forEach(function (v) { r.push(priceCell(v)); });
        if (start > 0) rows[rows.length - 1].forEach(function (c) { c.classList.add("cont"); });
        rows.push(r);
        start += n;
      } while (start < prices.length);
    });

    rows.forEach(function (r, idx) {
      r.forEach(function (c) {
        if (idx === rows.length - 1) c.classList.add("last");
        grid.appendChild(c);
      });
    });
    return grid;
  }

  function build() {
    var layout = menu.screens[screenNo] || [];
    layout.forEach(function (b) {
      if (typeof b === "string") {
        var blk = el("div", "block");
        blk.appendChild(buildSection(b));
        board.appendChild(blk);
      } else {
        var sp = el("div", "split");
        if (b.widths) sp.style.gridTemplateColumns = b.widths;
        [b.left || [], b.right || []].forEach(function (list) {
          var col = el("div", "col");
          list.forEach(function (k) { col.appendChild(buildSection(k)); });
          sp.appendChild(col);
        });
        board.appendChild(sp);
      }
    });
  }

  // Pick the largest text size that fits on the screen without overflow,
  // allowing at most 2 long item names to wrap onto a second line
  function fit() {
    var names = board.querySelectorAll(".name");
    var panels = board.querySelectorAll(".panel");
    function fits(px, noWrap) {
      board.style.setProperty("--fs", px + "px");
      if (board.scrollHeight > board.clientHeight + 1) return false;
      for (var i = 0; i < panels.length; i++) {
        if (panels[i].scrollWidth > panels[i].clientWidth + 1) return false;
      }
      if (noWrap) {
        var count = 0;
        for (var j = 0; j < names.length; j++) {
          var n = names[j];
          if (n.textContent && n.getClientRects().length && wrapped(n, px)) count++;
        }
        if (count > 2) return false;
      }
      return true;
    }
    function wrapped(n, px) {
      var r = document.createRange();
      r.selectNodeContents(n);
      var lines = {}, rects = r.getClientRects(), count = 0;
      for (var i = 0; i < rects.length; i++) {
        var key = Math.round(rects[i].top);
        if (!lines[key]) { lines[key] = 1; count++; }
      }
      return count > 1;
    }
    function search(noWrap) {
      var lo = 14, hi = 44;
      for (var k = 0; k < 14; k++) {
        var mid = (lo + hi) / 2;
        if (fits(mid, noWrap)) lo = mid; else hi = mid;
      }
      return Math.floor(lo * 4) / 4;
    }
    var best = search(true);
    if (best < 21) best = search(false); // too small: allow some names to wrap instead
    fits(best, false);
  }

  // Scale the 1080x1920 stage to the real screen
  function scale() {
    var w = window.innerWidth, h = window.innerHeight;
    var turned = rotate === 90 || rotate === 270;
    var sw = turned ? 1920 : 1080, sh = turned ? 1080 : 1920;
    var k = Math.min(w / sw, h / sh);
    stage.style.transform = "translate(-50%, -50%) rotate(" + (rotate || 0) + "deg) scale(" + k + ")";
  }

  build();
  var mark = el("img", "mark");
  mark.src = "assets/triangle.png";
  mark.alt = "";
  stage.appendChild(mark);
  scale();
  window.addEventListener("resize", scale);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () {
    fit();
    document.body.setAttribute("data-ready", "1");
  });

  // Once an hour, reload so edits to menu-data.js show up without touching the TV.
  // Only reload if the menu can be reached, so a dropped internet connection
  // never replaces the menu with an error page – it just tries again later.
  function refresh() {
    if (location.protocol === "file:") { location.reload(); return; }
    fetch("menu-data.js?check=" + Date.now(), { cache: "no-store" })
      .then(function (r) { if (r.ok) location.reload(); else setTimeout(refresh, 5 * 60 * 1000); })
      .catch(function () { setTimeout(refresh, 5 * 60 * 1000); });
  }
  setTimeout(refresh, 60 * 60 * 1000);
})();
