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

  // Local ChatGPT parental-controls checklist. No storage, network calls or personal identifiers.
  var cg = $("chatgpt-config");
  if (cg) {
    var age = $("cg-age"), device = $("cg-device"), goal = $("cg-goal"), level = $("cg-level");
    var result = $("cg-result"), steps = $("cg-steps"), summary = $("cg-summary");
    var addStep = function (value) { var li = document.createElement("li"); li.textContent = value; steps.appendChild(li); };
    $("cg-generate").addEventListener("click", function () {
      steps.textContent = "";
      var a = age.value, d = device.value, g = goal.value, l = level.value;
      if (a === "under13") {
        summary.textContent = "Profil: dziecko poniżej 13 lat. Nie zakładaj samodzielnego konta ChatGPT dla dziecka.";
        addStep("Jeśli ChatGPT jest używany w edukacji, dorosły musi prowadzić bezpośrednią interakcję. Nie przekazuj dziecku samodzielnego dostępu.");
        addStep("Korzystaj z własnego konta dorosłego i nadzoruj każdą sesję. Nie traktuj kontroli rodzicielskiej nastolatków jako rozwiązania dla tego wieku.");
      } else if (a === "adult") {
        summary.textContent = "Profil: osoba pełnoletnia. Teen Parental Controls nie są przeznaczone do zarządzania kontem osoby dorosłej.";
        addStep("Ustal zasady korzystania wspólnie z dorosłym użytkownikiem. Skorzystaj z ustawień konta i systemowych limitów urządzenia, jeśli są potrzebne.");
      } else {
        summary.textContent = "Profil: nastolatek " + (a === "13-15" ? "13–15" : "16–17") + " lat. Uzyskaj zgodę rodzica, połącz konta i wspólnie przejrzyj ustawienia.";
        addStep("Połącz konta: Ustawienia → Kontrola rodzicielska → Dodaj członka rodziny. Nastolatek musi zaakceptować zaproszenie.");
        addStep("Pozostaw włączone Ogranicz treści wrażliwe. Sprawdź też ustawienie Ulepszaj model dla wszystkich.");
        addStep("Ustaw Godziny ciszy na czas snu i inne pory offline. Pamiętaj: to blokuje dostęp, w przeciwieństwie do Godzin nauki.");
        if (g === "learning") addStep("Włącz Tryb nauki lub zaplanuj Godziny nauki. Nie blokują one ChatGPT i nie obejmują rozmów w GPT ani Projects.");
        else if (g === "creative") addStep("Ustal, które funkcje kreatywne są potrzebne. Przejrzyj generowanie obrazów i Voice, zamiast automatycznie udostępniać wszystko.");
        else addStep("Uzgodnij osobne zasady dla nauki i rozrywki; dobierz Godziny ciszy tak, by nie zastępowały rodzinnych ustaleń.");
        addStep("Przejrzyj Voice, obrazy, Health, zapisane wspomnienia, przeglądarkę w chmurze i dostęp sieciowy Codex. Wyłącz niepotrzebne funkcje.");
        addStep("Omów, że rodzic nie widzi historii rozmów ani aktywności na żywo. Ustal, kiedy nastolatek ma zgłaszać niepokojące odpowiedzi.");
      }
      if (l === "strict") addStep("Połącz kontrolę ChatGPT z mocniejszymi limitami urządzenia i regularnym wspólnym przeglądem zasad. Nie próbuj zastępować rozmowy ukrytym monitoringiem.");
      if (l === "light") addStep("Postaw na wspólne reguły, edukację o prywatności i okresowe rozmowy. Zachowaj minimalne, sensowne ograniczenia.");
      if (d === "ios" || d === "mixed") addStep("iPhone/iPad: skonfiguruj Czas przed ekranem i Chmurę rodzinną. Ustaw Czas bez urządzenia, limity aplikacji oraz Ograniczenia treści i prywatności; kod zachowaj dla rodzica.");
      if (d === "android" || d === "mixed") addStep("Android: skonfiguruj Google Family Link, limity aplikacji i harmonogram czasu korzystania.");
      if (d === "computer" || d === "mixed") addStep("Komputer: skonfiguruj kontrolę rodzinną systemu i oddzielne konto użytkownika dziecka.");
      addStep("Na koniec sprawdź aktualne nazwy i dostępność ustawień w oficjalnej dokumentacji OpenAI. Ten konfigurator nie zmienia ustawień automatycznie.");
      result.hidden = false;
      result.scrollIntoView({behavior:"smooth",block:"start"});
    });
    $("cg-print").addEventListener("click", function () { window.print(); });
    $("cg-reset").addEventListener("click", function () { age.selectedIndex=1; device.selectedIndex=0; goal.selectedIndex=0; level.selectedIndex=0; result.hidden=true; steps.textContent=""; summary.textContent=""; });
  }

})();
