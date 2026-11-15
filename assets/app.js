// Scroll simulator and yearly-time calculator. No network requests, no storage, no tracking.
(function () {
  "use strict";
  var en = document.documentElement.lang === "en";
  var texts = en
    ? ["You won't believe what happened next…", "Do it in 10 seconds", "Wait until the very end", "Everyone knows this trick. Except you.", "Try not to smile", "Number 3 will surprise you"]
    : ["Nie uwierzysz, co stało się dalej…", "Zrób to w 10 sekund", "Czekaj do samego końca", "Ten trik zna każdy. Ale nie Ty.", "Spróbuj się nie uśmiechnąć", "Numer 3 Cię zaskoczy"];
  var colors = [["#1d4ed8", "#ffffff"], ["#fde68a", "#1f2937"], ["#0f766e", "#ffffff"], ["#fecdd3", "#1f2937"], ["#4c1d95", "#ffffff"], ["#bbf7d0", "#14532d"]];
  var cards = texts.map(function (x, i) { return [x, colors[i][0], colors[i][1]]; });
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
      var d = (m * 365 / 60 / 24).toFixed(1);
      $("calc-days").textContent = en ? d : d.replace(".", ",");
    };
    range.addEventListener("input", out);
    out();
  }
})();
