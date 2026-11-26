/* Nest Guardian / Strażnik gniazda: a short game about unwanted messages. No storage, no network requests.
   Language comes from <html lang>. type: "safe" = normal message, "skip" = do not reply, "adult" = tell an adult. */
(() => {
"use strict";
const MESSAGES = [
 {id:"babcia",type:"safe",
  pl:["Babcia","Przyjdziesz w sobotę na naleśniki? Zapytaj rodziców.","Znasz tę osobę, a ona sama prosi, żeby zapytać rodziców."],
  en:["Grandma","Will you come for pancakes on Saturday? Ask your parents.","You know this person, and she is asking you to check with your parents."]},
 {id:"lekcje",type:"safe",
  pl:["Kuba z klasy","Co było zadane z matematyki?","To zwykłe pytanie od kolegi, którego znasz ze szkoły."],
  en:["Jake from class","What was the math homework?","This is a normal question from a classmate you know from school."]},
 {id:"mama",type:"safe",
  pl:["Mama","Będę w domu o 17. Zupa jest w lodówce.","To zwykła wiadomość od bliskiej osoby i o nic dziwnego nie prosi."],
  en:["Mom","I’ll be home at 5. There is soup in the fridge.","This is a normal message from someone close to you, and it asks for nothing strange."]},
 {id:"pilka",type:"safe",
  pl:["Hania z klasy","Gramy jutro w piłkę po szkole? Zapytaj w domu, czy możesz.","Znasz Hanię, a rodzice będą wiedzieć o waszych planach."],
  en:["Emma from class","Soccer after school tomorrow? Ask at home if you can come.","You know Emma, and your parents will know about your plans."]},
 {id:"nagroda",type:"skip",
  pl:["Nieznany numer","Gratulacje! Czeka na ciebie nowy tablet. Kliknij link w 5 minut, bo przepadnie!","Nagroda znikąd i pośpiech to częsta sztuczka, żeby ktoś kliknął bez zastanowienia."],
  en:["Unknown number","Congratulations! A new tablet is waiting for you. Click the link in 5 minutes or lose it!","A surprise prize and a rush are a common trick to make someone click without thinking."]},
 {id:"lancuszek",type:"skip",
  pl:["Nieznany numer","Wyślij to do 10 osób, bo inaczej stracisz konto!","Takie łańcuszki straszą, żeby je przesyłać dalej. Można je po prostu skasować."],
  en:["Unknown number","Send this to 10 people or you will lose your account!","Chain messages like this try to scare you into passing them on. You can just delete them."]},
 {id:"haslo",type:"adult",
  pl:["SmoczyKapitan (z gry)","Podaj mi hasło do swojego konta, a dostaniesz 1000 monet.","Hasło znasz tylko Ty i rodzice, bo kto je dostanie, może zabrać Twoje konto."],
  en:["DragonCaptain (from a game)","Give me your account password and you will get 1000 coins.","Only you and your parents should know your password, because anyone who gets it can take your account."]},
 {id:"adres",type:"adult",
  pl:["Gracz_77 (z gry)","Fajnie się z tobą gra! Ile masz lat i na jakiej ulicy mieszkasz?","Wieku i adresu nie podajemy osobom, które znamy tylko z internetu."],
  en:["Player_77 (from a game)","It’s fun to play with you! How old are you and what street do you live on?","We don’t tell our age or address to people we only know online."]},
 {id:"sekret",type:"adult",
  pl:["Nowy znajomy","Tylko nie mów rodzicom, że piszemy. To będzie nasz sekret.","Gdy ktoś z internetu prosi o tajemnicę przed rodzicami, od razu powiedz dorosłemu."],
  en:["New friend","Don’t tell your parents we are chatting. It will be our secret.","When someone online asks you to keep a secret from your parents, tell an adult right away."]},
 {id:"zdjecie",type:"adult",
  pl:["Nowy znajomy","Wyślij mi swoje zdjęcie, to ja wyślę ci swoje.","Zdjęć nie wysyłamy osobom z internetu, bo potem trudno je cofnąć."],
  en:["New friend","Send me a photo of you and I will send you mine.","We don’t send photos to people online, because it is hard to take them back."]},
 {id:"kod",type:"adult",
  pl:["Nieznany numer","Hej, tu ciocia, mam nowy numer. Prześlij mi kod, który przyszedł na telefon taty.","Ktoś może udawać bliską osobę, a kodów z SMS-ów nikomu nie przesyłamy."],
  en:["Unknown number","Hi, it’s your aunt, this is my new number. Send me the code that came to your dad’s phone.","Someone may be pretending to be a person you love, and we never pass on codes from text messages."]},
 {id:"klasa",type:"adult",
  pl:["Czat klasowy","Napiszmy wszyscy do Zosi, że nikt jej nie lubi!","To bardzo rani, więc nie dołączaj i poproś dorosłego o pomoc dla Zosi."],
  en:["Class chat","Let’s all write to Mia that nobody likes her!","This really hurts, so don’t join in and ask an adult to help Mia."]},
 {id:"zakup",type:"adult",
  pl:["Sklep w grze","Tylko dziś! Złota skrzynia za 19,99 zł. Kliknij „Kup teraz”.","Zakupy w grze to prawdziwe pieniądze, więc decyduje o nich dorosły."],
  en:["Game shop","Today only! Golden chest for €4.99. Tap “Buy now”.","Shopping in games costs real money, so an adult decides."]},
 {id:"park",type:"adult",
  pl:["Nowy znajomy","Mieszkam niedaleko. Przyjdź jutro do parku, ale bez dorosłych.","Na spotkanie z kimś poznanym w internecie nie idziemy bez wiedzy i zgody rodziców."],
  en:["New friend","I live close by. Come to the park tomorrow, but without any adults.","We never go to meet someone from the internet unless our parents know and agree."]},
 {id:"apka",type:"adult",
  pl:["Nieznany numer","Zainstaluj tę darmową aplikację i odblokuj wszystkie stroje w grze.","Aplikacje instalujemy po zgodzie rodziców, bo nieznane mogą zaszkodzić telefonowi."],
  en:["Unknown number","Install this free app and unlock every outfit in the game.","We install apps after our parents agree, because unknown ones can harm the phone."]}
];

const CHOICES = [
 {key:"ok",icon:'<path d="M5 13l4 4L19 7"/>'},
 {key:"no",icon:'<circle cx="12" cy="12" r="9"/><path d="M6 6l12 12"/>'},
 {key:"ask",icon:'<circle cx="9" cy="7" r="3.5"/><path d="M3 20c0-4 2.5-6.5 6-6.5s6 2.5 6 6.5"/><circle cx="18" cy="11" r="2.5"/><path d="M16 20c0-2.500 .8-4 2-4s3 1.200 3 4"/>'}
];

// 1 = dobra odpowiedź, 0 = warto o niej porozmawiać
const GOOD = {safe:{ok:1,no:0,ask:1},skip:{ok:0,no:1,ask:1},adult:{ok:0,no:1,ask:1}};

const T = {
 pl:{
  name:"Strażnik gniazda",
  intro:"Przyjdzie 10 wiadomości. Przy każdej wybierz, co robisz. Za każdą dołożysz gałązkę do gniazda.",
  choice:{ok:"W porządku",no:"Nie odpowiadam",ask:"Pytam dorosłego"},
  help:{ok:"to zwykła wiadomość.",no:"coś mi tu nie pasuje.",ask:"chcę pomocy. Tak można zawsze."},
  start:"Zaczynam",
  parents:"Dla rodziców: gra dla dzieci w wieku około 7–10 lat. Wiadomości są zmyślone. Gra nie ma kont ani reklam, nie zbiera i nie zapisuje danych.",
  progress:(i,n)=>`Wiadomość ${i} z ${n}`, what:"Co robisz?", picked:"Twój wybór", next:"Dalej", last:"Zobacz pisklę",
  result:{
   safe:{ok:"Tak, to zwykła wiadomość.",no:"Tu akurat można spokojnie odpisać.",ask:"Pytanie dorosłego to zawsze dobry ruch."},
   skip:{ok:"Zatrzymajmy się tutaj.",no:"Dobry wybór.",ask:"Pytanie dorosłego to zawsze dobry ruch."},
   adult:{ok:"Zatrzymajmy się tutaj.",no:"Dobrze, że nie odpowiadasz. Powiedz też dorosłemu.",ask:"Świetnie, to najlepszy ruch."}},
  done:"Gniazdo gotowe!", doneText:"Wszystkie 10 gałązek na miejscu i pisklę jest bezpieczne.",
  rulesTitle:"Zasady strażnika",
  rules:["Hasła, adresu i zdjęć nie wysyłam osobom z internetu.","Gdy ktoś mnie pogania albo obiecuje nagrodę, zatrzymuję się.","Gdy coś jest dziwne albo przykre, mówię dorosłemu. To nie moja wina."],
  talkTitle:"Pytanie na rozmowę z rodzicem",
  questions:["Do kogo możesz przyjść, gdy coś w internecie Cię zdziwi albo zasmuci?","Czy ktoś kiedyś prosił Cię w grze o coś dziwnego?","Po czym poznajesz, że znasz kogoś naprawdę, a nie tylko z internetu?","Co chcesz, żeby dorosły zrobił, kiedy przyjdziesz po pomoc?"],
  again:"Do pogadania z dorosłym",
  helpline:'Możesz też zadzwonić pod <span class="g-phone">116 111</span>. To bezpłatny telefon zaufania dla dzieci i młodzieży, czynny całą dobę.',
  restart:"Gram jeszcze raz",
  nest:n=>`Gniazdo z jajkiem, gałązki: ${n} z 10`, chick:"Z jajka w gnieździe wykluło się pisklę"
 },
 en:{
  name:"Nest Guardian",
  intro:"You will get 10 messages. For each one, choose what you do. Every message adds a twig to the nest.",
  choice:{ok:"It’s OK",no:"I don’t reply",ask:"I ask an adult"},
  help:{ok:"this is a normal message.",no:"something feels wrong.",ask:"I want help. You can always do this."},
  start:"Start",
  parents:"For parents: a game for children aged about 7–10. All messages are made up. The game has no accounts or ads, and it does not collect or save any data.",
  progress:(i,n)=>`Message ${i} of ${n}`, what:"What do you do?", picked:"Your choice", next:"Next", last:"See the chick",
  result:{
   safe:{ok:"Yes, this is a normal message.",no:"You can safely reply to this one.",ask:"Asking an adult is always a good move."},
   skip:{ok:"Let’s stop here.",no:"Good choice.",ask:"Asking an adult is always a good move."},
   adult:{ok:"Let’s stop here.",no:"Good that you don’t reply. Tell an adult too.",ask:"Great, that is the best move."}},
  done:"The nest is ready!", doneText:"All 10 twigs are in place and the chick is safe.",
  rulesTitle:"Guardian rules",
  rules:["I don’t send my password, address or photos to people online.","When someone rushes me or promises a prize, I stop.","When something is strange or upsetting, I tell an adult. It is not my fault."],
  talkTitle:"A question to talk about with a parent",
  questions:["Who can you go to when something online surprises you or makes you sad?","Has anyone in a game ever asked you for something strange?","How can you tell that you really know someone, and not only from the internet?","What would you like an adult to do when you ask for help?"],
  again:"Talk about these with an adult",
  helpline:'You can also call a child helpline. In many European countries the free number is <span class="g-phone">116 111</span>. Somewhere else, ask an adult for your local number.',
  restart:"Play again",
  nest:n=>`A nest with an egg, twigs: ${n} of 10`, chick:"A chick has hatched in the nest"
 }
};

const app = document.getElementById("game");
if (!app) return;
const lang = document.documentElement.lang === "pl" ? "pl" : "en";
let view = "start", round = [], index = 0, review = [], picked = null, question = 0;

const shuffle = list => {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

// 10 wiadomości: 3 zwykłe, 2 do pominięcia, 5 dla dorosłego (zawsze hasło i sekret).
function buildRound() {
  const of = t => MESSAGES.filter(m => m.type === t);
  const must = of("adult").filter(m => m.id === "haslo" || m.id === "sekret");
  const extra = shuffle(of("adult").filter(m => !must.includes(m))).slice(0, 3);
  const safe = shuffle(of("safe")).slice(0, 3);
  const first = safe.pop();
  return [first, ...shuffle([...safe, ...shuffle(of("skip")).slice(0, 2), ...must, ...extra])];
}

const TWIGS = [
 "M42 118Q120 168 198 118","M50 126Q112 146 186 108","M54 108Q128 156 192 130","M64 138Q120 160 178 136","M36 108Q78 144 142 148",
 "M204 106Q168 146 98 148","M46 134Q96 122 150 152","M194 138Q140 120 90 150","M58 118Q120 138 184 120","M34 122Q120 182 206 122"
];

function nestSvg(count, state, small) {
  const twig = (d, i) => `<path class="${i % 2 ? "g-twig2" : "g-twig"}${state === "drop" && i === count - 1 ? " g-twig-new" : ""}" d="${d}" fill="none" stroke-width="6" stroke-linecap="round"/>`;
  const egg = state === "hatched"
    ? `<g class="g-egg-rock">
        <circle cx="120" cy="70" r="29" class="g-shell"/>
        <circle cx="110" cy="64" r="4" fill="#0F172A"/><circle cx="130" cy="64" r="4" fill="#0F172A"/>
        <path d="M112 74h16l-8 10z" fill="#A84A07"/>
        <path d="M116 42q-2-12 6-15M122 42q5-9 12-8" fill="none" class="g-shell-line" stroke-width="4" stroke-linecap="round"/>
        <path d="M82 96l13 9 12-12 13 12 13-12 12 12 13-9q-4 38-38 38t-38-38z" class="g-shine"/>
      </g>`
    : `<g class="${state === "drop" ? "g-egg-rock" : ""}"><ellipse cx="120" cy="88" rx="33" ry="42" class="g-shell"/><ellipse cx="108" cy="70" rx="7" ry="12" class="g-shine" transform="rotate(25 108 70)"/></g>`;
  const label = state === "hatched" ? T[lang].chick : T[lang].nest(count);
  return `<svg class="g-nest${small ? " g-small-nest" : ""}" viewBox="0 0 240 170" role="img" aria-label="${label}">
    <path d="M30 108Q120 126 210 108Q198 160 120 160T30 108Z" class="g-bowl"/>
    ${egg}
    <path d="M32 108Q50 134 82 126" fill="none" class="g-root" stroke-width="5" stroke-linecap="round"/>
    ${TWIGS.slice(0, count).map(twig).join("")}
  </svg>`;
}

// Każdy ekran powstaje ze stanu, więc zmiana języka nie przerywa gry.
function startScreen(t) {
  return `${nestSvg(0, "rest")}
    <h1>${t.name}</h1>
    <p class="g-center">${t.intro}</p>
    <div class="g-card">${CHOICES.map(c => `<p><strong>${t.choice[c.key]}</strong>: ${t.help[c.key]}</p>`).join("")}</div>
    <button class="g-primary" id="start">${t.start}</button>
    <p class="g-center g-soft g-small">${t.parents}</p>`;
}

function messageScreen(t, animate) {
  const m = round[index], [who, text, why] = m[lang], answered = view === "answer";
  const top = `${nestSvg(index + (answered ? 1 : 0), answered && animate ? "drop" : "rest", true)}<p class="g-center g-soft g-small">${t.progress(index + 1, round.length)}</p>
    <div class="g-card">
      <div class="g-from"><span class="g-avatar" aria-hidden="true">${who.charAt(0)}</span><span class="g-who">${who}</span></div>
      <p class="g-bubble">${text}</p>
    </div>`;
  if (!answered) return `${top}<div class="g-choices" role="group" aria-label="${t.what}">
      ${CHOICES.map(c => `<button class="g-choice" data-k="${c.key}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${c.icon}</svg><span>${t.choice[c.key]}</span></button>`).join("")}
    </div>`;
  return `${top}<div class="g-feedback ${GOOD[m.type][picked] ? "g-good" : "g-think"}" role="status">
      <p class="g-picked">${t.picked}: ${t.choice[picked]}</p>
      <h2>${t.result[m.type][picked]}</h2>
      <p>${why}</p>
    </div>
    <button class="g-primary" id="next">${index === round.length - 1 ? t.last : t.next}</button>`;
}

function endScreen(t) {
  const again = review.length
    ? `<div class="g-card"><h2>${t.again}</h2><ul>${review.map(m => `<li><strong>${m[lang][1]}</strong><br><span class="g-soft">${m[lang][2]}</span></li>`).join("")}</ul></div>`
    : "";
  return `${nestSvg(10, "hatched")}
    <h1>${t.done}</h1>
    <p class="g-center">${t.doneText}</p>
    <div class="g-card"><h2>${t.rulesTitle}</h2><ul>${t.rules.map(r => `<li>${r}</li>`).join("")}</ul></div>
    <div class="g-talk"><h2>${t.talkTitle}</h2><p class="g-q">${t.questions[question]}</p></div>
    ${again}
    <p class="g-center">${t.helpline}</p>
    <button class="g-primary" id="restart">${t.restart}</button>`;
}

function render(animate) {
  const t = T[lang];
  app.innerHTML = view === "start" ? startScreen(t) : view === "end" ? endScreen(t) : messageScreen(t, animate);
  const on = (id, fn) => { const el = app.querySelector(id); if (el) el.onclick = fn; };
  on("#start", () => { round = buildRound(); index = 0; review = []; go("question"); });
  on("#next", () => {
    if (index < round.length - 1) { index++; go("question"); }
    else { question = Math.floor(Math.random() * T.pl.questions.length); go("end"); }
  });
  on("#restart", () => go("start"));
  app.querySelectorAll(".g-choice").forEach(b => b.onclick = () => {
    picked = b.dataset.k;
    if (!GOOD[round[index].type][picked]) review.push(round[index]);
    go("answer");
  });
}

function go(next) {
  view = next;
  render(true);
  const button = view === "answer" ? app.querySelector("#next") : null;
  (button || app).focus({preventScroll:true});
  if (button) button.scrollIntoView({block:"nearest"}); else app.scrollIntoView({block:"start"});
}

render(false);
})();
