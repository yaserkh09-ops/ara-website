/* =========================================================
   ARA — motion system (August 2026)
   GSAP + ScrollTrigger enhancement layer, shared by EN and AR.
   Declarative only: no DOM rebuilding. Falls back to the classic
   IntersectionObserver reveal when GSAP is absent or motion is reduced.
   ========================================================= */
(function () {
  "use strict";

  var docEl = document.documentElement;
  var rtl = docEl.getAttribute("dir") === "rtl";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    (navigator.connection && navigator.connection.saveData);
  var lite = window.matchMedia("(max-width: 820px), (pointer: coarse)").matches ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

  /* mirror horizontal offsets for RTL */
  function dx(v) { return rtl ? -v : v; }

  /* ---- classic fallback: same behavior the site shipped with ---- */
  function classicReveal() {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal:not(.in)").forEach(function (el) { io.observe(el); });
  }

  /* ---- ambient-loop governor: pause CSS keyframe loops off-screen ---- */
  function governAmbient() {
    var targets = document.querySelectorAll(
      ".section.bg-navy-dark, .ara-net-wrap, .focal-alerts, .viz-time, .api-snippet"
    );
    if (!targets.length || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        e.target.classList.toggle("amb-paused", !e.isIntersecting);
      });
    }, { rootMargin: "160px" });
    targets.forEach(function (t) { io.observe(t); });
  }

  governAmbient();

  if (reduce || !window.gsap || !window.ScrollTrigger) {
    classicReveal();
    docEl.setAttribute("data-motion", reduce ? "reduced" : "css");
    return;
  }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  var hasSplit = !!window.SplitText;
  var hasDraw = !!window.DrawSVGPlugin;
  var hasScramble = !!window.ScrambleTextPlugin;
  if (hasSplit) gsap.registerPlugin(window.SplitText);
  if (hasDraw) gsap.registerPlugin(window.DrawSVGPlugin);
  if (hasScramble) gsap.registerPlugin(window.ScrambleTextPlugin);

  /* From here on GSAP owns entrances; neutralize the CSS reveal system
     (rule lives in landing.css under html[data-motion="gsap"]) */
  docEl.setAttribute("data-motion", "gsap");

  var EASE_OUT = "power3.out";
  var EASE_HERO = "power4.out";

  /* =====================================================
     1 · Scroll progress bar
     ===================================================== */
  (function progressBar() {
    var bar = document.createElement("div");
    bar.className = "motion-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    gsap.set(bar, { scaleX: 0, transformOrigin: rtl ? "right center" : "left center" });
    gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.25 }
    });
  })();

  /* =====================================================
     2 · Headline reveals (SplitText, masked lines)
     Arabic-safe: lines only — never characters, so the
     joined script's ligatures are preserved.
     ===================================================== */
  function headlineReveal(el, opts) {
    opts = opts || {};
    if (!hasSplit) {
      gsap.from(el, {
        autoAlpha: 0, y: 26, duration: 0.8, ease: EASE_OUT,
        clearProps: "transform,opacity,visibility",
        scrollTrigger: opts.noTrigger ? null : { trigger: el, start: "top 84%", once: true },
        delay: opts.delay || 0
      });
      return;
    }
    var split;
    try {
      split = new window.SplitText(el, { type: "lines", mask: "lines", linesClass: "mline" });
    } catch (err) {
      gsap.from(el, { autoAlpha: 0, y: 26, duration: 0.8, ease: EASE_OUT, clearProps: "all" });
      return;
    }
    var tween = gsap.from(split.lines, {
      yPercent: 110,
      autoAlpha: 0,
      duration: 0.85,
      stagger: 0.09,
      ease: EASE_HERO,
      delay: opts.delay || 0,
      scrollTrigger: opts.noTrigger ? null : { trigger: el, start: "top 84%", once: true },
      onComplete: function () { split.revert(); }
    });
    return tween;
  }

  /* =====================================================
     3 · Hero choreography
     ===================================================== */
  (function hero() {
    var heroEl = document.querySelector(".hero");
    if (!heroEl) return;
    var nav = document.getElementById("nav");
    var copyCol = heroEl.querySelector(".hero-inner > div:first-child");
    var shotCol = heroEl.querySelector(".hero-inner > div:nth-child(2)");

    if (nav) {
      gsap.from(nav, {
        yPercent: -110, autoAlpha: 0, duration: 0.7, ease: EASE_HERO,
        clearProps: "transform,opacity,visibility"
      });
    }

    if (copyCol) {
      var h1 = copyCol.querySelector("h1");
      var rest = Array.prototype.filter.call(copyCol.children, function (c) { return c !== h1; });
      if (h1) headlineReveal(h1, { noTrigger: true, delay: 0.15 });
      gsap.from(rest, {
        autoAlpha: 0,
        y: 34,
        filter: lite ? "none" : "blur(8px)",
        duration: 0.8,
        stagger: 0.12,
        delay: 0.3,
        ease: EASE_HERO,
        clearProps: "transform,opacity,visibility,filter"
      });
    }

    if (shotCol) {
      gsap.from(shotCol, {
        autoAlpha: 0, y: 44, scale: 0.975, duration: 1.05, delay: 0.4,
        ease: EASE_HERO, clearProps: "transform,opacity,visibility"
      });
      if (!lite) {
        /* parallax on the column wrapper — the .hero-browser child keeps
           its own mouse-tilt transform untouched */
        gsap.to(shotCol, {
          yPercent: 7,
          ease: "none",
          scrollTrigger: { trigger: heroEl, start: "top top", end: "bottom top", scrub: 1 }
        });
      }
    }
  })();

  /* statement headline — the only masked-line reveal outside the hero;
     section h2s stay static by design ruling (Aug round 1 feedback) */
  headlineReveal(document.querySelector(".statement-head"));

  /* =====================================================
     4 · Unified scroll reveals (upgrades the old .reveal IO)
     Grid containers stagger their children; everything else
     rises as one block. `in` is still added for the CSS that
     keys off it (viz bars, ECG draw).
     ===================================================== */
  (function reveals() {
    var GROUPS = [".solve-bento", ".platform-grid", ".intel-grid", ".who-grid",
      ".steps", ".bento-integration", ".pillars", ".faq-wrap"];

    document.querySelectorAll(".reveal:not(.in)").forEach(function (el) {
      var isGroup = GROUPS.some(function (s) { return el.matches(s); });
      var isStatband = el.matches(".statband");
      var targets = isGroup ? Array.prototype.slice.call(el.children) : el;
      el.classList.add("in"); /* neutralized visually; keeps dependent CSS alive */

      if (isStatband) return; /* handled below */

      gsap.from(targets, {
        autoAlpha: 0,
        y: 36,
        duration: 0.72,
        stagger: isGroup ? 0.09 : 0,
        ease: EASE_OUT,
        clearProps: "transform,opacity,visibility",
        scrollTrigger: { trigger: el, start: "top 82%", once: true }
      });
    });
  })();

  /* =====================================================
     5 · Stat band — odometer-style roll-in
     ===================================================== */
  (function statband() {
    var band = document.querySelector(".statband");
    if (!band) return;
    var nums = band.querySelectorAll(".stat-num");
    var labels = band.querySelectorAll(".stat-label");
    gsap.from(nums, {
      yPercent: 70, autoAlpha: 0, duration: 0.7, stagger: 0.1,
      ease: "back.out(1.6)", clearProps: "transform,opacity,visibility",
      scrollTrigger: { trigger: band, start: "top 84%", once: true }
    });
    gsap.from(labels, {
      autoAlpha: 0, y: 18, duration: 0.6, stagger: 0.1, delay: 0.15,
      ease: EASE_OUT, clearProps: "transform,opacity,visibility",
      scrollTrigger: { trigger: band, start: "top 84%", once: true }
    });
  })();

  /* =====================================================
     6 · Cinematic frame reveals for the app screenshots
     #platform — flagship: clip wipe + settle + DrawSVG curve
     #who — light variant: wipe + settle
     ===================================================== */
  function frameReveal(frame, img, opts) {
    if (!frame || !img) return;
    opts = opts || {};
    var radius = opts.radius || "12px";
    gsap.set(frame, { clipPath: "inset(100% 0% 0% 0% round " + radius + ")" });
    gsap.set(img, { scale: 1.08, transformOrigin: "center top" });

    var tl = gsap.timeline({
      scrollTrigger: { trigger: frame, start: "top 78%", once: true },
      onComplete: function () { gsap.set([frame, img], { clearProps: "all" }); }
    });
    tl.to(frame, { clipPath: "inset(0% 0% 0% 0% round " + radius + ")", duration: 1.3, ease: "power3.inOut" }, 0)
      .to(img, { scale: 1, duration: 1.6, ease: "power2.out" }, 0);

    if (opts.sweep && hasDraw) {
      var wrap = frame.closest(".card") || frame.parentElement;
      var svgNS = "http://www.w3.org/2000/svg";
      var holder = document.createElement("div");
      holder.className = "frame-sweep";
      holder.setAttribute("aria-hidden", "true");
      holder.innerHTML =
        '<svg viewBox="0 0 1200 700" preserveAspectRatio="none" focusable="false">' +
        '<defs><linearGradient id="araSweepGrad" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="#28CDFC" stop-opacity="0"/>' +
        '<stop offset="0.3" stop-color="#28CDFC" stop-opacity="0.9"/>' +
        '<stop offset="0.65" stop-color="#0673FF" stop-opacity="0.95"/>' +
        '<stop offset="1" stop-color="#0673FF" stop-opacity="0"/>' +
        "</linearGradient></defs>" +
        '<path class="fs-glow" d="M-80 520 C220 260 480 240 640 380 C800 520 1000 420 1280 150" />' +
        '<path class="fs-line" d="M-80 520 C220 260 480 240 640 380 C800 520 1000 420 1280 150" />' +
        "</svg>";
      if (rtl) holder.style.transform = "scaleX(-1)";
      wrap.style.position = "relative";
      wrap.appendChild(holder);
      var line = holder.querySelector(".fs-line");
      var glow = holder.querySelector(".fs-glow");
      gsap.set([line, glow], { drawSVG: "0% 0%" });
      tl.to([line, glow], { drawSVG: "0% 100%", duration: 1.05, ease: "power2.inOut" }, 0.1)
        .to(holder, { autoAlpha: 0, duration: 0.35, ease: "power1.out",
          onComplete: function () { holder.remove(); } }, 1.15);
    }
    return tl;
  }

  (function frames() {
    /* #platform screenshot stays static by design ruling (Aug round 1 feedback) */
    var whoShot = document.querySelector(".who-grid .who-shot");
    var whoImg = whoShot && whoShot.querySelector(".who-img");
    frameReveal(whoShot, whoImg, { radius: "12px" });
  })();

  /* =====================================================
     7 · SKU mapping rows — ScrambleText resolve
     Raw ERP codes visibly resolve into the canonical name:
     the product story acted out. LTR data islands only.
     ===================================================== */
  (function scrambleMap() {
    if (!hasScramble) return;
    var rows = document.querySelectorAll(".mapwrap .maprow .std");
    if (!rows.length) return;
    rows.forEach(function (el, i) {
      var finalText = el.textContent;
      gsap.to(el, {
        duration: 1.1,
        delay: i * 0.22,
        scrambleText: { text: finalText, chars: "upperCase", speed: 0.35 },
        ease: "none",
        scrollTrigger: { trigger: el.closest(".mapwrap"), start: "top 84%", once: true }
      });
    });
  })();

  /* =====================================================
     8 · ara-net entrance — DrawSVG draw-in, then the CSS
     loops (sweep, comets, halos) take over untouched.
     ===================================================== */
  (function araNet() {
    if (!hasDraw) return;
    var net = document.querySelector(".ara-net");
    if (!net) return;
    var svg = net.querySelector("svg");
    if (!svg) return;
    var rings = svg.querySelectorAll("circle");
    var baseLines = svg.querySelectorAll("g:not(.ara-flow) line");
    var flow = svg.querySelector(".ara-flow");
    var nodes = net.querySelectorAll(".ara-node");
    var core = net.querySelector(".ara-core");
    var ambient = net.querySelectorAll(".ara-sweep, .ara-ring, .ara-comet, .ara-breathe");

    gsap.set(rings, { drawSVG: "0%" });
    gsap.set(baseLines, { drawSVG: "0% 0%" });
    if (flow) gsap.set(flow, { autoAlpha: 0 });
    gsap.set(nodes, { scale: 0, autoAlpha: 0, transformOrigin: "center center" });
    if (core) gsap.set(core, { scale: 0, autoAlpha: 0 });
    gsap.set(ambient, { autoAlpha: 0 });

    var tl = gsap.timeline({
      scrollTrigger: { trigger: net.closest(".step-visual") || net, start: "top 82%", once: true },
      onComplete: function () {
        gsap.set([rings, baseLines, flow, nodes, core, ambient], { clearProps: "all" });
      }
    });
    tl.to(core, { scale: 1, autoAlpha: 1, duration: 0.55, ease: "back.out(1.7)" }, 0)
      .to(rings, { drawSVG: "100%", duration: 0.9, stagger: 0.12, ease: "power2.inOut" }, 0.1)
      .to(baseLines, { drawSVG: "0% 100%", duration: 0.6, stagger: 0.08, ease: "power2.out" }, 0.35)
      .to(nodes, { scale: 1, autoAlpha: 1, duration: 0.5, stagger: 0.08, ease: "back.out(2)" }, 0.6)
      .to(ambient, { autoAlpha: 1, duration: 0.6, ease: "power1.out" }, 1.15)
      .to(flow, { autoAlpha: 0.7, duration: 0.6, ease: "power1.out" }, 1.15);
  })();

  /* =====================================================
     8b · Nav sliding underline indicator
     One shared line glides between links (replaces the
     per-link underline in GSAP mode — see landing.css).
     ===================================================== */
  (function navIndicator() {
    var links = document.querySelector(".nav-links");
    if (!links) return;
    var items = links.querySelectorAll("a");
    if (!items.length) return;
    var bar = document.createElement("span");
    bar.className = "nav-indicator";
    bar.setAttribute("aria-hidden", "true");
    links.appendChild(bar);

    function show(link) {
      gsap.to(bar, {
        x: link.offsetLeft, width: link.offsetWidth,
        autoAlpha: 1, duration: 0.35, ease: "power3.out", overwrite: true
      });
    }
    function hide() {
      gsap.to(bar, { autoAlpha: 0, duration: 0.25, ease: "power2.out", overwrite: true });
    }
    items.forEach(function (a) {
      a.addEventListener("mouseenter", function () { show(a); });
      a.addEventListener("focus", function () { show(a); });
    });
    links.addEventListener("mouseleave", hide);
    links.addEventListener("focusout", function (e) {
      if (!links.contains(e.relatedTarget)) hide();
    });
  })();

  /* =====================================================
     9 · Access-toggle micro-feedback (step 1)
     Knob + colors stay CSS; GSAP adds a tactile pulse.
     ===================================================== */
  (function toggles() {
    document.querySelectorAll(".perm-item .toggle").forEach(function (t) {
      t.addEventListener("click", function () {
        var row = t.closest(".perm-item");
        gsap.fromTo(row, { scale: 1 }, {
          scale: 1.02, duration: 0.11, ease: "power2.out",
          yoyo: true, repeat: 1, overwrite: true,
          onComplete: function () { gsap.set(row, { clearProps: "transform" }); }
        });
      });
    });
  })();
})();
