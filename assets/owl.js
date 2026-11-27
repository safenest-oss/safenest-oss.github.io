/* Call the Owl / Zawołaj Sowę: a picture game for the youngest. A nice picture can be played with, a strange one means calling the Owl.
   No storage, no network requests. Language comes from <html lang>. */
(() => {
"use strict";
const lang = document.documentElement.lang === "pl" ? "pl" : "en";
// The sentences a child hears. Until there are recordings, a grown-up reads them aloud.
const TEXT = {
 pl: {
   czesc: "Cześć! To jest pisklę, a to mądra Sowa.",
   zasady: "Gdy obrazek jest miły, stuknij go. Gdy jest dziwny, zawołaj Sowę!",
   balon: "O, balonik!",
   kotek: "O, mały kotek!",
   pilka: "O, piłka!",
   przycisk: "Wielki przycisk! Miga i woła: kliknij mnie!",
   maska: "Ktoś w masce chce ci dać prezent.",
   sekret: "Ciii! To pudełko mówi, że ma sekret.",
   pobaw: "Pobawmy się! Stukaj!",
   razem: "Sowa też chce się pobawić!",
   brawo: "Brawo! Sowa już jest. Przy Sowie jest spokojnie.",
   dziwne: "Hmm, to jest dziwne. Zawołaj Sowę!",
   wieczor: "Idzie wieczór. Schowaj ekranik do pudełka.",
   lampka: "Teraz zgaś lampkę.",
   listek: "Przykryj pisklę listkiem.",
   dobranoc: "Dobranoc! Teraz ty też odłóż ekran i przytul kogoś bliskiego."
 },
 en: {
   czesc: "Hi! This is the chick, and this is the wise Owl.",
   zasady: "If a picture is nice, tap it. If it is strange, call the Owl!",
   balon: "Oh, a balloon!",
   kotek: "Oh, a little kitten!",
   pilka: "Oh, a ball!",
   przycisk: "A big button! It blinks and shouts: click me!",
   maska: "Someone in a mask wants to give you a present.",
   sekret: "Shh! This box says it has a secret.",
   pobaw: "Let’s play! Tap, tap!",
   razem: "The Owl wants to play too!",
   brawo: "Well done! The Owl is here. Everything is calm with the Owl.",
   dziwne: "Hmm, that is strange. Call the Owl!",
   wieczor: "Evening is coming. Put the little screen in the box.",
   lampka: "Now turn off the lamp.",
   listek: "Cover the chick with a leaf.",
   dobranoc: "Good night! Now you put the screen away too, and hug someone close to you."
 }
}[lang];
const T = {
 pl: {
  title: "Zawołaj Sowę", go: "Gramy", read: "Rodzicu, przeczytaj na głos:", soundOn: "Dźwięk włączony", soundOff: "Dźwięk wyłączony",
  call: "Zawołaj Sowę", picture: n => `Obrazek: ${n}`, play: n => `Pobaw się: ${n}`,
  stow: "Schowaj ekranik do pudełka", lamp: "Zgaś lampkę", leaf: "Przykryj pisklę listkiem", again: "Od nowa",
  names: {balon:"balonik",kotek:"kotek",pilka:"piłka",przycisk:"migający przycisk",maska:"ktoś w masce z prezentem",sekret:"zamknięte pudełko z sekretem"},
  parents: "Dla rodziców: gra dla dzieci w wieku około 5–6 lat, na pierwszy raz razem. Nie zbiera i nie zapisuje danych.",
  recorded: "Głos wygenerowany w elevenlabs.io. Nie słychać? Sprawdź głośność i tryb cichy.", silent: "Na razie bez nagrań: czytaj na głos tekst pod obrazkiem."
 },
 en: {
  title: "Call the Owl", go: "Play", read: "Grown-up, read this aloud:", soundOn: "Sound on", soundOff: "Sound off",
  call: "Call the Owl", picture: n => `Picture: ${n}`, play: n => `Play with: ${n}`,
  stow: "Put the little screen in the box", lamp: "Turn off the lamp", leaf: "Cover the chick with a leaf", again: "Start again",
  names: {balon:"balloon",kotek:"kitten",pilka:"ball",przycisk:"blinking button",maska:"someone in a mask with a present",sekret:"closed box with a secret"},
  parents: "For parents: a game for children aged about 5–6, best played together the first time. It does not collect or save any data.",
  recorded: "Voice generated with elevenlabs.io. No sound? Check the volume and silent mode.", silent: "There are no recordings yet: read the text under the picture aloud."
 }
}[lang];
const VOICE = {};   // recordings as base64, by sentence id; empty = a grown-up reads the text

const NICE = ["balon","kotek","pilka"], ODD = ["przycisk","maska","sekret"];
const $ = id => document.getElementById(id);
const root = $("owlgame");
if (!root) return;
const stage = $("stage");

let sound = true, ctx = null, source = null, run = 0, timers = [], spoken = [], order = [], step = 0, phase = "start", item = null, taps = 0, idleTimer = null;

/* ---------- timers and sound ---------- */
function later(fn, ms) { const r = run; timers.push(setTimeout(() => { if (r === run) fn(); }, ms)); }
function audio() {
  try { const AC = window.AudioContext || window.webkitAudioContext; ctx = ctx || new AC(); if (ctx.state === "suspended") ctx.resume(); } catch (e) { ctx = null; }
  return ctx;
}
function tone(freqs, type) {
  if (!sound || !audio()) return;
  freqs.forEach((f, i) => {
    const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + i * .09;
    o.type = type || "sine"; o.frequency.value = f;
    g.gain.setValueAtTime(.08, t); g.gain.exponentialRampToValueAtTime(.001, t + .14);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + .15);
  });
}
const buffers = {};
function decode(id) {
  if (!buffers[id]) {
    const bytes = Uint8Array.from(atob(VOICE[id]), c => c.charCodeAt(0));
    buffers[id] = new Promise((ok, no) => ctx.decodeAudioData(bytes.buffer, ok, no));
  }
  return buffers[id];
}
let talk = 0;
function hush() { talk++; if (source) { try { source.stop(); } catch (e) {} source = null; } }
function caption(id, show) {
  const c = $("caption"); c.hidden = !show;
  if (show) c.innerHTML = `<small>${T.read}</small><span>${TEXT[id]}</span>`;
}
// Says the sentences in order, then calls done. Without a recording it shows the text and leaves time to read it.
function say(ids, done) {
  hush(); spoken = ids.slice();
  const mine = talk, r = run;
  const next = i => {
    if (mine !== talk || r !== run) return;
    if (i >= ids.length) { if (done) done(); return; }
    const id = ids[i];
    let moved = false;
    const go = () => { if (!moved && mine === talk && r === run) { moved = true; next(i + 1); } };
    const silent = () => { caption(id, true); later(go, 900 + TEXT[id].length * 55); };
    if (!VOICE[id] || !sound || !audio()) { silent(); return; }
    caption(id, false);
    decode(id).then(buf => {
      if (mine !== talk || r !== run) return;
      source = ctx.createBufferSource(); source.buffer = buf; source.connect(ctx.destination);
      source.onended = go; source.start();
      later(go, buf.duration * 1000 + 800);
    }, silent);
  };
  next(0);
}
function drawMute() {
  const b = $("mute");
  b.setAttribute("aria-pressed", String(sound));
  b.setAttribute("aria-label", sound ? T.soundOn : T.soundOff);
  b.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/>${sound ? '<path d="M17 9q2 3 0 6M20 7q4 5 0 10"/>' : '<path d="M17 9l5 6M22 9l-5 6"/>'}</svg>`;
}

/* ---------- drawings ---------- */
const eyesOpen = (dx, y, r) => `<circle cx="${-dx}" cy="${y}" r="${r}" fill="#0F172A"/><circle cx="${dx}" cy="${y}" r="${r}" fill="#0F172A"/><circle cx="${-dx + r / 3}" cy="${y - r / 3}" r="${r / 3}" fill="#fff"/><circle cx="${dx + r / 3}" cy="${y - r / 3}" r="${r / 3}" fill="#fff"/>`;
const chick = sleep => `<circle r="36" fill="#FBBF24"/><ellipse cy="16" rx="22" ry="16" fill="#FDE68A"/>
  <path d="M-4 -35q-3-14 6-18M3 -35q5-12 15-11" fill="none" stroke="#F59E0B" stroke-width="5" stroke-linecap="round"/>
  ${sleep ? '<path d="M-19 -9q7 7 14 0M5 -9q7 7 14 0" fill="none" stroke="#0F172A" stroke-width="3.500" stroke-linecap="round"/>' : eyesOpen(12, -9, 6)}
  <path d="M-10 4L0 -4L10 4L0 15Z" fill="#EA580C"/>`;
const nest = `<ellipse cx="0" cy="22" rx="105" ry="22" fill="#6B4320"/>`;
const nestFront = `<path d="M-108 18Q0 52 108 18Q95 62 0 62T-108 18Z" fill="#8A5A2B"/>` +
  ["M-112 24Q-24 66 100 16","M-98 16Q-4 60 114 26","M-94 44Q0 26 96 50","M-82 54Q10 32 106 32","M-106 36Q-34 70 74 58"]
  .map((d, i) => `<path d="${d}" fill="none" stroke="${i % 2 ? "#C08B52" : "#A06C38"}" stroke-width="7" stroke-linecap="round"/>`).join("");
/* The Owl, drawn for this game. Two poses: sitting (owl) and with spread wings (flyingOwl). */
const PALETTE = "magiczna";   // or "brazowa" (brown)
const PALETTES = {
  magiczna: { line:"#3B2377", body:["#B79CF2","#7C55CF"], plume:["#F9A8DC","#E263BE","#8E5FDB","#5BB8F2"], tuft:["#7C3AED","#EC72C4"], iris:["#312E81","#4F46E5","#67E8F9"], face:["#FFFDF8","#FBE8DA"] },
  brazowa:  { line:"#4A2A1C", body:["#C69A7C","#8A5B43"], plume:["#EBC9A6","#C89470","#9C6A50","#704536"], tuft:["#6F4433","#BE8C6B"], iris:["#172554","#1D4ED8","#7DD3FC"], face:["#FFFCF4","#F8E4CC"] }
};
const C = PALETTES[PALETTE];
const stops = list => list.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("");
$("paint").innerHTML = `
  <radialGradient id="ow-plume" gradientUnits="userSpaceOnUse" cx="0" cy="-8" r="165">${stops([[.18,C.plume[0]],[.42,C.plume[1]],[.68,C.plume[2]],[.95,C.plume[3]]])}</radialGradient>
  <linearGradient id="ow-coat" x1="0" y1="0" x2="0" y2="1">${stops([[0,C.body[0]],[1,C.body[1]]])}</linearGradient>
  <linearGradient id="ow-tuft" x1="0" y1="1" x2="0" y2="0">${stops([[0,C.tuft[1]],[1,C.tuft[0]]])}</linearGradient>
  <radialGradient id="ow-face" cx=".5" cy=".4" r=".65">${stops([[.4,C.face[0]],[1,C.face[1]]])}</radialGradient>
  <radialGradient id="ow-iris" cx=".5" cy=".62" r=".6">${stops([[.25,C.iris[0]],[.65,C.iris[1]],[1,C.iris[2]]])}</radialGradient>
  <linearGradient id="ow-gold" x1="0" y1="0" x2="0" y2="1">${stops([[0,"#FDE68A"],[.45,"#FBBF24"],[1,"#EA7A0C"]])}</linearGradient>`;

// a feather from root (x,y) to tip (tx,ty), width w, with a light shaft
function plume(x, y, tx, ty, w, fill = "url(#ow-plume)", light = 0) {
  const dx = tx - x, dy = ty - y, l = Math.hypot(dx, dy), nx = -dy / l * w / 2, ny = dx / l * w / 2;
  const q = (t, k) => `${(x + dx * t + nx * k).toFixed(1)} ${(y + dy * t + ny * k).toFixed(1)}`;
  const d = `M${x} ${y}C${q(.25, 1.25)} ${q(.92, 1.15)} ${tx} ${ty}C${q(.92, -1.15)} ${q(.25, -1.25)} ${x} ${y}Z`;
  return `<path d="${d}" fill="${fill}" stroke="${C.line}" stroke-width="1.600" stroke-linejoin="round"/>`
    + (light ? `<path d="${d}" fill="#fff" opacity="${light}"/>` : "")
    + `<path d="M${q(.3, 0)}Q${q(.6, .18)} ${q(.86, 0)}" fill="none" stroke="#fff" stroke-width="1.400" stroke-linecap="round" opacity=".55"/>`;
}
const star = (x, y, r, fill, delay) => `<path class="twinkle d${delay}" d="M${x} ${y - r}Q${x + r * .18} ${y - r * .18} ${x + r} ${y}Q${x + r * .18} ${y + r * .18} ${x} ${y + r}Q${x - r * .18} ${y + r * .18} ${x - r} ${y}Q${x - r * .18} ${y - r * .18} ${x} ${y - r}Z" fill="${fill}"/>`;
const BODY = "M0 -54C26 -57 52 -44 57 -20L66 -13L58 -7L65 3L56 8C56 42 34 63 0 63C-34 63 -56 42 -56 8L-65 3L-58 -7L-66 -13L-57 -20C-52 -44 -26 -57 0 -54Z";
const tufts = [1,-1].map(k => `<g transform="scale(${k} 1)">${plume(26,-40, 66,-74, 20, "url(#ow-tuft)")}${plume(20,-42, 48,-82, 18, "url(#ow-tuft)")}${plume(16,-44, 30,-70, 14, "url(#ow-tuft)", .15)}</g>`).join("");
const eye = k => `<g transform="translate(${k * 22} -12)"><circle r="20" fill="url(#ow-iris)" stroke="${C.line}" stroke-width="2.500"/><circle cy="1" r="11.500" fill="#12102E"/>
  <circle cx="-6" cy="-7" r="6" fill="#fff"/><circle cx="7" cy="7" r="2.800" fill="#fff"/><circle cx="-7" cy="8" r="1.400" fill="#fff" opacity=".8"/>
  <path transform="scale(${k} 1)" d="M-17 -13Q0 -27 18 -11M16 -13l9 -6M19 -8l9 -2" fill="none" stroke="${C.line}" stroke-width="3" stroke-linecap="round"/></g>`;
const feet = [-1,1].map(k => `<g transform="translate(${k * 17} 63)" fill="url(#ow-gold)" stroke="#9A4B0A" stroke-width="1.600"><ellipse cx="-8" cy="2" rx="5" ry="7.500" transform="rotate(25 -8 2)"/><ellipse cx="8" cy="2" rx="5" ry="7.500" transform="rotate(-25 8 2)"/><ellipse cy="4" rx="5.500" ry="8"/></g>`).join("");
const body = `<path d="${BODY}" fill="url(#ow-coat)" stroke="${C.line}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M-34 24Q-42 52 -14 60Q0 64 14 60Q42 52 34 24Q18 38 0 28Q-18 38 -34 24Z" fill="url(#ow-face)"/>
  <path d="M-24 40q6 8 12 0q6 8 12 0q6 8 12 0q6 8 12 0M-12 51q6 7 12 0q6 7 12 0" fill="none" stroke="${C.body[1]}" stroke-width="2" stroke-linecap="round" opacity=".55"/>
  <path d="M0 -29C9 -47 52 -47 52 -12C52 18 26 32 0 32C-26 32 -52 18 -52 -12C-52 -47 -9 -47 0 -29Z" fill="url(#ow-face)"/>
  ${eye(-1)}${eye(1)}
  <g fill="#F472B6" opacity=".4"><ellipse cx="-35" cy="13" rx="9" ry="5"/><ellipse cx="35" cy="13" rx="9" ry="5"/></g>
  <path d="M-9 4Q0 -3 9 4Q7 14 0 19Q-7 14 -9 4Z" fill="url(#ow-gold)" stroke="#9A4B0A" stroke-width="1.800" stroke-linejoin="round"/><ellipse cx="-3" cy="5" rx="2.600" ry="1.600" fill="#fff" opacity=".8"/>
  ${star(0, -44, 6, "#fff", 0)}`;
const folded = [1,-1].map(k => `<g transform="scale(${k} 1)">${plume(55,0, 66,48, 22)}${plume(51,8, 49,60, 20)}${plume(55,-2, 62,32, 18, "url(#ow-plume)", .18)}</g>`).join("");
const owl = tufts + body + folded + feet;

// a spread wing: three layers of feathers, long to short
const WING = [[70,-52,126,-108,24],[76,-48,147,-86,26],[76,-42,151,-56,27],[72,-34,150,-24,28],[66,-24,141,8,29],[56,-14,124,38,29],[46,-4,104,62,29],[36,4,80,78,29],[26,10,54,90,29],[16,14,28,94,28]];
const layerOf = (k, w, light) => WING.map(([x,y,tx,ty,wd]) => plume(x, y, +(x + (tx - x) * k).toFixed(1), +(y + (ty - y) * k).toFixed(1), wd * w, "url(#ow-plume)", light)).join("");
const wing = layerOf(1, 1, 0) + layerOf(.64, .92, .1)
  + `<path d="M22 -22C46 -34 54 -62 82 -62C96 -58 86 -30 66 -10C50 6 30 14 20 12Z" fill="url(#ow-plume)"/>` + layerOf(.34, .75, .24);
const tail = [[-18,40,-52,100,26],[18,40,52,100,26],[-9,44,-26,112,26],[9,44,26,112,26],[0,44,0,116,28]].map(f => plume(...f)).join("");
const sparkles = [[-132,-100,9,"#F472B6",1],[-96,-84,6,"#818CF8",2],[-48,-100,7,"#FBBF24",0],[52,-104,8,"#38BDF8",2],[98,-88,5,"#F472B6",0],[-150,40,7,"#38BDF8",0],[150,42,9,"#F472B6",1],[-104,94,6,"#FBBF24",2],[106,94,7,"#818CF8",1]].map(a => star(...a)).join("");
const flyingOwl = `<g class="spread origin"><g>${wing}</g><g transform="scale(-1 1)">${wing}</g></g>${tail}${tufts}${body}${feet}${sparkles}`;

const ART = {
  balon:`<path d="M0 38q-12 14 3 26t-2 24" fill="none" stroke="#57534E" stroke-width="3"/><ellipse cy="-14" rx="46" ry="54" fill="#DC2626"/><path d="M-9 40h18l-9-9z" fill="#DC2626"/><ellipse cx="-17" cy="-36" rx="9" ry="16" fill="#FCA5A5" transform="rotate(30 -17 -36)"/>`,
  kotek:`<path d="M-50 -22L-46 -62L-18 -42Q0 -48 18 -42L46 -62L50 -22Q60 40 0 48T-50 -22Z" fill="#F59E0B"/>${eyesOpen(20, -8, 8)}<path d="M-8 8h16l-8 9zM0 17q-6 12-16 6M0 17q6 12 16 6M-28 12l-32-6M-28 20l-30 8M28 12l32-6M28 20l30 8" fill="#7C2D12" stroke="#7C2D12" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill-opacity=".9"/>`,
  pilka:`<ellipse cy="64" rx="40" ry="7" fill="#0F172A" opacity=".12"/><path d="M-13.0 -17.0Q-2.4 -44.2 26.3 -49.4A56 56 0 0 1 55.5 -7.8Q23.8 -31.6 -13.0 -17.0Z" fill="#DC2626"/><path d="M-13.0 -17.0Q23.8 -31.6 55.5 -7.8A56 56 0 0 1 42.9 36.0Q29.8 -6.2 -13.0 -17.0Z" fill="#FBBF24"/><path d="M-13.0 -17.0Q29.8 -6.2 42.9 36.0A56 56 0 0 1 2.0 56.0Q14.9 15.3 -13.0 -17.0Z" fill="#16A34A"/><path d="M-13.0 -17.0Q14.9 15.3 2.0 56.0A56 56 0 0 1 -44.1 34.5Q-14.2 17.5 -13.0 -17.0Z" fill="#FFFFFF"/><path d="M-13.0 -17.0Q-14.2 17.5 -44.1 34.5A56 56 0 0 1 -45.9 -32.1Q-33.7 -15.4 -13.0 -17.0Z" fill="#2563EB"/><path d="M-13.0 -17.0Q-33.7 -15.4 -45.9 -32.1A56 56 0 0 1 26.3 -49.4Q-2.4 -44.2 -13.0 -17.0Z" fill="#F97316"/><path d="M50 -24A56 56 0 0 1 -30 47Q30 40 50 -24Z" fill="#0F172A" opacity=".12"/><circle r="56" fill="none" stroke="#0F172A" stroke-width="3"/><circle cx="-13" cy="-17" r="8" fill="#fff" stroke="#0F172A" stroke-width="2.500"/><ellipse cx="-31" cy="-27" rx="7" ry="13" fill="#fff" opacity=".75" transform="rotate(42 -31 -27)"/>`,
  przycisk:`<g class="blink"><path d="M0 -76v16M54 -54l-12 12M-54 -54l12 12M76 0h-16M-76 0h16M54 54l-12-12M-54 54l12-12" stroke="#F59E0B" stroke-width="8" stroke-linecap="round"/></g><circle r="50" fill="#7C3AED"/><circle r="36" fill="#A78BFA"/><path d="M-6 -24v30l-8-8q-8-2-6 7l16 20h22q8-12 6-28q-10-8-22-6v-15q-4-8-8 0z" fill="#fff" stroke="#4C1D95" stroke-width="3" stroke-linejoin="round"/>`,
  maska:`<path d="M-46 62Q-56 -50 -10 -58Q34 -56 28 62Z" fill="#64748B"/><path d="M-44 -22Q-10 -38 26 -22Q22 2 0 -2Q-10 -12 -20 -2Q-42 2 -44 -22Z" fill="#0F172A"/><circle cx="-24" cy="-17" r="5" fill="#fff"/><circle cx="6" cy="-17" r="5" fill="#fff"/><path d="M-22 18q13 10 26 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/><rect x="18" y="12" width="54" height="46" rx="6" fill="#DC2626"/><path d="M45 12v46M18 30h54M45 12q-24-20-14-2M45 12q24-20 14-2" fill="none" stroke="#FDE68A" stroke-width="6" stroke-linecap="round"/>`,
  sekret:`<rect x="-56" y="-14" width="112" height="68" rx="10" fill="#9D6B3F"/><rect x="-50" y="-38" width="100" height="26" fill="#1E1B2E"/><circle cx="-15" cy="-25" r="9" fill="#fff"/><circle cx="15" cy="-25" r="9" fill="#fff"/><circle cx="-12" cy="-24" r="4" fill="#0F172A"/><circle cx="18" cy="-24" r="4" fill="#0F172A"/><path d="M-60 -36Q0 -82 60 -36Z" fill="#7C4F2A"/><rect x="-18" y="8" width="36" height="30" rx="6" fill="#FBBF24"/><path d="M-9 8v-8a9 9 0 0 1 18 0v8" fill="none" stroke="#FBBF24" stroke-width="6"/><circle cy="22" r="5" fill="#7C2D12"/>`
};
const NAMES = T.names;
const TABLET = `<rect x="-118" y="-112" width="236" height="224" rx="26" fill="#1E3A8A"/><rect x="-102" y="-96" width="204" height="192" rx="14" fill="#fff"/>`;

/* ---------- scene ---------- */
const at = (x, y, s = 1) => `translate(${x}px, ${y}px) scale(${s})`;
function node(id) { return stage.querySelector("#" + id); }
function place(el, x, y, s) { el.style.transform = at(x, y, s); el.dataset.x = x; el.dataset.y = y; el.dataset.s = s || 1; }
function layer(id, x, y, inner, s) { return `<g id="${id}" class="move" data-x="${x}" data-y="${y}" data-s="${s || 1}">${inner}</g>`; }
function applyPlaces() { stage.querySelectorAll("[data-x]").forEach(el => el.style.transform = at(+el.dataset.x, +el.dataset.y, +el.dataset.s)); }
function button(el, label, fn, onRelease) {
  el.classList.add("tap"); el.setAttribute("role", "button"); el.setAttribute("tabindex", "0"); el.setAttribute("aria-label", label);
  el.onpointerdown = onRelease ? null : e => { e.preventDefault(); fn(); };
  el.onclick = onRelease ? fn : null;
  el.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(); } };
}
function unbutton(el) { el.classList.remove("tap","hint"); el.removeAttribute("role"); el.removeAttribute("tabindex"); el.onpointerdown = el.onclick = el.onkeydown = null; }
function dots() { $("dots").innerHTML = phase === "start" ? "" : Array.from({length:6}, (_, i) => `<i class="${i < step ? "on" : ""}"></i>`).join(""); }

