/* =========================================================
   ARA Visit Card — vanilla port of the handed-off
   AraVisitCard.tsx (React removed; approved defaults:
   bgStyle aurora, glassStyle smoked, blur 6, tilt 15).
   Renders the moving background + glass card into any
   [data-ara-visitcard] element; the tile keeps its own
   title row and dialog. Idle 3D sway pauses on hover,
   cursor tilt is per-event JS only (no rAF loop), and
   prefers-reduced-motion disables all of it (CSS side in
   landing.css). No dependencies.
   ========================================================= */
(function () {
  "use strict";

  var TILT = 15;
  var SWAY = "araVcSway 7s ease-in-out infinite";

  function init(host) {
    var rtl = document.documentElement.getAttribute("dir") === "rtl";
    host.classList.add("ara-vc");

    var bg = document.createElement("div");
    bg.className = "ara-vc-bg";
    bg.innerHTML = '<i class="ara-vc-aur1"></i><i class="ara-vc-aur2"></i>';
    host.appendChild(bg);

    var stage = document.createElement("div");
    stage.className = "ara-vc-stage";
    var sway = document.createElement("div");
    sway.className = "ara-vc-sway";
    var card = document.createElement("div");
    card.className = "ara-vc-card";
    card.dir = rtl ? "rtl" : "ltr";

    var name = rtl ? "محمد الحربي" : "Mohammed Al-Harbi";
    var role = rtl ? "مجموعة قمم الطبية · مندوب طبي" : "Qimam Medical Group · Medical Rep";
    var subDir = rtl ? "ltr" : "rtl";
    var sub = rtl ? "Mohammed Alharbi · Medical Rep, Qimam Medical Group" : "محمد الحربي · مندوب طبي";
    var pillMain = rtl ? "موثّق عبر الشبكة" : "Network verified";
    var pillSecDir = rtl ? "ltr" : "rtl";
    var pillSec = rtl ? "Network verified" : "موثّق عبر الشبكة";

    var dots = "";
    for (var i = 0; i < 12; i++) dots += "<span></span>";

    card.innerHTML =
      '<i class="ara-vc-sheen"></i>' +
      '<div class="ara-vc-inner">' +
        '<div class="ara-vc-top">' +
          '<span class="ara-vc-brand">ARA <b lang="ar">أرى</b></span>' +
          '<span class="ara-vc-chip"></span>' +
        '</div>' +
        '<div class="ara-vc-id">' +
          '<div class="ara-vc-name">' + name + '</div>' +
          '<div class="ara-vc-role">' + role + '</div>' +
          '<div class="ara-vc-sub" dir="' + subDir + '">' + sub + '</div>' +
        '</div>' +
        '<div class="ara-vc-foot">' +
          '<span class="ara-vc-pill">' +
            '<span class="ara-vc-tick"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span>' +
            '<b>' + pillMain + '</b><i dir="' + pillSecDir + '">' + pillSec + '</i>' +
          '</span>' +
          '<span class="ara-vc-dots">' + dots + '</span>' +
        '</div>' +
      '</div>';

    sway.appendChild(card);
    stage.appendChild(sway);
    host.appendChild(stage);

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stage.addEventListener("pointermove", function (e) {
      if (reduced) return;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = "rotateX(" + (-py * TILT).toFixed(2) + "deg) rotateY(" + (px * TILT).toFixed(2) + "deg) scale(1.03)";
      card.style.boxShadow = "0 26px 60px rgba(6,18,48,0.45), inset 0 1px 0 rgba(255,255,255,0.45)";
      sway.style.animation = "none";
      sway.style.transform = "none";
    });
    stage.addEventListener("pointerleave", function () {
      card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
      card.style.boxShadow = "";
      if (!reduced) { sway.style.animation = SWAY; sway.style.transform = ""; }
    });
  }

  function boot() {
    document.querySelectorAll("[data-ara-visitcard]").forEach(init);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
