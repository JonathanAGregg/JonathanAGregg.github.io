# Jonathan Gregg: Portfolio Site

A single-page portfolio for job hunting. It's a plain static site: HTML, CSS, and vanilla JavaScript, with **no build step, no framework, and no dependencies**. Any web host can serve it, and it also works by double-clicking `index.html`.

---

## 1. Quick start (2 minutes)

1. **Preview it:** double-click `index.html`. It opens in your browser straight from disk.
   *Or* run a local server, which behaves exactly like the live site:
   ```bash
   python3 -m http.server 8000
   ```
   Then open <http://localhost:8000>.
2. **Edit the words:** open `assets/js/content.js` in any text editor. All the site's content is in that one file.
3. **Deploy it:** see section 4. The fastest option is Netlify Drop, which needs no account setup beyond signing in.

---

## 2. Before you publish (checklist)

Search `content.js` for `TODO`.

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
index.html              Page skeleton (sections, nav, case-study panel)
404.html                "Page not found" page, used by most hosts automatically
assets/
  js/content.js         ALL SITE TEXT. Edit this.
  js/main.js            Renders content.js and handles interactions
  js/contours.js        Topographic background (generated; don't hand-edit)
  css/styles.css        All styling. Colors and fonts are set at the top in :root
  img/contours.svg      Same background as a standalone image
  img/favicon.svg       Browser-tab icon (JG monogram)
  files/                Résumé download
tools/make_contours.py  Regenerates the topographic background
.nojekyll               Tells GitHub Pages to serve files as-is
```

### Common edits

| I want to… | Do this |
|---|---|
| Change the headline or intro | `hero` in `content.js` |
| Add a case study | Copy a block in `work: [...]` and give it a new unique `id`. It automatically gets a filter tag, a numbered row, and a deep link (`#work/<id>`). |
| Remove a case study | Delete its block from `work`. |
| Change the filter buttons | They're built from each case study's `tags`, so edit the tags. |
| Change the stat strip | `glance` in `content.js` |
| Add a side project | Put the image in `assets/img/`, then copy the block in `projects: [...]` and update `image`, `width`, `height` (the image's pixel size), `alt`, and the text. For large images, also set `zoomImage` (the viewer) and `fullImage` ("Open original") to bigger files. |
| Change colors | Edit the variables at the top of `styles.css`. Light mode is in `:root`; dark mode is in the two dark blocks right below it. Change both dark blocks together. |
| Change fonts | Edit the Google Fonts `<link>` in `index.html` and the `--serif`, `--sans`, and `--mono` variables. |
| Get a different contour pattern | `python3 tools/make_contours.py 12` (any number works as a seed; needs `pip install numpy`) |

### Features

- **Case studies** open in a side panel. You can page through them with Previous/Next or the ← and → arrow keys, and close with Esc.
  - Each case study has its own shareable link, e.g. `yoursite.com/#work/recruiter-scorecard`. This is useful to include in an application.
- **Side projects** get a large framed image with a write-up beside it. Clicking the image opens a full-screen viewer, and "Open original" shows the image at full resolution.
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
3. On GitHub, open the repository → Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)` → Save.
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