function reset() { run++; hush(); timers.forEach(clearTimeout); timers = []; clearTimeout(idleTimer); $("caption").hidden = true; root.classList.remove("night", "playing"); }

function startScreen() {
  reset(); phase = "start"; step = 0; dots();
  $("repeat").disabled = true;
  stage.setAttribute("aria-label", T.title);
  stage.innerHTML = `
    ${layer("o", 180, 140, `<g class="idle">${owl}</g>`, 1.5)}
    ${layer("n", 180, 340, `${nest}<g transform="translate(0 -6) scale(1.1)">${chick()}</g>${nestFront}`)}
    ${layer("go", 180, 505, `<circle r="62" fill="#2563EB"/><path d="M-18 -28L32 0L-18 28Z" fill="#fff"/><circle class="ring" r="74"/>`)}`;
  applyPlaces(); node("go").classList.add("hint"); button(node("go"), T.go, begin, true);
  const recorded = Object.keys(VOICE).length;
  $("parents").hidden = false;
  $("parents").textContent = `${T.parents} ${recorded ? T.recorded : T.silent}`;
}

function begin() {
  audio(); tone([523, 784]); reset();
  root.classList.add("playing"); root.scrollIntoView({block:"start"});
  const nice = shuffle(NICE), odd = shuffle(ODD);
  order = [nice[0], odd[0], nice[1], odd[1], odd[2], nice[2]]; step = 0; phase = "intro";
  $("parents").hidden = true; $("repeat").disabled = false; dots();
  stage.innerHTML = `
    ${layer("tablet", 180, 130, `${TABLET}<g id="picture"></g><circle class="ring" r="128"/>`)}
    ${layer("nest", 180, 330, `${nest}<g transform="translate(0 -6)"><g id="bird" class="origin">${chick()}</g></g>${nestFront}`)}
    ${layer("owl", 180, 500, `<circle r="92" fill="#fff" stroke="#E6DDCF" stroke-width="4"/><g class="face" id="owlface">${owl}</g><circle class="ring" r="103"/>`)}
    <g id="toy"></g><g id="helper"></g>`;
  applyPlaces();
  say(["czesc","zasady"], show);
}

