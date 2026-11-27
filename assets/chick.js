/* Feed the Chick / Nakarm pisklę: tap the good videos to feed a growing bird. No storage, no network requests.
   Language comes from <html lang>. */
(() => {
"use strict";
const lang = document.documentElement.lang === "pl" ? "pl" : "en";
const T = {
 pl:{
  stages:["Pisklak","Puchaty ptaszek","Młody ptak"],
  hud:(s,f,n)=>`${s} · kąski ${f} z ${n}`, snacks:(f,n)=>`Kąski: ${f} z ${n}`,
  soundOn:"Dźwięk włączony", soundOff:"Dźwięk wyłączony", inNest:s=>`${s} w gnieździe`, film:t=>`Film: ${t}`,
  tap:"Stukaj w dobre filmy!", first:"Najpierw stuknij robala, żeby go przegonić!", yum:"Mniam!", yuck:"Fuj, robal!",
  shooLabel:"Przegoń robala", wormLeft:"Jeszcze jeden robal czeka!", wormGone:"Brawo, robala nie ma! Zły film zawsze można wyłączyć.",
  title:"Nakarm pisklę",
  how:["Stuknij dobry film. Pisklę dostanie kąsek i urośnie.","Zły film to robal. Stuknij robala, żeby go przegonić.","Po drodze są przerwy. Ptaki też muszą odpocząć."],
  tempo:"Tempo", calm:"Spokojnie", fast:"Szybciej", go:"Gram!",
  parents:"Dla rodziców: gra dla dzieci w wieku około 7–10 lat. Filmy są zmyślone i niczego nie odtwarzają. Gra nie zbiera i nie zapisuje danych.",
  breakTitle:"Przerwa", breakText:"Pisklę śpi i rośnie. Popatrz przez okno na coś daleko albo się przeciągnij.", sleeping:"Pisklę jeszcze śpi", wake:"Pobudka!",
  woke:s=>`Pobudka! Teraz to ${s.toLowerCase()}.`,
  pauseTitle:"Pauza", pauseText:"Gra czeka na Ciebie.", back:"Gram dalej", quit:"Od początku",
  flies:"Ptak wylatuje z gniazda", done:"Ptak umie latać!", doneText:"Dzięki dobrym filmom, przerwom i przeganianiu robali.", skipped:"Ominięte złe filmy",
  talkTitle:"Pytanie na rozmowę z rodzicem",
  questions:["Jaki film ostatnio czegoś Cię nauczył?","Co robisz, gdy film Cię przestraszy albo zasmuci?","Po czym poznasz, że czas skończyć oglądanie?","Który film z gry chcesz omówić razem?"],
  wormList:"Te filmy przyniosły robala", noWorm:"Ani jednego robala. Świetne oko!",
  stop:"To koniec na teraz. Odłóż ekran i zrób coś, co lubisz.",
  helpline:"Gdy coś Cię martwi i nie masz komu powiedzieć, zadzwoń pod 116 111. To bezpłatny telefon zaufania dla dzieci i młodzieży, czynny całą dobę.",
  again:"Zagraj jeszcze raz"
 },
 en:{
  stages:["Chick","Fluffy bird","Young bird"],
  hud:(s,f,n)=>`${s} · snacks ${f} of ${n}`, snacks:(f,n)=>`Snacks: ${f} of ${n}`,
  soundOn:"Sound on", soundOff:"Sound off", inNest:s=>`${s} in the nest`, film:t=>`Video: ${t}`,
  tap:"Tap the good videos!", first:"First tap the bug to chase it away!", yum:"Yum!", yuck:"Yuck, a bug!",
  shooLabel:"Chase the bug away", wormLeft:"One more bug is waiting!", wormGone:"Well done, the bug is gone! You can always turn off a bad video.",
  title:"Feed the Chick",
  how:["Tap a good video. The chick gets a snack and grows.","A bad video brings a bug. Tap the bug to chase it away.","There are breaks on the way. Birds need rest too."],
  tempo:"Speed", calm:"Calm", fast:"Faster", go:"Play!",
  parents:"For parents: a game for children aged about 7–10. The videos are made up and nothing is played. The game does not collect or save any data.",
  breakTitle:"Break time", breakText:"The chick is sleeping and growing. Look out of the window at something far away, or have a stretch.", sleeping:"The chick is still asleep", wake:"Wake up!",
  woke:s=>`Wake up! Now it is a ${s.toLowerCase()}.`,
  pauseTitle:"Paused", pauseText:"The game is waiting for you.", back:"Keep playing", quit:"Start over",
  flies:"The bird flies out of the nest", done:"The bird can fly!", doneText:"Thanks to good videos, breaks and chasing the bugs away.", skipped:"Bad videos you let go by",
  talkTitle:"A question to talk about with a parent",
  questions:["Which video taught you something lately?","What do you do when a video scares you or makes you sad?","How do you know it is time to stop watching?","Which video from the game would you like to talk about?"],
  wormList:"These videos brought a bug", noWorm:"Not a single bug. Sharp eyes!",
  stop:"That is all for now. Put the screen away and do something you like.",
  helpline:"If something worries you and there is no one you can tell, call a child helpline. In many European countries the free number is 116 111. Somewhere else, ask an adult for your local number.",
  again:"Play again"
 }
}[lang];
const GOAL = 15, STAGES = T.stages;

// good: 1 = snack, 0 = bug
const VIDEOS = [
 ["karmnik",1,"house",
  ["Budujemy karmnik","Można się czegoś nauczyć i zrobić to samemu."],
  ["Let’s build a bird feeder","You can learn something and make it yourself."]],
 ["niebo",1,"sun",
  ["Czemu niebo jest niebieskie?","Ciekawość to świetne jedzenie dla głowy."],
  ["Why is the sky blue?","Being curious is great food for your mind."]],
 ["kot",1,"pencil",
  ["Rysujemy kota","Po takim filmie można samemu coś narysować."],
  ["Let’s draw a cat","After a video like this you can draw something."]],
 ["ruch",1,"ball",
  ["5 minut ruchu","Ten film zachęca, żeby wstać i się poruszać."],
  ["5 minutes of moving","This video gets you to stand up and move."]],
 ["piosenka",1,"note",
  ["Piosenka po angielsku","Śpiewając, uczysz się nowych słów."],
  ["A song in Spanish","When you sing, you learn new words."]],
 ["eksperyment",1,"flask",
  ["Eksperyment z tatą","Razem z dorosłym jest ciekawie i bezpiecznie."],
  ["Science with Dad","With an adult it is fun and safe."]],
 ["psy",1,"paw",
  ["Wesołe szczeniaki","Zabawa też jest dobra, gdy nikogo nie krzywdzi."],
  ["Happy puppies","Fun is good too when nobody gets hurt."]],
 ["kanapki",1,"apple",
  ["Kolorowe kanapki","To pomysł do zrobienia razem w kuchni."],
  ["Rainbow sandwiches","An idea to make together in the kitchen."]],
 ["kosmos",1,"rocket",
  ["Wyprawa na Księżyc","Nowa wiedza o kosmosie."],
  ["A trip to the Moon","New facts about space."]],
 ["las",1,"leaf",
  ["Jakie to drzewo?","Potem można to sprawdzić na spacerze."],
  ["Which tree is it?","You can check it on a walk later."]],
 ["klocki",1,"blocks",
  ["Most z klocków","To pomysł na własną zabawę."],
  ["A bridge of blocks","An idea for your own play."]],
 ["smieci",1,"bin",
  ["Segregujemy śmieci","Ta wiedza przyda się w domu."],
  ["Sorting our trash","This is useful at home."]],
 ["nagroda",0,"gift",
  ["Kliknij i wygraj telefon!","Nagroda za kliknięcie to częsta sztuczka."],
  ["Click and win a phone!","A prize for a click is a common trick."]],
 ["haslo",0,"key",
  ["Monety za twoje hasło","Hasła nie podaje się obcym."],
  ["Coins for your password","Don’t give your password to strangers."]],
 ["sekret",0,"lock",
  ["Tylko nie mów mamie!","Gdy film każe coś ukrywać, powiedz dorosłemu."],
  ["Don’t tell your mom!","When a video says to hide something, tell an adult."]],
 ["wyzwanie",0,"warn",
  ["Niebezpieczne wyzwanie","Wyzwań, które mogą zaboleć, nie powtarzamy."],
  ["Dangerous challenge","We don’t copy challenges that can hurt."]],
 ["smiech",0,"sad",
  ["Wyśmiewamy kolegę","Śmiech z czyjejś przykrości rani."],
  ["Laughing at a classmate","Laughing at someone’s bad moment hurts."]],
 ["jeszcze",0,"loop",
  ["Jeszcze jeden! I jeszcze!","Takie filmy nie mają końca. Ty mówisz stop."],
  ["One more! And one more!","Videos like this never end. You say stop."]],
 ["kup",0,"coin",
  ["Kup teraz! Tylko dziś!","Ktoś pogania, żeby wydać pieniądze."],
  ["Buy now! Today only!","Someone is rushing you to spend money."]],
 ["horror",0,"ghost",
  ["Straszny film 18+","To film dla dorosłych."],
  ["Scary video 18+","This video is for adults."]]
].map(([id,good,pic,pl,en]) => { const [title, why] = lang === "pl" ? pl : en; return {id, good:!!good, pic, title, why}; });

const PICS = {
 house:'<path d="M3 11l9-7 9 7M6 10v10h12V10"/><circle cx="12" cy="14" r="2.5"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
 pencil:'<path d="M4 20l4-1L20 7l-3-3L5 16zM14 7l3 3"/>',
 ball:'<circle cx="12" cy="12" r="9"/><path d="M5 6c5 3 5 9 0 12M19 6c-5 3-5 9 0 12"/>',
 note:'<path d="M9 18V5l11-2v13"/><circle cx="6.500" cy="18" r="2.500"/><circle cx="17.500" cy="16" r="2.500"/>',
 flask:'<path d="M9 3h6M10 3v6L4 19q-1 2 2 2h12q3 0 2-2L14 9V3M7 15h10"/>',
 paw:'<ellipse cx="12" cy="16" rx="5" ry="4"/><circle cx="5" cy="10" r="2"/><circle cx="9.500" cy="6" r="2"/><circle cx="14.500" cy="6" r="2"/><circle cx="19" cy="10" r="2"/>',
 apple:'<path d="M12 8c-3-3-8-1-8 4s4 10 8 8c4 2 8-3 8-8s-5-7-8-4zM12 8q0-4 3-5"/>',
 rocket:'<path d="M12 3c4 3 5 8 3 13H9C7 11 8 6 12 3zM9 13l-4 4v3l4-2M15 13l4 4v3l-4-2M11 20v2M13 20v2"/><circle cx="12" cy="9" r="1.800"/>',
 leaf:'<path d="M5 19C3 9 10 4 20 4c0 11-6 17-15 15zM5 19l9-9"/>',
 blocks:'<path d="M3 14h7v6H3zM14 14h7v6h-7zM7 8h10v6H7z"/>',
 bin:'<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6"/>',
 gift:'<path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7C6 7 7 1 12 7c5-6 6 0 0 0"/>',
 key:'<circle cx="8" cy="12" r="4.500"/><path d="M12.500 12H21M18 12v4M21 12v3"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3M12 15v2"/>',
 warn:'<path d="M12 3l10 18H2zM12 10v5M12 18v.1"/>',
 sad:'<circle cx="12" cy="12" r="9"/><path d="M8 17q4-4 8 0M8.500 9v.5M15.500 9v.5"/>',
 loop:'<path d="M4 12a8 8 0 0 1 14-5l2 2M20 4v5h-5M20 12a8 8 0 0 1-14 5l-2-2M4 20v-5h5"/>',
 coin:'<circle cx="12" cy="12" r="9"/><path d="M15 9q-1-2-3-2c-4 0-4 5 0 5s4 5 0 5q-2 0-3-2M12 5v14"/>',
 ghost:'<path d="M5 21V10a7 7 0 0 1 14 0v11l-3-2-2 2-2-2-2 2-2-2zM9 10v1M15 10v1"/>'
};
const $ = id => document.getElementById(id);
if (!$("chick")) return;
const field = $("field"), panel = $("panel"), say = $("say"), nestbox = $("nestbox");
let mode = "menu", speed = "calm", food, cards, worms, badSeen, skipped, deck, badRun, goodRun, spawnIn, slowFor, pending, countdown, last = 0, sound = true, audio = null;

const shuffle = list => { const a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const stageNow = () => food >= 10 ? 2 : food >= 5 ? 1 : 0;

/* ---------- sound: short tones made in the browser, no files ---------- */
function tone(freqs, type) {
  if (!sound) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    audio = audio || new AC();
    if (audio.state === "suspended") audio.resume();
    freqs.forEach((f, i) => {
      const o = audio.createOscillator(), g = audio.createGain(), t = audio.currentTime + i * .09;
      o.type = type || "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.001, t + .14);
      o.connect(g).connect(audio.destination); o.start(t); o.stop(t + .15);
    });
  } catch (e) { /* the game works without sound */ }
}
function drawSound() {
  const b = $("sound");
  b.setAttribute("aria-pressed", String(sound));
  b.setAttribute("aria-label", sound ? T.soundOn : T.soundOff);
  b.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/>${sound ? '<path d="M17 9q2 3 0 6M20 7q4 5 0 10"/>' : '<path d="M17 9l5 6M22 9l-5 6"/>'}</svg>`;
}

/* ---------- drawings ---------- */
function bird(stage, o = {}) {
  const eyes = o.sleep ? '<path d="M-18 -8q6 6 12 0M6 -8q6 6 12 0" fill="none" stroke="#0F172A" stroke-width="3.500" stroke-linecap="round"/>'
    : o.yuck ? '<path d="M-18 -13l11 5-11 5M18 -13L7 -8l11 5" fill="none" stroke="#0F172A" stroke-width="3.500" stroke-linecap="round" stroke-linejoin="round"/>'
    : '<circle cx="-12" cy="-9" r="6" fill="#0F172A"/><circle cx="12" cy="-9" r="6" fill="#0F172A"/><circle cx="-10" cy="-11" r="2" fill="#fff"/><circle cx="14" cy="-11" r="2" fill="#fff"/>';
  const wing = side => `<g transform="translate(${side * 30} 8) scale(${side} 1)"><path class="${o.fly ? "wing" : ""}" d="M0 -6Q36 -18 44 6Q24 26 -2 14Z" fill="#F59E0B"/></g>`;
  return `${stage >= 2 ? wing(-1) + wing(1) + '<path d="M-14 30L0 54L14 30Z" fill="#D97706"/>' : ""}
    <circle r="36" fill="#FBBF24"/>
    ${stage >= 1 ? '<ellipse cy="16" rx="22" ry="16" fill="#FDE68A"/>' : ""}
    <path d="M-4 -35q-3-14 6-18M3 -35q5-12 15-11${stage >= 1 ? "M-8 -34q-8-9-17-7" : ""}" fill="none" stroke="#F59E0B" stroke-width="4.500" stroke-linecap="round"/>
    ${eyes}
    <path class="beak-low" d="M-10 5h20l-10 13z" fill="#B45309"/>
    <path d="M-11 4L0 -4L11 4L0 9Z" fill="#EA580C"/>
    ${stage === 0 && !o.fly ? '<path d="M-42 14l12 10 10-12 10 12 10-12 10 12 10-12 10 12 12-10q-4 38-42 38t-42-38z" fill="#fff" stroke="#E6DDCF" stroke-width="2"/>' : ""}`;
}
const NEST_BACK = '<ellipse cx="180" cy="116" rx="112" ry="24" fill="#6B4320"/>';
const NEST_FRONT = '<path d="M66 112Q180 142 294 112Q280 154 180 154T66 112Z" fill="#8A5A2B"/>' +
  ["M62 116Q150 156 284 108","M76 108Q170 150 298 118","M80 134Q180 118 280 142","M92 146Q190 124 292 124","M68 128Q140 160 250 150"]
  .map((d, i) => `<path d="${d}" fill="none" stroke="${i % 2 ? "#C08B52" : "#A06C38"}" stroke-width="6" stroke-linecap="round"/>`).join("");

function drawNest(mood) {
  const s = stageNow(), scale = [.78, 1, 1.18][s], y = [96, 82, 70][s];
  const yuck = mood === "yuck" || worms.length > 0 && mood !== "chew";
  nestbox.innerHTML = `<svg class="scene ${mood || ""}" viewBox="0 0 360 156" role="img" aria-label="${T.inNest(STAGES[s])}">${NEST_BACK}
    <g transform="translate(180 ${y}) scale(${scale})"><g class="bounce">${bird(s, {yuck})}</g></g>${NEST_FRONT}</svg>` ;
  worms.forEach(w => nestbox.appendChild(w));
}

function drawHud() {
  $("stage").textContent = T.hud(STAGES[stageNow()], food, GOAL);
  $("bar").setAttribute("aria-label", T.snacks(food, GOAL));
  $("bar").innerHTML = Array.from({length:GOAL}, (_, i) => `<i class="${i < food ? "on" : ""}"></i>`).join("");
}

function tell(text, kind) { say.textContent = text; say.className = "say" + (kind ? " " + kind : ""); }

/* ---------- falling videos ---------- */
function nextItem() {
  if (!deck.length) deck = shuffle(VIDEOS);
  const onScreen = new Set(cards.map(c => c.item.id));
  let want = Math.random() < .58;
  if (badRun >= 2) want = true;
  if (goodRun >= 3) want = false;
  let i = deck.findIndex(v => v.good === want && !onScreen.has(v.id));
  if (i < 0) { deck = deck.concat(shuffle(VIDEOS.filter(v => v.good === want))); i = deck.findIndex(v => v.good === want && !onScreen.has(v.id)); }
  const item = deck.splice(i, 1)[0];
  badRun = item.good ? 0 : badRun + 1; goodRun = item.good ? goodRun + 1 : 0;
  return item;
}

const CARD_W = 150, CARD_H = 134;
const lanes = () => field.clientWidth >= 520 ? 3 : 2;

function place(c) {
  const n = lanes(), w = field.clientWidth / n, scale = Math.min(1, (w - 10) / CARD_W);
  c.lane = Math.min(c.lane, n - 1);
  const x = w * c.lane + (w - CARD_W) / 2 + Math.sin(c.y / 46 + c.phase) * Math.max(0, Math.min(12, (w - CARD_W) / 2));
  c.el.style.transform = `translate(${x}px, ${c.y}px) scale(${scale})`;
}

function addCard(item, lane, y) {
  const el = document.createElement("button");
  el.type = "button"; el.className = "video";
  el.setAttribute("aria-label", T.film(item.title));
  el.innerHTML = `<span class="thumb" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${PICS[item.pic]}</svg><svg class="play" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#fff"/><path d="M9 7l9 5-9 5z" fill="#0F172A"/></svg></span><span class="t">${item.title}</span>`;
  const card = {el, item, lane, y: y === undefined ? -CARD_H : y, phase: Math.random() * 6};
  el.addEventListener("pointerdown", e => { e.preventDefault(); pick(card); });
  el.addEventListener("click", e => { if (e.detail === 0) pick(card); });
  field.appendChild(el); cards.push(card); place(card);
}

function spawn() {
  const free = Array.from({length:lanes()}, (_, i) => i).filter(l => !cards.some(c => c.lane === l && c.y < 24));
  if (!free.length) return false;
  addCard(nextItem(), free[Math.floor(Math.random() * free.length)]);
  return true;
}

function removeCard(card, popped) {
  cards = cards.filter(c => c !== card);
  if (!popped) { card.el.remove(); return; }
  card.el.classList.add("pop");
  setTimeout(() => card.el.remove(), 320);
}

function throwSnack(card) {
  const app = $("chick").getBoundingClientRect(), from = card.el.getBoundingClientRect(), to = nestbox.getBoundingClientRect();
  const s = document.createElement("span");
  const kinds = ['<circle cx="22" cy="24" r="13" fill="#7C3AED"/><path d="M22 12q2-8 10-8-1 9-10 8" fill="#15803D"/>',
    '<ellipse cx="22" cy="22" rx="10" ry="16" fill="#FBBF24" stroke="#92400E" stroke-width="3" transform="rotate(35 22 22)"/>',
    '<circle cx="22" cy="22" r="14" fill="#DC2626"/><path d="M22 9q0-6 7-7" fill="none" stroke="#15803D" stroke-width="4" stroke-linecap="round"/>'];
  s.className = "snack";
  s.innerHTML = `<svg viewBox="0 0 44 44" aria-hidden="true">${kinds[food % 3]}</svg>`;
  $("chick").appendChild(s);
  const x0 = from.left - app.left + from.width / 2 - 22, y0 = from.top - app.top + 20;
  const x1 = to.left - app.left + to.width / 2 - 22, y1 = to.top - app.top + 50;
  if (s.animate) s.animate([{transform:`translate(${x0}px,${y0}px) scale(1.3)`},{transform:`translate(${(x0 + x1) / 2}px,${Math.min(y0, y1) - 40}px) scale(1.2)`},{transform:`translate(${x1}px,${y1}px) scale(.5)`}], {duration:480, easing:"ease-in", fill:"forwards"});
  setTimeout(() => s.remove(), 500);
}

function pick(card) {
  if (mode !== "play" || pending || !cards.includes(card)) return;
  const v = card.item;
  if (v.good) {
    if (worms.length) { tell(T.first, "bad"); tone([220], "square"); return; }
    throwSnack(card); removeCard(card, true);
    food++; drawHud(); drawNest("chew"); tone([523, 659, 784]);
    tell(`${T.yum} ${v.why}`, "good");
    if (food === GOAL || food === 5 || food === 10) pending = {t:1.4, to: food === GOAL ? "end" : "break"};
    return;
  }
  const lane = card.lane, y = card.y;
  removeCard(card, true);
  badSeen.set(v.id, v); slowFor = 3.5; tone([196, 147], "sawtooth");
  if (worms.length < 3) addWorm();
  drawNest("yuck");
  tell(`${T.yuck} ${v.why}`, "bad");
  // The endless trap: one video turns into two.
  if (v.id === "jeszcze") for (let i = 0; i < 2; i++) {
    const l = (lane + i) % lanes();
    let top = Math.min(y, 0);
    while (cards.some(c => c.lane === l && Math.abs(c.y - top) < CARD_H + 8)) top -= CARD_H + 8;
    addCard(v, l, top);
  }
}

function addWorm() {
  const used = worms.map(w => w.dataset.slot), slot = ["0","1","2"].find(s => !used.includes(s));
  const b = document.createElement("button");
  b.type = "button"; b.className = "worm w" + slot; b.dataset.slot = slot;
  b.setAttribute("aria-label", T.shooLabel);
  b.innerHTML = `<svg viewBox="0 0 76 64" aria-hidden="true"><g fill="#65A30D" stroke="#365314" stroke-width="2.500"><circle cx="14" cy="48" r="10"/><circle cx="27" cy="42" r="11"/><circle cx="39" cy="47" r="12"/><circle cx="54" cy="32" r="18"/></g><circle cx="48" cy="27" r="5" fill="#fff"/><circle cx="62" cy="27" r="5" fill="#fff"/><circle cx="49" cy="28" r="2.500" fill="#0F172A"/><circle cx="61" cy="28" r="2.500" fill="#0F172A"/><path d="M47 42q7-6 14 0M46 16l-5-10M62 16l5-10" fill="none" stroke="#365314" stroke-width="3" stroke-linecap="round"/></svg>`;
  b.addEventListener("pointerdown", e => { e.preventDefault(); shoo(b); });
  b.addEventListener("click", e => { if (e.detail === 0) shoo(b); });
  worms.push(b);
}

function shoo(b) {
  if (mode !== "play" || !worms.includes(b)) return;
  worms = worms.filter(w => w !== b);
  b.classList.add("shoo"); tone([392, 587]);
  setTimeout(() => { b.remove(); if (!worms.length && mode === "play") drawNest(); }, 520);
  tell(worms.length ? T.wormLeft : T.wormGone, worms.length ? "bad" : "good");
}

/* ---------- screens ---------- */
function openPanel(html, night) {
  $("chick").classList.remove("playing");
  panel.className = "panel" + (night ? " night" : "");
  panel.innerHTML = `<div>${html}</div>`;
  panel.hidden = false; panel.scrollTop = 0;
  [".hud","#field","#home"].forEach(q => document.querySelector(q).inert = true);
}
function closePanel() {
  panel.hidden = true; panel.innerHTML = "";
  [".hud","#field","#home"].forEach(q => document.querySelector(q).inert = false);
}
function clearField() { cards.forEach(c => c.el.remove()); cards = []; worms.forEach(w => w.remove()); worms = []; }

function reset() {
  if (cards) clearField();
  food = 0; cards = []; worms = []; badSeen = new Map(); skipped = 0; deck = shuffle(VIDEOS); badRun = 0; goodRun = 0; spawnIn = 0; slowFor = 0; pending = null;
  drawHud(); drawNest(); tell(T.tap);
}

function menu() {
  mode = "menu"; reset();
  openPanel(`
    <svg class="art" viewBox="0 0 360 156" aria-hidden="true">${NEST_BACK}<g transform="translate(180 90)">${bird(0)}</g>${NEST_FRONT}</svg>
    <h1>${T.title}</h1>
    <div class="box">
      <div class="how"><svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="26" r="15" fill="#7C3AED"/><path d="M24 12q2-9 12-9-1 10-12 9" fill="#15803D"/></svg><span>${T.how[0]}</span></div>
      <div class="how"><svg viewBox="0 0 76 64" aria-hidden="true"><g fill="#65A30D" stroke="#365314" stroke-width="2.500"><circle cx="16" cy="46" r="11"/><circle cx="32" cy="42" r="13"/><circle cx="52" cy="32" r="18"/></g><circle cx="46" cy="28" r="4" fill="#0F172A"/><circle cx="60" cy="28" r="4" fill="#0F172A"/></svg><span>${T.how[1]}</span></div>
      <div class="how"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M30 6a18 18 0 1 0 12 28A15 15 0 0 1 30 6z" fill="#FBBF24"/></svg><span>${T.how[2]}</span></div>
    </div>
    <div class="seg" role="group" aria-label="${T.tempo}"><button type="button" data-speed="calm" aria-pressed="${speed === "calm"}">${T.calm}</button><button type="button" data-speed="fast" aria-pressed="${speed === "fast"}">${T.fast}</button></div>
    <button type="button" class="c-btn" id="go">${T.go}</button>
    <p class="small">${T.parents}</p>`);
  panel.querySelectorAll("[data-speed]").forEach(b => b.onclick = () => { speed = b.dataset.speed; panel.querySelectorAll("[data-speed]").forEach(x => x.setAttribute("aria-pressed", String(x === b))); });
  $("go").onclick = () => { tone([523, 784]); play(); };
}

function play() { mode = "play"; closePanel(); $("chick").classList.add("playing"); $("chick").scrollIntoView({block:"start"}); }

function takeBreak() {
  mode = "break"; countdown = 10; clearField(); slowFor = 0; drawHud();
  openPanel(`
    <svg class="art" viewBox="0 0 360 156" aria-hidden="true"><path d="M52 14a24 24 0 1 0 18 38A20 20 0 0 1 52 14z" fill="#FBBF24"/><g class="zzz" fill="none" stroke="#F8F4ED" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M250 54h16l-16 18h16M282 24h12l-12 14h12"/></g>${NEST_BACK}<g transform="translate(180 92) scale(.95)">${bird(stageNow(), {sleep:true})}</g>${NEST_FRONT}</svg>
    <h1>${T.breakTitle}</h1>
    <p>${T.breakText}</p>
    <p class="count" id="count" aria-hidden="true">10</p>
    <button type="button" class="c-btn" id="resume" disabled>${T.sleeping}</button>`, true);
  $("resume").onclick = () => { reset_after_break(); play(); };
}
function reset_after_break() { spawnIn = 0; drawNest(); tell(T.woke(STAGES[stageNow()]), "good"); }

function pause() {
  if (mode !== "play") return;
  mode = "pause";
  openPanel(`<h1>${T.pauseTitle}</h1><p>${T.pauseText}</p><button type="button" class="c-btn" id="back">${T.back}</button><button type="button" class="c-btn second" id="quit">${T.quit}</button>`);
  $("back").onclick = play; $("quit").onclick = menu;
}

function end() {
  mode = "end"; clearField(); drawHud(); tone([523, 659, 784, 1047]);
  const talk = [...badSeen.values()];
  openPanel(`
    <svg class="art" viewBox="0 0 360 200" role="img" aria-label="${T.flies}"><g transform="translate(0 44)">${NEST_BACK}${NEST_FRONT}</g><g class="flyer"><g transform="translate(180 62)">${bird(2, {fly:true})}</g></g></svg>
    <h1>${T.done}</h1>
    <p>${T.doneText}${skipped ? ` ${T.skipped}: <strong>${skipped}</strong>.` : ""}</p>
    <div class="talk"><h2>${T.talkTitle}</h2><p><strong>${T.questions[Math.floor(Math.random() * T.questions.length)]}</strong></p></div>
    ${talk.length ? `<div class="box"><h2>${T.wormList}</h2><ul>${talk.map(v => `<li><strong>${v.title}</strong><br><span class="small">${v.why}</span></li>`).join("")}</ul></div>` : '<div class="box"><p><strong>${T.noWorm}</strong></p></div>'}
    <p><strong>${T.stop}</strong></p>
    <p class="small">${T.helpline}</p>
    <button type="button" class="c-btn second" id="again">${T.again}</button>`);
  $("again").onclick = menu;
}

/* ---------- game loop ---------- */
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000 || 0); last = now;
  if (mode === "play") {
    if (pending) {
      pending.t -= dt;
      if (pending.t <= 0) { const to = pending.to; pending = null; to === "end" ? end() : takeBreak(); }
    } else {
      slowFor = Math.max(0, slowFor - dt);
      const slow = slowFor ? .4 : 1, h = field.clientHeight;
      const fall = h / (speed === "calm" ? 8.5 : 5.8) * (1 + stageNow() * .12) * slow;
      spawnIn -= dt * slow;
      if (spawnIn <= 0 && spawn()) spawnIn = (speed === "calm" ? 2.1 : 1.4) - stageNow() * .15;
      for (const c of cards.slice()) {
        c.y += fall * dt;
        if (c.y > h) { if (!c.item.good) skipped++; removeCard(c); } else place(c);
      }
    }
  } else if (mode === "break" && countdown > 0) {
    countdown = Math.max(0, countdown - dt);
    $("count").textContent = Math.ceil(countdown);
    if (!countdown) { const b = $("resume"); b.disabled = false; b.textContent = T.wake; b.focus({preventScroll:true}); tone([659, 880]); }
  }
  requestAnimationFrame(frame);
}

$("pause").onclick = pause;
$("sound").onclick = () => { sound = !sound; drawSound(); tone([660]); };
document.addEventListener("visibilitychange", () => { if (document.hidden) pause(); });
drawSound(); menu(); requestAnimationFrame(frame);
})();
