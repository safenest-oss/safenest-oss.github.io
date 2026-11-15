# Copilot instructions

Read [AGENTS.md](../AGENTS.md) in the repository root first. It describes the site, its principles and the file layout.

Quick rules:
- Plain static HTML, CSS and one small script. No build step, no dependencies, no frameworks
- Privacy first: no third-party requests, cookies or analytics. Keep the Content-Security-Policy: no inline scripts, no inline `style=""` attributes
- Header and footer are repeated in every page: change them in all pages, EN and PL
- Every claim about research needs a source and a "what this does not prove" note. Never invent or change statistics without a verified source
- Materials for parents are Polish first; keep EN and PL pages in step and add new pages to `sitemap.xml`
- Conventional Commits in English. Do not add yourself as author or add `Co-Authored-By` trailers
- Check pages at 1280 px and 390 px, with no console errors