const shuffle = list => { const a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

function idle() {
  clearTimeout(idleTimer); const r = run;
  idleTimer = setTimeout(() => {
    if (r !== run || (phase !== "choose" && phase !== "owlOnly")) return;
    if (phase === "owlOnly") say(["dziwne"]); else say([item]);
    idle();
  }, 11000);
}

function show() {
  if (step >= order.length) { evening(); return; }
  item = order[step]; phase = "wait";
  node("helper").innerHTML = ""; node("toy").innerHTML = ""; node("owlface").style.opacity = 1; node("tablet").style.opacity = 1;
  node("picture").innerHTML = `<g class="pop-in origin">${ART[item]}</g>`;
  button(node("tablet"), T.picture(NAMES[item]), tapPicture);
  button(node("owl"), T.call, callOwl);
  tone([440, 554]);
  say([item]);
  // a short moment, so the previous tap does not answer straight away
  later(() => { phase = "choose"; idle(); }, 700);
}

function tapPicture() {
  if (phase !== "choose") return;
  if (NICE.includes(item)) { startPlay(false); return; }
  phase = "wait"; unbutton(node("tablet")); node("owl").classList.add("hint"); tone([330, 262]);
  say(["dziwne"]);
  later(() => { phase = "owlOnly"; idle(); }, 500);
}

function callOwl() {
  if (phase !== "choose" && phase !== "owlOnly") return;
  clearTimeout(idleTimer); node("owl").classList.remove("hint");
  tone([392, 523, 392], "triangle");
  if (NICE.includes(item)) { startPlay(true); return; }
  phase = "wait"; unbutton(node("tablet")); unbutton(node("owl"));
  // the Owl flies in, spreads its wings and covers the screen
  node("helper").innerHTML = layer("big", 180, 500, flyingOwl);
  applyPlaces(); node("owlface").style.opacity = 0;
  later(() => place(node("big"), 180, 116, 1.12), 40);
  later(() => { node("tablet").style.opacity = 0; }, 750);   // the screen disappears behind the wings
  later(() => node("bird").classList.add("hop"), 900);
  say(["brawo"], () => later(() => finishStep(), 600));
}

function startPlay(withOwl) {
  clearTimeout(idleTimer); phase = "play"; taps = 0;
  unbutton(node("tablet")); unbutton(node("owl")); node("picture").innerHTML = "";
  node("toy").innerHTML = layer("t", 180, 130, `<g id="tin" class="origin">${ART[item]}</g><circle class="ring" r="86"/>`);
  if (withOwl) { node("helper").innerHTML = layer("big", 180, 500, `<g class="idle">${owl}</g>`); node("owlface").style.opacity = 0; }
  applyPlaces();
  const toy = node("t");
  later(() => { place(toy, 180, 205, 1.2); if (withOwl) place(node("big"), 58, 458, .85); }, 40);
  say([withOwl ? "razem" : "pobaw"]);
  button(toy, T.play(NAMES[item]), playTap);
  toy.classList.add("hint");
}

const SPOTS = [[95,150],[262,235],[178,175]];
function playTap() {
  if (phase !== "play") return;
  const toy = node("t"), inner = node("tin");
  toy.classList.remove("hint"); inner.classList.remove("hop"); inner.getBoundingClientRect(); inner.classList.add("hop");
  node("bird").classList.remove("hop"); node("bird").getBoundingClientRect(); node("bird").classList.add("hop");
  tone([[523,659],[587,740],[659,880]][taps % 3], item === "kotek" ? "triangle" : "sine");
  taps++;
  if (taps < 3) { place(toy, SPOTS[taps - 1][0], SPOTS[taps - 1][1], 1.15); return; }
  phase = "wait"; unbutton(toy);
  place(toy, SPOTS[2][0], SPOTS[2][1], 1.35);
  later(() => finishStep(), 900);
}

function finishStep() {
  step++; dots(); tone([523, 659, 784]);
  node("bird").classList.remove("hop");
  later(show, 700);
}

/* ---------- evening: three calm tasks, then the end ---------- */
function evening() {
  phase = "evening"; clearTimeout(idleTimer); root.classList.add("night");
  $("parents").hidden = true;
  stage.innerHTML = `
    <path d="M318 20a26 26 0 1 0 22 40a21 21 0 0 1-22-40z" fill="#FBBF24"/>
    <g fill="#F8F4ED"><circle cx="40" cy="40" r="3"/><circle cx="110" cy="18" r="2"/><circle cx="250" cy="76" r="2.500"/><circle cx="24" cy="150" r="2"/></g>
    ${layer("nest", 180, 300, `${nest}<g transform="translate(0 -6)" id="birdpos">${chick()}</g>${nestFront}<circle class="ring" r="90"/>`)}
    ${layer("box", 82, 515, `<rect x="-66" y="-34" width="132" height="86" rx="12" fill="#9D6B3F"/><rect x="-74" y="-48" width="148" height="22" rx="8" fill="#7C4F2A"/><circle class="ring" r="88"/>`)}
    ${layer("lamp", 300, 190, `<circle id="glow" r="62" fill="#FDE68A" opacity=".35"/><path d="M-28 4L-18 -32H18L28 4Z" fill="#FBBF24" id="shade"/><path d="M0 4v44M-18 50h36" stroke="#C08B52" stroke-width="7" stroke-linecap="round"/><circle class="ring" r="62"/>`)}
    ${layer("leaf", 280, 520, `<path d="M-62 6Q-34 -52 62 -28Q40 46 -62 6Z" fill="#16A34A"/><path d="M-60 6Q0 -4 52 -24" fill="none" stroke="#14532D" stroke-width="5" stroke-linecap="round"/><circle class="ring" r="76"/>`)}
    ${layer("tab", 180, 105, `<g transform="scale(.46)">${TABLET}</g><circle class="ring" r="72"/>`)}`;
  applyPlaces();
  say(["wieczor"]);
  drag("tab", T.stow, 82, 500, () => {
    const t = node("tab"); place(t, 82, 505, .3); tone([392, 330]);
    later(() => { t.style.opacity = 0; }, 700);
    later(lampStep, 1100);
  });
}
function lampStep() {
  say(["lampka"]);
  const lamp = node("lamp"); lamp.classList.add("hint");
  button(lamp, T.lamp, () => {
    unbutton(lamp); node("glow").setAttribute("opacity", "0"); node("shade").setAttribute("fill", "#64748B"); tone([262]);
    later(leafStep, 900);
  });
}
function leafStep() {
  say(["listek"]);
  drag("leaf", T.leaf, 180, 335, () => {
    const leaf = node("leaf"); place(leaf, 182, 380, 1.3);
    node("birdpos").innerHTML = chick(true); tone([523, 392, 330, 262]);
    later(goodNight, 900);
  });
}
function goodNight() {
  phase = "end"; root.classList.remove("playing");
  stage.insertAdjacentHTML("beforeend", `<g class="zzz" fill="none" stroke="#F8F4ED" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M78 250h22l-22 24h22M52 202h16l-16 18h16"/></g>`);
  say(["dobranoc"], () => later(() => {
    stage.insertAdjacentHTML("beforeend", layer("again", 245, 535, `<circle r="30" fill="#16294F" stroke="#A9C4FF" stroke-width="3"/><path d="M-11 0a11 11 0 1 0 4-9M-7 -17v8h8" fill="none" stroke="#F8F4ED" stroke-width="3.500" stroke-linecap="round" stroke-linejoin="round"/><circle class="ring" r="38"/>`));
    applyPlaces(); button(node("again"), T.again, startScreen, true);
  }, 5000));
}

// Dragging for small hands: dropping near the target is enough, and so is a single tap.
function drag(id, label, tx, ty, done) {
  const el = node(id); el.classList.add("hint");
  stage.appendChild(el);
  let start = null, finished = false;
  const home = [+el.dataset.x, +el.dataset.y];
  const point = e => { const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(stage.getScreenCTM().inverse()); return [p.x, p.y]; };
  const finish = () => { if (finished) return; finished = true; el.classList.remove("drag"); unbutton(el); el.onpointermove = el.onpointerup = el.onpointercancel = null; done(); };
  const back = () => { start = null; el.classList.remove("drag"); place(el, home[0], home[1], +el.dataset.s); el.classList.add("hint"); };
  const moved = p => Math.hypot(p[0] - start[0], p[1] - start[1]) > 14;
  button(el, label, () => {});
  el.onpointerdown = e => { e.preventDefault(); start = point(e); try { el.setPointerCapture(e.pointerId); } catch (err) {} el.classList.remove("hint"); };
  // the object follows the finger, so it can be grabbed anywhere
  el.onpointermove = e => { if (!start) return; const p = point(e); if (!moved(p)) return; el.classList.add("drag"); el.style.transform = at(p[0], p[1], +el.dataset.s); };
  el.onpointerup = e => {
    if (!start) return;
    const p = point(e);
    if (!moved(p) || Math.hypot(p[0] - tx, p[1] - ty) < 120) { start = null; finish(); } else back();
  };
  el.onpointercancel = () => { if (start) back(); };
  el.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); finish(); } };
}

$("repeat").onclick = () => { if (phase !== "start" && spoken.length && (phase === "choose" || phase === "owlOnly" || phase === "play" || phase === "evening")) say([spoken[spoken.length - 1]]); };
// browsers resume sound only after a touch
document.addEventListener("pointerup", () => { if (ctx && ctx.state === "suspended") ctx.resume(); });
$("mute").onclick = () => {
  sound = !sound; drawMute();
  if (!sound && source) { try { source.stop(); } catch (e) {} }
  if (sound) tone([660]);
};
document.addEventListener("visibilitychange", () => { if (document.hidden && ctx) ctx.suspend(); else if (ctx) ctx.resume(); });
drawMute(); startScreen();
})();
