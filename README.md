# Jonathan Gregg: Portfolio Site

A single-page portfolio for job hunting. It's a plain static site: HTML, CSS, and vanilla JavaScript, with **no build step, no framework, and no dependencies**. Any web host can serve it, and it also works by double-clicking `index.html`.

---

## 1. Quick start (2 minutes)

1. **Preview it:** double-click `index.html`. It opens in your browser straight from disk.
   _Or_ run a local server, which behaves exactly like the live site:
   ```bash
   python3 -m http.server 8000
   ```
   Then open <http://localhost:8000>.
2. **Edit the words:** use `assets/js/content.js` for enhanced case-study, experience, project, and map content. Also update the matching hero and SEO-critical static copy in `index.html`; it intentionally remains readable without JavaScript.
3. **Deploy it:** see section 4. The fastest option is Netlify Drop, which needs no account setup beyond signing in.

---

## 2. Before you publish (checklist)

Review every public claim in `content.js` and the matching static copy in `index.html` before publishing.

- [ ] **LinkedIn URL:** `links.linkedin`
- [ ] **GitHub URL:** `links.github`. Leave it as `""` to hide the link.
- [ ] **Résumé:** replace `assets/files/Jonathan_Gregg_Resume.docx`.
  - A **PDF** is better for recruiters: in Word, choose File → Save As → PDF.
  - Then update `resume:` in `content.js` to point at the new file, e.g. `"assets/files/Jonathan_Gregg_Resume.pdf"`.
- [ ] **Dates and claims:** reread every case study. Keep client names, coworkers' names, internal figures, and anything else confidential out. Once deployed, this file is public.
- [ ] **Optional share image:** add `assets/img/og.png` (1200×630) and a matching `<meta property="og:image">` tag in `index.html`. This controls how the link looks when pasted into LinkedIn or Slack.

---

## 3. How it's organized

```
index.html              Static document: positioning, SEO metadata, and no-JavaScript fallbacks
404.html                "Page not found" page, used by most hosts automatically
assets/
  js/content.js         Case-study, experience, project, and map content
  js/main.js            Enhances the static page with dialogs, filters, maps, and controls
  js/ma-map.js          Field map base layer: MA town boundaries (generated; don't hand-edit)
  css/styles.css        All styling. Colors and fonts are set at the top in :root
  img/favicon.svg       Browser-tab icon (JG monogram)
  files/                Résumé download
tools/make_ma_map.py    Regenerates the field map base layer from Census data
.nojekyll               Tells GitHub Pages to serve files as-is
```

### Common edits

| I want to…                         | Do this                                                                                                                                                                                                                                |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Change the hero copy               | Update the matching static copy in `index.html` and the `hero` object in `content.js`. The static copy is intentional for SEO and no-JavaScript visitors.                                                                              |
| Add a case study                   | Copy a block in `work: [...]`, give it a unique `id`, and set `featured: true` only when it belongs in the three primary case studies. Use the `constraints`, `architecture`, and `validation` fields where supported by the evidence. |
| Change the case-study filters      | They are built from the featured case studies' `tags`.                                                                                                                                                                                 |
| Change the stat strip              | `glance` in `content.js`                                                                                                                                                                                                               |
| Edit the field map                 | `fieldMap` in `content.js`: add or change `pins` (lat/lon, label position) and `stops`. The Census-backed map appears in About.                                                                                                        |
| Rebuild the field map's base layer | `python3 tools/make_ma_map.py`. It downloads the Census town boundaries and rewrites `assets/js/ma-map.js`. No GIS libraries needed.                                                                                                   |
| Add an independent project         | Put the image in `assets/img/`, then copy the block in `projects: [...]` and update `image`, `width`, `height`, `alt`, and the text. For large images, set `zoomImage` and `fullImage`.                                                |
| Change colors or fonts             | Edit the CSS variables at the top of `assets/css/styles.css`.                                                                                                                                                                          |

### Features

- **Case studies** open in a side panel. You can page through them with Previous/Next or the ← and → arrow keys, and close with Esc.
  - Each case study has its own shareable link, e.g. `yoursite.com/#work/recruiter-scorecard`. This is useful to include in an application.
