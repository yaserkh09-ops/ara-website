/* =========================================================
   ARA Network Globe — vanilla port of the handed-off
   AraNetworkGlobe.tsx (React removed, engine intact).
   Renders into any [data-ara-globe] element; the element
   must have a real size. Honors prefers-reduced-motion
   (single static frame), pauses off-screen and on hidden
   tabs, ~30fps cap, DPR capped at 2. No dependencies.
   ========================================================= */
(function () {
  "use strict";

  var HUB = [46.7, 24.7]; /* Riyadh */
  var RAD = Math.PI / 180;
  var MW = 360, MH = 180;

  var ROUTES_AR = [
    { sku: "Atorvastatin 20 mg", sub: "84 عبوة · أمل فارما", to: [31.2, 30.0] },
    { sku: "Amoxicillin 500 mg", sub: "120 عبوة · بيان الطبية", to: [55.3, 25.2] },
    { sku: "Metformin 850 mg", sub: "200 عبوة · ثريا لابز", to: [72.8, 19.1] },
    { sku: "Insulin Glargine", sub: "60 عبوة · قمم الطبية", to: [36.8, -1.3] }
  ];
  var ROUTES_EN = [
    { sku: "Atorvastatin 20 mg", sub: "84 packs · Amal Pharma", to: [31.2, 30.0] },
    { sku: "Amoxicillin 500 mg", sub: "120 packs · Bayan Medical", to: [55.3, 25.2] },
    { sku: "Metformin 850 mg", sub: "200 packs · Thurayya Labs", to: [72.8, 19.1] },
    { sku: "Insulin Glargine", sub: "60 packs · Qimam Medical", to: [36.8, -1.3] }
  ];

  function GlobeEngine(cv, cardEls, opts) {
    this.cv = cv;
    this.cardEls = cardEls;
    this.opts = opts;
    this.ctx = cv.getContext("2d");
    var bin = atob(LAND_B64);
    this.mask = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) this.mask[i] = bin.charCodeAt(i);
    this.buckets = [[], [], []];
    this.mode = "dash";
    this.raf = 0; this.last = 0; this.visible = true;
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.w = 0; this.h = 0; this.R = 0; this.cx = 0; this.cy = 0;
    this.buildDots();
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

  GlobeEngine.prototype.loop = function (ts) {
    this.raf = requestAnimationFrame(this.boundLoop);
    if (ts - this.last < 32) return; /* ~30fps cap */
    this.last = ts;
    this.draw(ts / 1000);
  };

  GlobeEngine.prototype.syncLoop = function () {
    var should = !this.reduced && this.opts.motion === "ambient" && this.visible && !document.hidden;
    if (should && !this.raf) this.raf = requestAnimationFrame(this.boundLoop);
    if (!should && this.raf) { cancelAnimationFrame(this.raf); this.raf = 0; }
  };

  GlobeEngine.prototype.bit = function (lon, lat) {
    var x = Math.floor(((lon + 180) % 360 + 360) % 360);
    var y = Math.min(MH - 1, Math.max(0, Math.floor(90 - lat)));
    var i = y * MW + x;
    return this.mask[i >> 3] & (128 >> (i & 7));
  };

  GlobeEngine.prototype.buildDots = function () {
    var density = this.opts.density;
    var mode = this.opts.surface;
    this.mode = mode;
    var buckets = [[], [], []];
    var s = 42 >>> 0;
    var rnd = function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    var bucketOf = function (lon, r) { var u = 0.5 + lon / 220 + (r - 0.5) * 0.25; return u < 0.4 ? 0 : u < 0.72 ? 1 : 2; };
    var vec = function (lon, lat) { var la = lat * RAD, lo = lon * RAD, cf = Math.cos(la); return [cf * Math.cos(lo), cf * Math.sin(lo), Math.sin(la)]; };
    var self = this;
    if (mode === "dash") {
      var step = 2.3 / density;
      for (var lat = -72; lat <= 85; lat += step) {
        var dl = 0.9 / Math.max(Math.cos(lat * RAD), 0.2);
        var run = null;
        var flush = function (endLon, latv) {
          if (run && endLon - run.start >= dl * 0.8) {
            var r = rnd();
            var a = vec(run.start, latv), b = vec(endLon, latv);
            buckets[bucketOf((run.start + endLon) / 2, r)].push(a[0], a[1], a[2], b[0], b[1], b[2], r * 6.28);
          }
          run = null;
        };
        for (var lon = -180; lon < 180; lon += dl) {
          if (self.bit(lon, lat)) {
            if (!run) run = { start: lon, max: 2 + Math.floor(rnd() * 3), n: 0 };
            if (++run.n >= run.max) { flush(lon + dl * 0.7, lat); lon += dl * 0.6; }
          } else flush(lon, lat);
        }
        flush(179.5, lat);
      }
    } else {
      var pixel = mode === "pixel";
      var step2 = (pixel ? 1.7 : 1.55) / density;
      for (var lat2 = -72; lat2 <= 85; lat2 += step2) {
        var dl2 = step2 / Math.max(Math.cos(lat2 * RAD), 0.2);
        for (var lon2 = -180; lon2 < 180; lon2 += dl2) {
          var r2 = rnd();
          var lo2 = lon2, la2 = lat2, size = 2.3, wt = 1;
          if (!pixel) {
            lo2 = lon2 + (rnd() - 0.5) * dl2 * 0.9; la2 = lat2 + (rnd() - 0.5) * step2 * 0.9;
            if (r2 < 0.1) continue;
            size = r2 < 0.16 ? 3.1 : r2 < 0.5 ? 2.2 : 1.3;
            wt = 0.75 + 0.25 * rnd();
          }
          if (!this.bit(lo2, la2)) continue;
          var v = vec(lo2, la2);
          buckets[bucketOf(lo2, r2)].push(v[0], v[1], v[2], r2 * 6.28, size, wt);
        }
      }
    }
    this.buckets = buckets;
  };

  GlobeEngine.prototype.layout = function () {
    var p = this.cv.parentElement;
    var w = p.clientWidth, h = p.clientHeight;
    if (!w || !h) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.cv.width = Math.round(w * dpr);
    this.cv.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = w; this.h = h;
    this.R = w * 0.72; this.cx = w / 2; this.cy = this.R + 28;
    this.draw(this.last / 1000 || 2.4);
  };

  GlobeEngine.prototype.draw = function (t) {
    var ctx = this.ctx;
    if (!ctx || !this.w) return;
    var l0 = (46.7 + 8 * Math.sin(t * 0.15)) * RAD, p0 = 8 * RAD; /* gentle sway */
    var sl = Math.sin(l0), cl = Math.cos(l0), sp = Math.sin(p0), cp = Math.cos(p0);
    var R = this.R, cx = this.cx, cy = this.cy, w = this.w, h = this.h;
    var xf = function (vx, vy, vz) {
      var x1 = vx * cl + vy * sl, y1 = -vx * sl + vy * cl;
      return [cx + R * y1, cy - R * (cp * vz - sp * x1), sp * vz + cp * x1];
    };
    var vecOf = function (lonlat) {
      var la = lonlat[1] * RAD, lo = lonlat[0] * RAD, cf = Math.cos(la);
      return [cf * Math.cos(lo), cf * Math.sin(lo), Math.sin(la)];
    };
    ctx.clearRect(0, 0, w, h);
    var fs = h * 0.66, fl = h * 0.30;
    var cols = ["rgb(30,80,200)", "rgb(37,99,235)", "rgb(56,189,248)"];
    if (this.mode === "dash") {
      ctx.lineCap = "round";
      ctx.lineWidth = 1.35;
      for (var b = 0; b < 3; b++) {
        var arr = this.buckets[b];
        ctx.strokeStyle = cols[b];
        for (var i = 0; i < arr.length; i += 7) {
          var xa = arr[i] * cl + arr[i + 1] * sl, ya = -arr[i] * sl + arr[i + 1] * cl;
          var Z1 = sp * arr[i + 2] + cp * xa;
          var xb = arr[i + 3] * cl + arr[i + 4] * sl, yb = -arr[i + 3] * sl + arr[i + 4] * cl;
          var Z2 = sp * arr[i + 5] + cp * xb;
          if (Z1 < 0.03 || Z2 < 0.03) continue;
          var sx1 = cx + R * ya, sy1 = cy - R * (cp * arr[i + 2] - sp * xa);
          var sx2 = cx + R * yb, sy2 = cy - R * (cp * arr[i + 5] - sp * xb);
          var sy = (sy1 + sy2) / 2;
          if (sy < -3 || sy > h + 3 || Math.max(sx1, sx2) < -3 || Math.min(sx1, sx2) > w + 3) continue;
          var f = sy > fs ? 1 - (sy - fs) / fl : 1;
          if (f < 0.03) continue;
          var Z = (Z1 + Z2) / 2;
          ctx.globalAlpha = (0.25 + 0.58 * Z) * f * (0.86 + 0.14 * Math.sin(t * 1.1 + arr[i + 6]));
          ctx.beginPath(); ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2); ctx.stroke();
        }
      }
    } else {
      for (var b2 = 0; b2 < 3; b2++) {
        var arr2 = this.buckets[b2];
        ctx.fillStyle = cols[b2];
        for (var j = 0; j < arr2.length; j += 6) {
          var vx = arr2[j], vy = arr2[j + 1], vz = arr2[j + 2];
          var x1 = vx * cl + vy * sl, y1 = -vx * sl + vy * cl;
          var Zb = sp * vz + cp * x1;
          if (Zb < 0.02) continue;
          var sx = cx + R * y1, syb = cy - R * (cp * vz - sp * x1);
          if (sx < -3 || sx > w + 3 || syb < -3 || syb > h + 3) continue;
          var fb = syb > fs ? 1 - (syb - fs) / fl : 1;
          if (fb < 0.03) continue;
          ctx.globalAlpha = (0.25 + 0.58 * Zb) * fb * arr2[j + 5] * (0.86 + 0.14 * Math.sin(t * 1.1 + arr2[j + 3]));
          var size = arr2[j + 4] * (0.55 + 0.45 * Zb);
          ctx.fillRect(sx - size / 2, syb - size / 2, size, size);
        }
      }
    }
    /* city markers */
    var routes = this.opts.routes;
    var hubV = vecOf(HUB);
    var nodeVs = [hubV];
    for (var n = 0; n < routes.length; n++) nodeVs.push(vecOf(routes[n].to));
    for (var m = 0; m < nodeVs.length; m++) {
      var pt = xf(nodeVs[m][0], nodeVs[m][1], nodeVs[m][2]);
      if (pt[2] <= 0.02) continue;
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = m === 0 ? "#2563eb" : "#38bdf8";
      ctx.beginPath(); ctx.arc(pt[0], pt[1], m === 0 ? 3 : 2.2, 0, 6.283); ctx.fill();
    }
    /* two active routes per 6.5s cycle; one card airborne at a time */
    var P = 6.5;
    var pair = Math.floor(t / P) % 2;
    var u = (t % P) / P;
    var arcCols = ["rgba(37,99,235,ALPHA)", "rgba(56,189,248,ALPHA)"];
    var els = this.cardEls();
    var slerpPt = function (va, vb, om, so, tt) {
      var ka = Math.sin((1 - tt) * om) / so, kb = Math.sin(tt * om) / so;
      var lift = 1 + 0.09 * Math.sin(Math.PI * tt);
      return xf((ka * va[0] + kb * vb[0]) * lift, (ka * va[1] + kb * vb[1]) * lift, (ka * va[2] + kb * vb[2]) * lift);
    };
    for (var r3 = 0; r3 < routes.length; r3++) {
      var el = els[r3];
      var activeIdx = pair === 0 ? [0, 2] : [1, 3];
      var k = activeIdx.indexOf(r3);
      if (k < 0) { if (el) el.style.opacity = "0"; continue; }
      var va = hubV, vb = vecOf(routes[r3].to);
      var dot = va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2];
      var om = Math.acos(Math.min(1, dot)), so = Math.sin(om);
      var aIn = Math.min(1, u / 0.14), aOut = u > 0.84 ? Math.max(0, 1 - (u - 0.84) / 0.14) : 1;
      var alpha = Math.min(aIn, aOut) * 0.75;
      var grow = Math.min(1, u / 0.18);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = arcCols[k].replace("ALPHA", String(alpha));
      ctx.lineWidth = 1.2; ctx.lineCap = "round";
      ctx.beginPath();
      var started = false;
      var N = 40;
      for (var q = 0; q <= Math.floor(N * grow); q++) {
        var pq = slerpPt(va, vb, om, so, q / N);
        if (pq[2] <= 0) { started = false; continue; }
        if (!started) { ctx.moveTo(pq[0], pq[1]); started = true; } else ctx.lineTo(pq[0], pq[1]);
      }
      ctx.stroke();
      if (u > 0.8) { /* arrival burst */
        var bp = Math.min(1, (u - 0.8) / 0.16);
        var dpt = xf(vb[0], vb[1], vb[2]);
        if (dpt[2] > 0) {
          ctx.globalAlpha = (1 - bp) * 0.5;
          ctx.strokeStyle = "#2563eb"; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.arc(dpt[0], dpt[1], 4 + 15 * bp, 0, 6.283); ctx.stroke();
        }
      }
      if (el) {
        if (!this.opts.showCards) { el.style.opacity = "0"; continue; }
        var t0 = 0.12 + k * 0.42, t1 = 0.46 + k * 0.42; /* disjoint windows */
        var pp = (u - t0) / (t1 - t0);
        if (pp <= 0 || pp >= 1) { el.style.opacity = "0"; continue; }
        pp = 0.5 - 0.5 * Math.cos(Math.PI * pp);
        var cpt = slerpPt(va, vb, om, so, pp);
        if (cpt[2] <= 0) { el.style.opacity = "0"; continue; }
        var fadeIn = Math.min(1, (u - t0) / 0.05), fadeOut = Math.min(1, (t1 - u) / 0.05);
        el.style.opacity = String(Math.max(0, Math.min(fadeIn, fadeOut)) * Math.min(1, aOut));
        el.style.transform = "translate(" + cpt[0].toFixed(1) + "px," + cpt[1].toFixed(1) + "px) translate(-50%,-130%)";
      }
    }
    ctx.globalAlpha = 1;
  };

  function init(host) {
    var rtl = document.documentElement.getAttribute("dir") === "rtl";
    var routes = rtl ? ROUTES_AR : ROUTES_EN;
    host.classList.add("ara-globe");
    var bg = document.createElement("div");
    bg.className = "ara-globe-bg";
    host.appendChild(bg);
    var cv = document.createElement("canvas");
    cv.className = "ara-globe-canvas";
    host.appendChild(cv);
    var cards = routes.map(function (r) {
      var c = document.createElement("div");
      c.className = "ara-globe-card";
      var l1 = document.createElement("div");
      l1.className = "ara-globe-sku"; l1.dir = "ltr"; l1.textContent = r.sku;
      var l2 = document.createElement("div");
      l2.className = "ara-globe-sub"; l2.dir = rtl ? "rtl" : "ltr"; l2.textContent = r.sub;
      c.appendChild(l1); c.appendChild(l2);
      host.appendChild(c);
      return c;
    });
    new GlobeEngine(cv, function () { return cards; }, {
      surface: "dash", density: 1.5, motion: "ambient", showCards: true, routes: routes
    });
  }

  function boot() {
    document.querySelectorAll("[data-ara-globe]").forEach(init);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  /* Natural Earth 110m land, rasterized to a 360x180 bitmask (public domain). */
  var LAND_B64 = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8AAf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB////H//////3+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////x////////wAAAAA/wAABwAAAAAAP4AAAAAAAAAAAAAAAAAAAAAAAAAAA/7/8A///////+AAAAB//wAAAAAAAAAAH8AAAAAAAAAAAAAAAAAAAAAAAAIHzP//x////////+AAAAB/iAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAcYABAP+Af///////+AAAAAPGAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAD9DAd+f+Af///////8AAAAAAAAAAAAADwAAAAH/+AAAAAAAAAAAAAAAAAAAAAH/wc3/8AAAf/////8AAAAAAAAAAAAH8AAAA////AAAB/EAAAAAAAAAAAAAAGAYAAR/4AAAP/////8AAAAAAAAAAAAOAAAAP///wAAAAAAAAAAAAAAAAAAAAP8AIc+M/gAAD/////4AAAAAAAAAAAA4AAAP/////+HwAOAAAAAAAAAAAAAAA//+4+4/7wAAB/////gAAAAAAAAAAADwAHgH///////4Af4AAAAAwAAAAAAAAff/4O4//9AAB/////wAAAAAAAAAAADwAPf////////8///wAAAAAAAf/wAACAP//B8f//8AB////+wAAAAAAB/AAAAAAfv/////////////8AAAAAB////H//H//n+D4f+AB3////AAAAAAA//8AAAAefv///////////////v+wAP///////+x4Dfz4f+AAf///wAAAAAAD///4MDP/3n/////////////////+AH/////////////4Z/wA///4AAAAAAAP///+M////v//////////////////8F/////////////gD/8A///gAAIAAAAf///+/////f/////////////////f4f////////////+AH+4Af/4AA/8AAAA/8f+D///////////////////////BwPf///////////zw//gAP/wAAf4AAAD/4/+f//////////////////////+ACA////////////HYA/gAP/gAADAAAAH/z/////////////////////////+AAH///////////8AyyPAAD/AAAAAAAA//H//////////////////////////AAP///////////4AA/gAAB/AAAAAAAB//H//////////////////////3P+AAAH//3////////wAA/4AAAOAAAAAAAB//n//////////////////////A/4AAAA/zAH///////gAA/4wAAAAAAAAAAB//gf///////////////////++DwAAAAALwAA///////4AA//4AAAAAAAAAQA5+A///////////////////4AAHgAAAAADcAAD//////8AAf/8AAAAAAAAA8AA+C///////////////////wAA/gAAAAAMAAAB///////wAf/+AAAAAAAAA8AO8H///////////////////AAA/gAAAABgAAAA///////+A///gAAAAAAAAcANwH//////////////////+AAB/AAAAAAAAAAAf///////x///4AAAAAAAHPAGD///////////////////+AAA+AAAAAAAAAABP///////x///8AAAAAAAPPA//////////////////////6AA8AAAAAAAAAAAH///////5///8AAAAAAAPfj//////////////////////+AA4AAAAAAAAAAAD///////9///8AAAAAAAAfn//////////////////////6AAwAAAAAAAAAAAD///////////sAAAAAAAA8f//////////////////////7AAAAAAAAAAAAAAB/////////+EOAAAAAAAAB///////////////////////7AAAAAAAAAAAAAAAX////////7wfgAAAAAAAf///////////////////////yAAAAAAAAAAAAAAAP/////////gfgAAAAAAAP///////////////////////iAAAAAAAAAAAAAAAP/////////xAAAAAAAAAD//////P/x//////////////iAAAAAAAAAAAAAAAP//////////AAAAAAAAAB/////Hf/D//////////////AAAAAAAAAAAAAAAAP////////8wAAAAAAAAAB//n/+Af+H/////////////8HAAAAAAAAAAAAAAAf////////wAAAAAAAAAH//jz/+AH/H/////////////4HwAAAAAAAAAAAAAAP////////gAAAAAAAAAH/4N4/8AB/D////////////+APAAAAAAAAAAAAAAAP////////wAAAAAAAAAH/4A+f+Ph/g////////////8AIAAAAAAAAAAAAAAAP///////8AAAAAAAAAAH/gMPfP///x///////////v4AMAAAAAAAAAAAAAAAP///////8AAAAAAAAAAP/AMCOP///x///////////ZwAMAAAAAAAAAAAAAAAP///////4AAAAAAAAAAH/AACHP///g//////////8B4AcAAAAAAAAAAAAAAAH///////4AAAAAAAAAAH+AAYHH///w//////////+w4A4AAAAAAAAAAAAAAAD///////wAAAAAAAAAAAgf8ACD///////////////g8D4AAAAAAAAAAAAAAAB///////wAAAAAAAAAAA7/+AAwE//////////////A8f4AAAAAAAAAAAAAAAB///////gAAAAAAAAAAB//+AAAA//////////////AB+AAAAAAAAAAAAAAAAAP/////+AAAAAAAAAAAD//+AAAB//////////////gD8AAAAAAAAAAAAAAAAAH/////8AAAAAAAAAAAP///4OAB//////////////gDAAAAAAAAAAAAAAAAAAH/////4AAAAAAAAAAAP///8P8z//////////////wDAAAAAAAAAAAAAAAAAACf////4AAAAAAAAAAAP/////////////////////wAAAAAAAAAAAAAAAAAAADf//3g4AAAAAAAAAAAP/////////P///////////wAAAAAAAAAAAAAAAAAAAAv//AAYAAAAAAAAAAA//////////H///////////wAAAAAAAAAAAAAAAAAAAB3/+AAcAAAAAAAAAAD///////9//j///////////gAAAAAAAAAAAAAAAAAAAAz/+AAMgAAAAAAAAAD///////8//wn//////////AAAAAAAAAAAAAAAAAAAAAJ/+AAMAAAAAAAAAAH///////+f/8b//////////AAAAAAAAAAAAAAAAAAAAAM/+AAAAAAAAAAAAAH///////+f/84Af///////+wAAAAAAAAAAAAAAAAAAAAEf8AAAAAAAAAAAAAP////////P//+AP///////4wAAAAAAAAAAAAAAAAAAAAAP8AAvAAAAAAAAAAf////////n///AH///////ggAAAAAAAAAAAAAAAAAAAAAH+AYDwAAAAAAAAAf////////n///AD//4P//cAAAAAAAAAAAAAAAAAAAAAAAP+B4A8AAAAAAAAAf////////j//8AAf/4P/+IAAAAAAAAAAAAAAAgAAAAAAAH/B4AB4AAAAAAAAP////////h//8AAf/gH/8YAAAAAAAAAAAAAAAAAAAAAAAD/3wAx5AAAAAAAAP////////x//4AAf/AD/8QAQAAAAAAAAAAAAAAAAAAAAAA//wAAAAAAAAAAAP////////4//wAAf+AD/+AAwAAAAAAAAAAAAAAAAAAAAAAP/wAAAAAAAAAAAf////////4f+AAAf8AD//AA4AAAAAAAAAAAAAAAAAAAAAAAP/gAAAAAAAAAAf////////8f8AAAPwAAP/gAwAAAAAAAAAAAAAAAAAAAAAAAD/gAAAAAAAAAAf////////+fwAAAPwAAP/gAwAAAAAAAAAAAAAAAAAAAAAAAA/gAAAAAAAAAAf/////////eAAAAHwAAP/gAcAAAAAAAAAAAAAAAAAAAAAAAAPgAAAAAAAAAAf/////////wAAAAHwAAN/gAQAAAAAAAAAAAAAAAAAAAAAAAADABYAAAAAAAAP/////////gYAAAHwAAEfgAJAAAAAAAAAAAAAAAAAAAAAAAADgP/aAAAAAAAH//////////4AAADwAAMfABEAAAAAAAAAAAAAAAAAAAAAAAABxPf+AAAAAAAD//////////4AAADoAAMGAAEAAAAAAAAAAAAAAAAAAAAAAAAAd///gAAAAAAB//////////4AAABIAAMAAAHAAAAAAAAAAAAAAAAAAAAAAAAAE///gAAAAAAB//////////wAAAAMAAGAAALgAAAAAAAAAAAAAAAAAAAAAAAAAf//4AAAAAAA//////////wAAAAMAADAAMDAAAAAAAAAAAAAAAAAAAAAAAAAA////gAAAAAAP/B///////gAAAAAAAjgAeAAAAAAAAAAAAAAAAAAAAAAAAAAA////4AAAAAAGAA///////AAAAAAAAxgA+AAAAAAAAAAAAAAAAAAAAAAAAAAA////4AAAAAAAAAH/////+AAAAAAAAdgB8AAAAAAAAAAAAAAAAAAAAAAAAAAB////4AAAAAAAAAH/////8AAAAAAAANwH8AAAAAAAAAAAAAAAAAAAAAAAAAAB////8AAAAAAAAAH/////4AAAAAAAAHwf+AYAAAAAAAAAAAAAAAAAAAAAAAAD////8AAAAAAAAAH/////wAAAAAAAAHwf8+YAAAAAAAAAAAAAAAAAAAAAAAAH////+AAAAAAAAAH/////gAAAAAAAADwf9AAwAAAAAAAAAAAAAAAAAAAAAAAH/////4AAAAAAAAH/////AAAAAAAAAB4P54BwAAAAAAAAAAAAAAAAAAAAAAAH//////AAAAAAAAD////+AAAAAAAAAB8P5wAz4AQAAAAAAAAAAAAAAAAAAAAH//////8AAAAAAAD////8AAAAAAAAAA8BxYMf/AAAAAAAAAAAAAAAAAAAAAAH//////+AAAAAAAB////8AAAAAAAAAAcABoAH/wYAAAAAAAAAAAAAAAAAAAAH///////gAAAAAAA////4AAAAAAAAAAMAAIAA/5wAAAAAAAAAAAAAAAAAAAAH///////gAAAAAAA////4AAAAAAAAAADkAAAA/8BAAAAAAAAAAAAAAAAAAAAD///////gAAAAAAAf///8AAAAAAAAAAD/AAAA/8AAAAAAAAAAAAAAAAAAAAAB///////gAAAAAAAf///4AAAAAAAAAAABmggAvMAEAAAAAAAAAAAAAAAAAAAB///////gAAAAAAAf///8AAAAAAAAAAAABiAAAHACAAAAAAAAAAAAAAAAAAAA///////AAAAAAAAf///8AAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAAAAA//////+AAAAAAAAP///+AAAAAAAAAAAAAAAwCAAAAAAAAAAAAAAAAAAAAAAAf/////8AAAAAAAAf///+AQAAAAAAAAAAAAB+CAAAAAAAAAAAAAAAAAAAAAAAf/////4AAAAAAAA////+AwAAAAAAAAAAAAD8HAAAAAAAAAAAAAAAAAAAAAAAP/////4AAAAAAAA////+BwAAAAAAAAAAAB/8DgAAAAAAAAAAAAAAAAAAAAAAH/////4AAAAAAAA////+D4AAAAAAAAAAAD/+HgAAAAAAAAAAAAAAAAAAAAAAD/////4AAAAAAAA////8PwAAAAAAAAAAAD//HwAAAABAAAAAAAAAAAAAAAAAA/////4AAAAAAAA////wPwAAAAAAAAAAAP///wAAAACAAAAAAAAAAAAAAAAAAf////4AAAAAAAA////gPwAAAAAAAAAAAP///wAAAAAAAAAAAAAAAAAAAAAAAP////wAAAAAAAAf//+APgAAAAAAAAAAAf///8AAAAAAAAAAAAAAAAAAAAAAAP////wAAAAAAAAf//+APgAAAAAAAAAAD////+AAIAAAAAAAAAAAAAAAAAAAAP////gAAAAAAAAP//+AfAAAAAAAAAAAf////+AAGAAAAAAAAAAAAAAAAAAAAP////gAAAAAAAAP///AfAAAAAAAAAAA//////gAAAAAAAAAAAAAAAAAAAAAAf///4AAAAAAAAAP///APAAAAAAAAAAB//////gAAAAAAAAAAAAAAAAAAAAAAf///gAAAAAAAAAH//+APAAAAAAAAAAA//////wAAAAAAAAAAAAAAAAAAAAAAf///AAAAAAAAAAH//4AEAAAAAAAAAAA//////4AAAAAAAAAAAAAAAAAAAAAAf///AAAAAAAAAAH//4AAAAAAAAAAAAA//////4AAAAAAAAAAAAAAAAAAAAAAf///AAAAAAAAAAH//4AAAAAAAAAAAAA//////4AAAAAAAAAAAAAAAAAAAAAA///+AAAAAAAAAAD//4AAAAAAAAAAAAA//////8AAAAAAAAAAAAAAAAAAAAAA///+AAAAAAAAAAB//wAAAAAAAAAAAAAf/////8AAAAAAAAAAAAAAAAAAAAAA///8AAAAAAAAAAB//gAAAAAAAAAAAAAf/////4AAAAAAAAAAAAAAAAAAAAAA///4AAAAAAAAAAA//AAAAAAAAAAAAAAP/////4AAAAAAAAAAAAAAAAAAAAAA///wAAAAAAAAAAA/+AAAAAAAAAAAAAAP/Af//4AAAAAAAAAAAAAAAAAAAAAA///gAAAAAAAAAAA/4AAAAAAAAAAAAAAf8AH//wAAAAAAAAAAAAAAAAAAAAAA///AAAAAAAAAAAA4AAAAAAAAAAAAAAAeAAF//gAAAAAAAAAAAAAAAAAAAAAB//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/gAABAAAAAAAAAAAAAAAAAAB//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AAAAgAAAAAAAAAAAAAAAAAD//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AAAAYAAAAAAAAAAAAAAAAAB//gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADYAAAA+AAAAAAAAAAAAAAAAAD/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAD/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAD/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAADAAAAAAAAAAAAAAAAAAD/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAHAAAAAAAAAAAAAAAAAAB/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAOAAAAAAAAAAAAAAAAAAH/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8AAAAAAAAAAAAAAAAAAH+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAH+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAH/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+AAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4BwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAB4AAAAAAAAAAAAAAAAAAH8AAAAGAB8HwGz+AAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAA//iAAD//////////wAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAACA////8Af///////////gAAAAAAAAAAAAAAAAAAAAAA/4AAAAAAAAAAAAAAAP/////8B/////////////4AAAAAAAAAAAAAAAAAAAAA/8AAAAAAAAAAB+/////////wf//////////////AAAAAAAAAAAAAAAAAAAAH/+AAAAAAAAf////////////5////////////////4AAAAAAAAAAAAAA+AAABj+AAAAAAAB//////////////////////////////4AAAAAAAAAADAAB///3h/+AAAAAAAP//////////////////////////////wAAAAAAAAf///8Af/////8AAAAAAAP/////////////////////////////8AAAAAAAD/////////////gAAAAAAB//////////////////////////////wAAAAAAAH////////////wAAAAAAP///////////////////////////////wAAAAAD/////////////8AAAAAAD////////////////////////////////wAAAABz/////////////AAAAD8A/////////////////////////////////8AAAAAwA////////////gAAAH+A4///////////////////////////////+AAAAAAAAH////////////AbA/4AA///////////////////////////////+AAAAAAAP//////////////wAAA//////////////////////////////////AAAAAAAH///////////////h////////////////////////////////////4AAAAAAH/////////////////////////////////////////////////////wA//wAAf//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////";
})();
