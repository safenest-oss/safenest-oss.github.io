# safenest-oss.github.io

Source of the SafeNest OSS website: <https://safenest-oss.org>

- `/` English (default), `/pl/` Polish (mirrored paths). `safenest-oss.pl` redirects to `safenest-oss.org/pl/`.
- Plain static HTML, CSS and one small script. No build step, no frameworks, no analytics, no cookies, no third-party requests (Inter is self-hosted, see `assets/fonts/OFL-NOTICE.txt`).
- A strict Content-Security-Policy is set in every page (`<meta http-equiv>`); keep pages free of inline scripts and inline `style=""` attributes.

## Structure

| Path | Content |
| --- | --- |
| `/` | Organization hub (EN) |
| `/no-shorts/` | No Shorts project page (EN) |
| `/guides/youtube-shorts-limit/` | Guide: Shorts limit on phones (EN) |
| `/pl/` | Landing page for parents (PL) |
| `/pl/poradniki/limit-shorts-na-telefonie/` | Guide (PL) |

## Contributing

Work on a branch, open a pull request to `develop`; `main` is what is published. Commit style: Conventional Commits. Claims about research need a source and a note on what they do not prove. Materials for parents are written in Polish first. See also [safenest-oss/no-shorts](https://github.com/safenest-oss/no-shorts) for the extension.

## License

Code: MIT (see `LICENSE`).
