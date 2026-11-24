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
    var t = en ? {
      under13:"Profile: child under 13. Do not set up independent ChatGPT use for the child.",
      adult:"Profile: adult. Teen Parental Controls are not designed to manage an adult account.",
      teen:"Profile: teen aged ",
      connect:"Link accounts: Settings → Parental controls → Add family member. The teen must accept the invitation.",
      safety:"Keep Reduce sensitive content on. Also review Improve the model for everyone.",
      quiet:"Set Quiet hours for sleep and offline time. These block access, unlike Study hours.",
      learning:"Enable Study mode or schedule Study hours. They do not block ChatGPT and do not apply to GPT or Project conversations.",
      creative:"Agree which creative features are needed. Review image generation and Voice instead of enabling everything by default.",
      mixed:"Agree separate rules for learning and entertainment; use Quiet hours without relying on them as a substitute for family rules.",
      features:"Review Voice, images, Health, saved memories, Cloud browser and Codex network access. Turn off features that are not needed.",
      privacy:"Explain that parents cannot see chat history or real-time activity. Agree when the teen should report concerning answers.",
      strict:"Combine ChatGPT controls with stronger device limits and regular family reviews. Do not replace conversation with covert monitoring.",
      light:"Focus on shared rules, privacy education and regular conversations. Keep only sensible minimum restrictions.",
      ios:"iPhone/iPad: configure Screen Time and Family Sharing. Set Downtime, app limits and Content & Privacy Restrictions; keep the passcode with the parent.",
      android:"Android: configure Google Family Link, app limits and a device schedule.",
      computer:"Computer: configure the operating system's family controls and a separate child user account.",
      verify:"Finally, check current setting names and availability in OpenAI's official documentation. This builder does not change settings automatically."
    } : {
      under13:"Profil: dziecko poniżej 13 lat. Nie zakładaj samodzielnego konta ChatGPT dla dziecka.",
      adult:"Profil: osoba pełnoletnia. Teen Parental Controls nie są przeznaczone do zarządzania kontem osoby dorosłej.",
      teen:"Profil: nastolatek ",
      connect:"Połącz konta: Ustawienia → Kontrola rodzicielska → Dodaj członka rodziny. Nastolatek musi zaakceptować zaproszenie.",
      safety:"Pozostaw włączone Ogranicz treści wrażliwe. Sprawdź też ustawienie Ulepszaj model dla wszystkich.",
      quiet:"Ustaw Godziny ciszy na czas snu i inne pory offline. To blokuje dostęp, w przeciwieństwie do Godzin nauki.",
      learning:"Włącz Tryb nauki lub zaplanuj Godziny nauki. Nie blokują one ChatGPT i nie obejmują rozmów w GPT ani Projects.",
      creative:"Ustal, które funkcje kreatywne są potrzebne. Przejrzyj generowanie obrazów i Voice, zamiast automatycznie udostępniać wszystko.",
      mixed:"Uzgodnij osobne zasady dla nauki i rozrywki; dobierz Godziny ciszy tak, by nie zastępowały rodzinnych ustaleń.",
      features:"Przejrzyj Voice, obrazy, Health, zapisane wspomnienia, przeglądarkę w chmurze i dostęp sieciowy Codex. Wyłącz niepotrzebne funkcje.",
      privacy:"Omów, że rodzic nie widzi historii rozmów ani aktywności na żywo. Ustal, kiedy nastolatek ma zgłaszać niepokojące odpowiedzi.",
      strict:"Połącz kontrolę ChatGPT z mocniejszymi limitami urządzenia i regularnym wspólnym przeglądem zasad. Nie zastępuj rozmowy ukrytym monitoringiem.",
      light:"Postaw na wspólne reguły, edukację o prywatności i okresowe rozmowy. Zachowaj minimalne, sensowne ograniczenia.",
      ios:"iPhone/iPad: skonfiguruj Czas przed ekranem i Chmurę rodzinną. Ustaw Czas bez urządzenia, limity aplikacji oraz Ograniczenia treści i prywatności; kod zachowaj dla rodzica.",
      android:"Android: skonfiguruj Google Family Link, limity aplikacji i harmonogram czasu korzystania.",
      computer:"Komputer: skonfiguruj kontrolę rodzinną systemu i oddzielne konto użytkownika dziecka.",
      verify:"Na koniec sprawdź aktualne nazwy i dostępność ustawień w oficjalnej dokumentacji OpenAI. Ten konfigurator nie zmienia ustawień automatycznie."
    };
    var addStep = function (value) { var li = document.createElement("li"); li.textContent = value; steps.appendChild(li); };
    $("cg-generate").addEventListener("click", function () {
      steps.textContent = "";
      var a = age.value, d = device.value, g = goal.value, l = level.value;
      if (a === "under13") {
        summary.textContent = t.under13;
        addStep(en ? "If ChatGPT is used for education, an adult must conduct the interaction. Do not give the child independent access." : "Jeśli ChatGPT jest używany w edukacji, dorosły musi prowadzić bezpośrednią interakcję. Nie przekazuj dziecku samodzielnego dostępu.");
        addStep(en ? "Use an adult's own account and supervise each session. Teen parental controls are not a solution for this age group." : "Korzystaj z własnego konta dorosłego i nadzoruj każdą sesję. Kontrola rodzicielska nastolatków nie jest rozwiązaniem dla tego wieku.");
      } else if (a === "adult") {
        summary.textContent = t.adult;
        addStep(en ? "Agree on usage rules with the adult account holder. Use account settings and device-level limits if needed." : "Ustal zasady korzystania wspólnie z dorosłym użytkownikiem. Skorzystaj z ustawień konta i systemowych limitów urządzenia, jeśli są potrzebne.");
      } else {
        summary.textContent = t.teen + (a === "13-15" ? "13–15" : "16–17") + (en ? ". Obtain parental consent, link accounts and review settings together." : " lat. Uzyskaj zgodę rodzica, połącz konta i wspólnie przejrzyj ustawienia.");
        addStep(t.connect); addStep(t.safety); addStep(t.quiet);
        addStep(t[g]); addStep(t.features); addStep(t.privacy);
      }
      if (l === "strict") addStep(t.strict);
      if (l === "light") addStep(t.light);
      if (d === "ios" || d === "mixed") addStep(t.ios);
      if (d === "android" || d === "mixed") addStep(t.android);
      if (d === "computer" || d === "mixed") addStep(t.computer);
      addStep(t.verify);
      result.hidden = false;
      result.scrollIntoView({behavior:"smooth",block:"start"});
    });
    $("cg-print").addEventListener("click", function () { window.print(); });
    $("cg-reset").addEventListener("click", function () { age.selectedIndex=1; device.selectedIndex=0; goal.selectedIndex=0; level.selectedIndex=0; result.hidden=true; steps.textContent=""; summary.textContent=""; });
  }
})();
