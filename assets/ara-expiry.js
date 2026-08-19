/* =========================================================
   ARA Expiry Grid — vanilla port of the handed-off
   AraExpiryGrid.tsx (React removed, engine intact).
   Renders into any [data-ara-expiry] element; the element
   must have a real size. Honors prefers-reduced-motion
   (single static frame), pauses off-screen and on hidden
   tabs, ~30fps cap, DPR capped at 2. No dependencies.
   ========================================================= */
(function () {
  "use strict";

  var ALERTS_AR = [
    { sku: "Amoxicillin 500 mg", sub: "ينتهي خلال 45 يومًا · دفعة B-2231" },
    { sku: "Insulin Glargine", sub: "ينتهي خلال 30 يومًا · دفعة G-118" },
    { sku: "Vitamin D3 5000 IU", sub: "ينتهي خلال 60 يومًا · دفعة D-905" }
  ];
  var ALERTS_EN = [
    { sku: "Amoxicillin 500 mg", sub: "Expires in 45 days · Batch B-2231" },
    { sku: "Insulin Glargine", sub: "Expires in 30 days · Batch G-118" },
    { sku: "Vitamin D3 5000 IU", sub: "Expires in 60 days · Batch D-905" }
  ];

  var COLS = 7, ROWS = 7, GAP = 10;
  var TARGETS = [[2, 1], [4, 3], [1, 5]];

  function ExpiryEngine(cv, chipEls, opts) {
    this.cv = cv;
    this.chipEls = chipEls;
    this.opts = opts;
    this.ctx = cv.getContext("2d");
    this.cells = [];
    this.raf = 0; this.last = 0; this.visible = true;
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.w = 0; this.h = 0; this.cell = 0; this.gx = 0; this.gy = 0;
    this.buildCells();
    var self = this;
    this.ro = new ResizeObserver(function () { self.layout(); });
    this.ro.observe(cv.parentElement);
    this.io = new IntersectionObserver(function (es) { self.visible = es[0].isIntersecting; self.syncLoop(); });
    this.io.observe(cv);
    this.onVis = function () { self.syncLoop(); };
    document.addEventListener("visibilitychange", this.onVis);
    this.boundLoop = function (ts) { self.loop(ts); };
    this.layout();
    this.syncLoop();
  }

  ExpiryEngine.prototype.loop = function (ts) {
    this.raf = requestAnimationFrame(this.boundLoop);
    if (ts - this.last < 32) return; /* ~30fps cap */
    this.last = ts;
    this.draw(ts / 1000);
  };

  ExpiryEngine.prototype.syncLoop = function () {
    var should = !this.reduced && this.opts.motion === "ambient" && this.visible && !document.hidden;
    if (should && !this.raf) this.raf = requestAnimationFrame(this.boundLoop);
    if (!should && this.raf) { cancelAnimationFrame(this.raf); this.raf = 0; }
  };

  ExpiryEngine.prototype.buildCells = function () {
    var s = 7 >>> 0;
    var rnd = function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    for (var row = 0; row < ROWS; row++) {
      for (var col = 0; col < COLS; col++) {
        var r = rnd();
        var color, alpha;
        if (r < 0.72) { color = [37, 99, 235]; alpha = 0.08 + rnd() * 0.12; }
        else if (r < 0.88) { color = [34, 197, 94]; alpha = 0.14 + rnd() * 0.08; }
        else { color = [245, 158, 11]; alpha = 0.16 + rnd() * 0.08; }
        this.cells.push({ col: col, row: row, color: color, alpha: alpha, phase: rnd() * 6.28 });
      }
    }
  };

  ExpiryEngine.prototype.layout = function () {
    var p = this.cv.parentElement;
    var w = p.clientWidth, h = p.clientHeight;
    if (!w || !h) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.cv.width = Math.round(w * dpr);
    this.cv.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = w; this.h = h;
    this.cell = Math.floor((w - 56 - (COLS - 1) * GAP) / COLS);
    var gw = COLS * this.cell + (COLS - 1) * GAP;
    var gh = ROWS * this.cell + (ROWS - 1) * GAP;
    this.gx = (w - gw) / 2;
    this.gy = Math.max(34, (h - gh) / 2 + 6);
    this.draw(this.last / 1000 || 3.85);
  };

  ExpiryEngine.prototype.cellRect = function (col, row) {
    var s = this.cell + GAP;
    return [this.gx + col * s, this.gy + row * s, this.cell, this.cell];
  };

  ExpiryEngine.prototype.rrect = function (x, y, w, h, r) {
    var ctx = this.ctx;
    if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
    else { ctx.beginPath(); ctx.rect(x, y, w, h); }
  };

  ExpiryEngine.prototype.draw = function (t) {
    var ctx = this.ctx;
    if (!ctx || !this.w) return;
    ctx.clearRect(0, 0, this.w, this.h);
    var P = this.opts.pace;
    var cyc = Math.floor(t / P) % 3;
    var u = (t % P) / P;
    var tc = TARGETS[cyc][0], tr = TARGETS[cyc][1];
    var hf = u < 0.35 ? u / 0.35 : u < 0.8 ? 1 : 1 - (u - 0.8) / 0.2;
    hf = Math.max(0, Math.min(1, hf));
    for (var ci = 0; ci < this.cells.length; ci++) {
      var c = this.cells[ci];
      var rect = this.cellRect(c.col, c.row);
      var x0 = rect[0], y0 = rect[1], cw = rect[2], ch = rect[3];
      var shimmer = 0.9 + 0.1 * Math.sin(t * 1.2 + c.phase);
      ctx.fillStyle = "rgba(" + c.color[0] + "," + c.color[1] + "," + c.color[2] + "," + (c.alpha * shimmer).toFixed(3) + ")";
      var isT = c.col === tc && c.row === tr;
      var grow = isT ? 1 + 0.05 * hf * Math.sin(t * 5) : 1;
      var gx2 = x0 - (cw * (grow - 1)) / 2, gy2 = y0 - (ch * (grow - 1)) / 2;
      this.rrect(gx2, gy2, cw * grow, ch * grow, 5);
      ctx.fill();
      if (isT && hf > 0) {
        var amber = Math.min(hf * 2, 1) * (1 - Math.max(0, (hf - 0.5) * 2)) * 0.7;
        var red = Math.max(0, (hf - 0.5) * 2) * 0.85;
        if (amber > 0.01) { ctx.fillStyle = "rgba(245,158,11," + amber.toFixed(3) + ")"; this.rrect(gx2, gy2, cw * grow, ch * grow, 5); ctx.fill(); }
        if (red > 0.01) { ctx.fillStyle = "rgba(239,68,68," + red.toFixed(3) + ")"; this.rrect(gx2, gy2, cw * grow, ch * grow, 5); ctx.fill(); }
      }
    }
    var trect = this.cellRect(tc, tr);
    var x = trect[0], y = trect[1], cwT = trect[2];
    var ch2 = this.cell;
    if (u > 0.3 && u < 0.52) {
      var pr = (u - 0.3) / 0.22;
      ctx.strokeStyle = "rgba(239,68,68," + ((1 - pr) * 0.6).toFixed(3) + ")";
      ctx.lineWidth = 1.6;
      var e = 3 + 9 * pr;
      this.rrect(x - e, y - e, cwT + 2 * e, ch2 + 2 * e, 7);
      ctx.stroke();
    }
    var vis = Math.max(0, Math.min(Math.min(1, (u - 0.38) / 0.08), Math.min(1, (0.88 - u) / 0.08)));
    var els = this.chipEls();
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (!el) continue;
      if (i !== cyc || !this.opts.showAlerts || vis <= 0) { el.style.opacity = "0"; continue; }
      var cx = Math.max(96, Math.min(this.w - 96, x + cwT / 2));
      el.style.opacity = String(vis);
      el.style.transform = "translate(" + cx.toFixed(1) + "px," + (y - 12).toFixed(1) + "px) translate(-50%,-100%)";
    }
    if (this.opts.showAlerts && vis > 0) {
      ctx.strokeStyle = "rgba(239,68,68," + (vis * 0.6).toFixed(3) + ")";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + cwT / 2, y - 2);
      ctx.lineTo(x + cwT / 2, y - 12);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  function init(host) {
    var rtl = document.documentElement.getAttribute("dir") === "rtl";
    var alerts = rtl ? ALERTS_AR : ALERTS_EN;
    host.classList.add("ara-expiry");
    host.dir = rtl ? "rtl" : "ltr";
    var cv = document.createElement("canvas");
    cv.className = "ara-expiry-canvas";
    host.appendChild(cv);
    var chips = alerts.map(function (a) {
      var chip = document.createElement("div");
      chip.className = "ara-expiry-chip";
      var l1 = document.createElement("div");
      l1.className = "ara-expiry-chip-top";
      var dot = document.createElement("span");
      dot.className = "ara-expiry-dot";
      var sku = document.createElement("span");
      sku.className = "ara-expiry-sku"; sku.dir = "ltr"; sku.textContent = a.sku;
      l1.appendChild(dot); l1.appendChild(sku);
      var l2 = document.createElement("div");
      l2.className = "ara-expiry-sub"; l2.textContent = a.sub;
      chip.appendChild(l1); chip.appendChild(l2);
      host.appendChild(chip);
      return chip;
    });
    new ExpiryEngine(cv, function () { return chips; }, { motion: "ambient", pace: 7, showAlerts: true });
  }

  function boot() {
    document.querySelectorAll("[data-ara-expiry]").forEach(init);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
