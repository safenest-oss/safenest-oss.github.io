// Scroll simulator and yearly-time calculator. No network requests, no storage, no tracking.
(function () {
  "use strict";
  var cards = [
    ["Nie uwierzysz, co stało się dalej…", "#1d4ed8", "#ffffff"],
    ["Zrób to w 10 sekund", "#fde68a", "#1f2937"],
    ["Czekaj do samego końca", "#0f766e", "#ffffff"],
    ["Ten trik zna każdy. Ale nie Ty.", "#fecdd3", "#1f2937"],
    ["Spróbuj się nie uśmiechnąć", "#4c1d95", "#ffffff"],
    ["Numer 3 Cię zaskoczy", "#bbf7d0", "#14532d"]
  ];
  var $ = function (id) { return document.getElementById(id); };

  var screen = $("sim-screen");
  if (screen) {
    var n = 1;
    var text = $("sim-text"), count = $("sim-count"), time = $("sim-time"), nudge = $("sim-nudge"), nudgeTime = $("sim-nudge-time");
    var render = function () {
      var c = cards[(n - 1) % cards.length];
      var secs = n * 30;
      var t = Math.floor(secs / 60) + ":" + String(secs % 60).padStart(2, "0");
      text.textContent = c[0];
      screen.style.background = c[1];
      screen.style.color = c[2];
      count.textContent = n;
      time.textContent = t;
      nudgeTime.textContent = t;
      nudge.hidden = n < 8;
    };
    $("sim-next").addEventListener("click", function () { n += 1; render(); });
    $("sim-reset").addEventListener("click", function () { n = 1; render(); });
    render();
  }

  var range = $("mins");
  if (range) {
    var out = function () {
      var m = Number(range.value);
      $("mins-val").textContent = m;
      $("calc-hours").textContent = Math.round(m * 365 / 60);
      $("calc-days").textContent = (m * 365 / 60 / 24).toFixed(1).replace(".", ",");
    };
    range.addEventListener("input", out);
    out();
  }
})();