- **Side projects** get a large framed image with a write-up beside it. Clicking the image opens a full-screen viewer, and "Open original" shows the image at full resolution.
- **Static-first positioning:** the hero, representative case studies, experience summary, About copy, metadata, and Person/ProfilePage structured data are present in `index.html`. JavaScript adds interaction rather than supplying the site’s meaning.
- **Field map** in About: all 351 Massachusetts cities and towns from Census boundary files, with pins, a career route, live latitude/longitude, and town readout. Everything is plain SVG, with no map tiles or API keys.
- **Filters** narrow the case studies by area.
- **Light and dark themes:** follows the visitor's system setting, with a toggle that's remembered.
- **Copy-email button** with a confirmation message.
- **Mobile layout** with a collapsible menu.
- **Accessibility:** keyboard-accessible, with a skip link, and it respects reduced-motion settings.
- **Print styles:** printing the page gives a clean, paper-friendly version.

---

## 4. Deploying (pick one; all are free)

### Option A: Netlify Drop (fastest, no git needed)

1. Go to <https://app.netlify.com/drop> and sign in.
2. Drag this whole folder onto the page. You get a live URL in seconds.
3. To use a nicer name, open Site settings → Change site name, e.g. `jonathangregg.netlify.app`.
4. To update the site later, drag the folder onto the site's **Deploys** tab again.

### Option B: GitHub Pages (best long-term; the code lives in your account)

1. Create a new repository on your **personal** GitHub account, e.g. `portfolio`.
2. From this folder, run:
   ```bash
   git remote add origin https://github.com/<your-username>/portfolio.git
   git push -u origin main
   ```
   The folder is already a git repository with one commit.
3. On GitHub, open the repository → Settings → Pages → Source: _Deploy from a branch_ → `main` / `(root)` → Save.
4. The site will be live at `https://<your-username>.github.io/portfolio/` within a minute or two.
5. To serve it at `https://<your-username>.github.io/` instead, name the repository `<your-username>.github.io`.

### Option C: Cloudflare Pages or Vercel

Import the GitHub repository and leave both the build command and the framework preset empty. The output directory is `/`.

### This site's live setup

- **Live at:** <https://jonathanagregg.com>. The old `https://jonathanagregg.github.io` address redirects there automatically.
- **Hosting:** GitHub Pages from the `main` branch of `JonathanAGregg/JonathanAGregg.github.io`.
- **Domain:** registered at Cloudflare. DNS records (all set to **DNS only**, gray cloud): four `A` and four `AAAA` records on `@` pointing to GitHub Pages, plus a `CNAME` for `www` → `jonathanagregg.github.io`. A `_github-pages-challenge-JonathanAGregg` TXT record verifies the domain with GitHub.
- **The `CNAME` file** in this folder tells GitHub Pages which domain to serve. Don't delete it.
- **Renewal:** the domain renews yearly at Cloudflare. Keep auto-renew on so the site doesn't go dark.

### Custom domain (optional, about $12/year)

1. Buy a domain like `jonathangregg.com` from a registrar (Cloudflare, Namecheap, Porkbun).
2. Add it in your host's domain settings (Netlify: Domain management; GitHub: Settings → Pages → Custom domain).
3. Follow the DNS records the host shows you. HTTPS is set up automatically.

---

## 5. Handoff notes

- **Nothing is tied to your former employer's accounts.** There are no API keys, no analytics, and no external services apart from Google Fonts. If Google Fonts is ever unavailable, the site falls back to system fonts.
- **Back up a copy now:** save the `.zip` of this folder somewhere you personally own (personal email, personal cloud drive, or personal GitHub). If you lose access to this computer, you can deploy the zip with Option A from any machine.
- **Handing it to a developer:** they need nothing beyond this folder and this README. Everything is standard HTML, CSS, and JS with no tooling to install.
- **Moving to a framework later:** `content.js` is plain structured data, so it ports easily to Astro, Next.js, or similar.
