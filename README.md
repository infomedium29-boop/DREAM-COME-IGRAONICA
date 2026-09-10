# Dream Come — static HR/EN website

Production-ready static architecture for GitHub + Cloudflare Pages.

## Deploy
1. Push the contents of this folder to the repository root.
2. In Cloudflare Pages use the repository with no build command and `/` as output directory.
3. Add the real domain and replace `[DOMENA]` in `sitemap.xml` and `robots.txt`.
4. Replace placeholders listed in `PLACEHOLDERS.md`.
5. Replace local SVG placeholders in `/assets/img/` with real optimised AVIF/WebP photography while keeping width/height or CSS aspect ratios stable.
6. Add licensed/self-hostable Fredoka and Nunito WOFF2 files if you want exact typography; the package intentionally does not redistribute font binaries.

## Notes
- Web3Forms key is already wired into HR and EN booking forms.
- Google Maps is intentionally represented by a consent-gated local placeholder until a real address and production embed are supplied.
- Cookie storage is localStorage/sessionStorage only; add any future analytics behind the same consent logic.
- Legal pages are templates and must be validated against the actual company, processors, retention periods and policies before publication.
