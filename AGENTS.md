# Project guide for AI assistants and contributors

This file gives any coding assistant (GitHub Copilot, Claude, others) the context needed to work on the SafeNest OSS website. Humans may find it useful too.

## What this is

The website of **SafeNest OSS** (`safenest-oss` on GitHub): <https://safenest-oss.org>. SafeNest OSS builds small, open tools that protect children online (ages 5-18). The first tool is [No Shorts](https://github.com/safenest-oss/no-shorts). The main audience of the site is non-technical parents.

## Principles (do not break these)

- **Privacy first:** no cookies, no analytics, no third-party requests (fonts are self-hosted), no tracking pixels, no forms. Never add an external script, stylesheet, font, image or embed.
- **Transparency:** every claim about research needs a source link and a "what this does not prove" note. Call a correlation a correlation. Never invent or round up statistics; if you cannot verify a figure, leave it and say so in the pull request.
- **Safety and education:** teach, do not scare. Calm tone, plain language, honest limits.
- **Security by design:** keep the strict Content-Security-Policy `<meta>` in every page. No inline `<script>`, no inline `style=""` attributes, no `eval`.
- **Community first, trust before funding:** do not add sponsor, donation or funding content.
- **Language:** materials for parents are written in Polish first, then English. Keep EN and PL pages in step.

## Stack and layout

Plain static HTML, one CSS file and one small script. No build step, no framework, no dependencies. Served by GitHub Pages from `main`.

| Path | Content |
| --- | --- |
| `/index.html` | Organization hub (EN) |
| `/parents/` | Landing page for parents (EN) |
| `/pl/` | Landing page for parents (PL) |
| `/no-shorts/` | No Shorts project page (EN) |
| `/about/`, `/pl/o-nas/` | About: what, how, who (EN, PL) |
| `/guides/youtube-shorts-limit/`, `/pl/poradniki/limit-shorts-na-telefonie/` | Guide: Shorts limit on phones (EN, PL) |
| `/games/nest-guardian/`, `/pl/gry/straznik-gniazda/` | Children's game (EN, PL); `/assets/game.js` and `/assets/game.css`, language from `<html lang>` |
| `/games/feed-the-chick/`, `/pl/gry/nakarm-piskle/` | Feed the Chick game (EN, PL); `/assets/chick.js` and `/assets/chick.css` |
| `/assets/style.css`, `/assets/app.js` | Shared styles; simulator and calculator (language from `<html lang>`) |
| `/assets/fonts/` | Self-hosted Inter (SIL OFL, see `OFL-NOTICE.txt`) |
| `CNAME`, `robots.txt`, `sitemap.xml`, `404.html` | Hosting files. Add every new page to `sitemap.xml` |

Gotchas:
- The header and footer are repeated in every page. When you change navigation or the footer, change **all** pages (EN and PL).
- Every page needs `<title>`, `description`, `canonical`, Open Graph tags and, for EN/PL pairs, reciprocal `hreflang` links.
- Pages are served from the root of `safenest-oss.org`, so use root-relative links (`/assets/...`).
- Brand: blue `#2563EB`, amber accent, sand background, Inter, calm tone. Colors are CSS variables in `style.css`.
- Check accessibility: contrast, focus styles, `lang`, alt text, and that the page works at 390 px width without horizontal scroll.

## Testing

Open the pages locally (`python3 -m http.server`) and check at 1280 px and 390 px. The browser console must show no errors (a CSP violation counts as an error). Check the simulator and the calculator on `/parents/` and `/pl/`.

## Branching and releases

- `main` is what is published. `develop` is the integration branch. Branch from `develop` (`feat/<topic>`, `fix/<topic>`, `docs/<topic>`) and open a pull request into `develop`; squash merge.
- Release: pull request `develop` -> `main`, merged with a **merge commit** (never squash), so the two branches do not diverge.
- Conventional Commits in English, imperative mood.

## Conventions

- Authorship: commits are authored by the repository owner. AI assistants must not add themselves as author or add `Co-Authored-By` trailers.
- Keep pull requests small and focused; describe how you tested.
- Tasks and ideas are tracked as issues in [safenest-oss/no-shorts](https://github.com/safenest-oss/no-shorts/issues).
