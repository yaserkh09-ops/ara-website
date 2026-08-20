/* AraIntegrationMap — vanilla port of the handed-off React component
   (handoff-erpmap/AraIntegrationMap.tsx). Stripe-style integration diagram
   for the "Works with the ERP you already run" bento tile: dotted-grid
   canvas fading at the edges, animated dashed connectors, source chips
   flowing through CSV upload / Webhooks into a central ARA-logo node,
   ERP tile grid, live data line and sync engine. All motion is CSS-only —
   zero JS per frame; keyframes injected once (SSR-safe id kept from the
   handoff). Boots on [data-ara-erpmap]; the center-node logo is adopted
   from the host's own <img> so plain-HTML asset inlining keeps working. */
(function () {
  "use strict";

  var STYLE_ID = "ara-integration-map-keyframes";
  var KEYFRAMES =
    "@keyframes araImDash{to{stroke-dashoffset:-20;}}" +
    "@keyframes araImGlow{0%,100%{box-shadow:0 0 0 0 rgba(56,189,248,0.35),0 16px 40px rgba(3,10,32,0.4);}50%{box-shadow:0 0 0 14px rgba(56,189,248,0),0 16px 40px rgba(3,10,32,0.4);}}" +
    "@media (prefers-reduced-motion: reduce){.ara-im-anim{animation:none !important;}}";

  var THEMES = {
    dark: {
      canvas: "#0b1f4e", grid: "rgba(125,211,252,0.09)",
      title: "#ffffff", sub: "#93c5fd", stroke: "rgba(125,211,252,0.5)",
      chipSrc: { background: "rgba(37,99,235,0.28)", border: "1px solid rgba(96,165,250,0.55)", color: "#dbeafe", boxShadow: "none" },
      tile: { background: "#123a7a", border: "1px solid rgba(56,189,248,0.35)", color: "#cfe8ff", boxShadow: "none" },
      ghost: "rgba(125,211,252,0.35)", label: "#a8cbf5", miniBorder: "none",
      shadow: "0 12px 36px rgba(6,18,48,0.35)"
    },
    light: {
      canvas: "#f6faff", grid: "rgba(37,99,235,0.10)",
      title: "#0b1f4e", sub: "#2563eb", stroke: "rgba(37,99,235,0.4)",
      chipSrc: { background: "#ffffff", border: "1px solid #dbeafe", color: "#0b1f4e", boxShadow: "0 4px 12px rgba(15,42,77,0.08)" },
      tile: { background: "#ffffff", border: "1px solid #dbeafe", color: "#0b1f4e", boxShadow: "0 4px 12px rgba(15,42,77,0.06)" },
      ghost: "rgba(37,99,235,0.30)", label: "#64748b", miniBorder: "1px solid #e2e8f0",
      shadow: "0 12px 36px rgba(15,42,77,0.12)"
    }
  };

  /* language-mirrored copy: AR is the handoff original; EN mirrors it the
     same way the visit card does. Qoyod / Wafeq are قيود / وافق. */
  var COPY = {
    ar: {
      font: "'IBM Plex Sans Arabic', system-ui, -apple-system, sans-serif",
      headDir: "rtl",
      headline: "اتصل بنظامك القائم. ",
      subline: "زامن المخزون عبر عدة أنظمة، وابنِ تدفقاتك الخاصة، واتصل عبر CSV أو API أو تكاملات جاهزة.",
      srcChips: ["نقاط البيع", "المشتريات", "الفوترة"],
      csv: "رفع CSV", hooks: "Webhooks / API",
      market: "سوق التكاملات", live: "خط بيانات حي", sync: "محرك المزامنة",
      erp: ["SAP", "Odoo", "NetSuite", "Dynamics", "قيود", "وافق"],
      erpLabel: "أنظمة ERP الشائعة", dash: "لوحة المخزون"
    },
    en: {
      font: "Inter, system-ui, -apple-system, sans-serif",
      headDir: "ltr",
      headline: "Connect the system you already run. ",
      subline: "Sync inventory across systems, build your own flows, and connect via CSV, API, or ready-made integrations.",
      srcChips: ["POS", "Purchasing", "Billing"],
      csv: "CSV upload", hooks: "Webhooks / API",
      market: "Integration hub", live: "Live data feed", sync: "Sync engine",
      erp: ["SAP", "Odoo", "NetSuite", "Dynamics", "Qoyod", "Wafeq"],
      erpLabel: "Common ERP systems", dash: "Inventory dashboard"
    }
  };

  function injectKeyframes() {
    if (!document.getElementById(STYLE_ID)) {
      var el = document.createElement("style");
      el.id = STYLE_ID;
      el.textContent = KEYFRAMES;
      document.head.appendChild(el);
    }
  }

  function el(tag, styles, text) {
    var n = document.createElement(tag);
    if (styles) for (var k in styles) n.style[k] = styles[k];
    if (text != null) n.textContent = text;
    return n;
  }

  function build(host) {
    var lang = (document.documentElement.lang || "en").indexOf("ar") === 0 ? "ar" : "en";
    var c = COPY[lang];
    var t = THEMES[host.getAttribute("data-theme") === "light" ? "light" : "dark"];

    injectKeyframes();

    /* fixed 1240×720 design box, scaled to fit the host (README's scaler) */
    var box = el("div", {
      position: "absolute", top: "0", left: "0",
      width: "1240px", height: "720px",
      transformOrigin: "top left",
      direction: "ltr",
      background: t.canvas, fontFamily: c.font
    });
    box.dir = "ltr";

    var mask = "radial-gradient(ellipse 70% 65% at 50% 50%, #000 45%, transparent 100%)";
    var grid = el("div", {
      position: "absolute", inset: "0",
      backgroundImage: "linear-gradient(" + t.grid + " 1px, transparent 1px), linear-gradient(90deg, " + t.grid + " 1px, transparent 1px)",
      backgroundSize: "46px 46px",
      maskImage: mask, webkitMaskImage: mask
    });
    box.appendChild(grid);

    /* headline: top-right in AR (handoff original), mirrored top-left in EN */
    var head = el("div", {
      position: "absolute", top: "44px", width: "680px",
      fontSize: "25px", lineHeight: "1.65", fontWeight: "700", color: t.title
    });
    head.style[lang === "ar" ? "right" : "left"] = "48px";
    head.dir = c.headDir;
    head.appendChild(document.createTextNode(c.headline));
    head.appendChild(el("span", { color: t.sub, fontWeight: "500" }, c.subline));
    box.appendChild(head);

    /* animated dashed connectors */
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 1240 720");
    svg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;";
    var g = document.createElementNS(NS, "g");
    g.setAttribute("fill", "none");
    g.setAttribute("stroke", t.stroke);
    g.setAttribute("stroke-width", "1.5");
    g.setAttribute("stroke-dasharray", "3 7");
    g.setAttribute("class", "ara-im-anim");
    g.style.animation = "araImDash 1.1s linear infinite";
    ["M520 250 V295", "M925 250 V272 H835 V295", "M660 250 V330 H630 V360",
     "M525 337 V348 H590 V360", "M835 337 V348 H670 V360", "M356 407 H400",
     "M530 411 H560", "M700 405 H830", "M970 405 H1050", "M630 450 V540"
    ].forEach(function (d) {
      var p = document.createElementNS(NS, "path");
      p.setAttribute("d", d);
      g.appendChild(p);
    });
    svg.appendChild(g);
    box.appendChild(svg);

    function ghost(top, left, w, h, opacity) {
      return el("div", {
        position: "absolute", top: top + "px", left: left + "px",
        width: w + "px", height: h + "px", borderRadius: "9px",
        border: "1.5px dashed " + t.ghost, opacity: String(opacity == null ? 1 : opacity)
      });
    }
    function chipSrc(left, w, label) {
      var n = el("div", {
        position: "absolute", top: "210px", left: left + "px",
        width: w + "px", height: "40px", borderRadius: "9px",
        display: "grid", placeItems: "center", fontSize: "14px", fontWeight: "600",
        background: t.chipSrc.background, border: t.chipSrc.border,
        color: t.chipSrc.color, boxShadow: t.chipSrc.boxShadow
      }, label);
      return n;
    }
    function action(top, left, w, label) {
      return el("div", {
        position: "absolute", top: top + "px", left: left + "px",
        width: w + "px", height: "42px", borderRadius: "10px", background: "#2563eb",
        display: "grid", placeItems: "center", color: "#ffffff",
        fontSize: "14px", fontWeight: "600",
        boxShadow: "0 6px 18px rgba(37,99,235,0.45)"
      }, label);
    }

    box.appendChild(ghost(210, 330, 110, 40));
    box.appendChild(chipSrc(460, 120, c.srcChips[0]));
    box.appendChild(chipSrc(600, 120, c.srcChips[1]));
    box.appendChild(ghost(210, 740, 110, 40));
    box.appendChild(chipSrc(870, 110, c.srcChips[2]));
    box.appendChild(action(295, 470, 110, c.csv));
    box.appendChild(action(295, 760, 150, c.hooks));

    /* common-ERP tile grid */
    var erpWrap = el("div", {
      position: "absolute", top: "300px", left: "150px", width: "206px",
      display: "flex", flexDirection: "column", gap: "10px"
    });
    var erpGrid = el("div", {
      display: "grid", gridTemplateColumns: "repeat(3, 62px)", gap: "10px"
    });
    c.erp.forEach(function (n) {
      erpGrid.appendChild(el("div", {
        height: "62px", borderRadius: "12px", display: "grid", placeItems: "center",
        fontWeight: "700", background: t.tile.background, border: t.tile.border,
        color: t.tile.color, boxShadow: t.tile.boxShadow,
        fontSize: (n.length > 5 ? 11 : 12) + "px", textAlign: "center"
      }, n));
    });
    erpWrap.appendChild(erpGrid);
    erpWrap.appendChild(el("div", {
      textAlign: "center", color: t.label, fontSize: "12.5px", fontWeight: "500"
    }, c.erpLabel));
    box.appendChild(erpWrap);

    box.appendChild(action(390, 400, 130, c.market));

    /* central ARA node with glow pulse — adopts the host's shipped <img> */
    var center = el("div", {
      position: "absolute", top: "360px", left: "560px",
      width: "140px", height: "90px", borderRadius: "16px",
      background: "#ffffff", border: "1px solid rgba(125,211,252,0.6)",
      display: "grid", placeItems: "center"
    });
    center.className = "ara-im-anim";
    center.style.animation = "araImGlow 2.8s ease-in-out infinite";
    var logo = host.querySelector("img");
    if (logo) {
      logo.style.cssText = "display:block;width:62px;height:62px;object-fit:contain;";
      center.appendChild(logo);
    }
    box.appendChild(center);

    box.appendChild(action(384, 830, 140, c.live));

    /* mini inventory-dashboard bars */
    var mini = el("div", {
      position: "absolute", top: "370px", left: "1050px",
      width: "70px", height: "70px", borderRadius: "14px",
      background: "#ffffff", border: t.miniBorder,
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      gap: "5px", padding: "12px 0", boxSizing: "border-box",
      boxShadow: "0 8px 20px rgba(3,10,32,0.3)"
    });
    [["18px", "#93c5fd"], ["30px", "#3b82f6"], ["24px", "#1d4ed8"]].forEach(function (b) {
      mini.appendChild(el("span", {
        width: "9px", height: b[0], borderRadius: "3px", background: b[1]
      }));
    });
    box.appendChild(mini);
    box.appendChild(el("div", {
      position: "absolute", top: "446px", left: "1035px", width: "100px",
      textAlign: "center", color: t.label, fontSize: "12.5px", fontWeight: "500"
    }, c.dash));

    box.appendChild(action(540, 560, 140, c.sync));
    box.appendChild(ghost(600, 490, 90, 34, 0.6));
    box.appendChild(ghost(620, 640, 110, 34, 0.45));
    box.appendChild(ghost(648, 540, 70, 30, 0.3));

    host.textContent = "";
    host.appendChild(box);

    /* responsive scaler: fit + center the design box inside the host */
    function fit() {
      var w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      var s = Math.min(w / 1240, h / 720);
      box.style.transform =
        "translate(" + (w - 1240 * s) / 2 + "px," + (h - 720 * s) / 2 + "px) scale(" + s + ")";
    }
    fit();
    if ("ResizeObserver" in window) {
      new ResizeObserver(fit).observe(host);
    } else {
      addEventListener("resize", fit);
    }
  }

  function boot() {
    document.querySelectorAll("[data-ara-erpmap]").forEach(build);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
