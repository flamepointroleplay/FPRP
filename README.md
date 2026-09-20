# 🔥 Flame Point Roleplay — Official Website

This repository contains the source code for the **Flame Point Roleplay** website — a FiveM
roleplay server homepage with a rules page and a whitelist application page. It's built with
[Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com), and deploys to
[Cloudflare Pages](https://pages.cloudflare.com) on the free tier.

**Project structure:**

```
FPRP/
├── src/
│   ├── layouts/Layout.astro     # Shared <head>, ember background, header/footer wrapper
│   ├── components/
│   │   ├── Header.astro         # Site nav + connect/discord buttons
│   │   └── Footer.astro         # Footer links + copyright
│   ├── pages/
│   │   ├── index.astro          # Homepage
│   │   ├── rules.astro          # Server rules (rules are a data array at the top of the file)
│   │   └── apply.astro          # Whitelist application info page
│   ├── scripts/site.js          # Mobile nav, FAQ accordion, scroll-reveal animations
│   └── styles/global.css        # Tailwind + design tokens (colors, fonts) + component classes
├── public/img/                  # Logo, favicon, apple-touch-icon (served as-is, no processing)
├── astro.config.mjs
└── package.json
```

---

## Part 1 — Run It Locally

You need [Node.js](https://nodejs.org) (LTS) installed.

```bash
npm install
npm run dev
```

Then open the URL it prints (usually `http://localhost:4321`). Changes to any file are reflected
instantly in the browser.

To check that the production build works before deploying:

```bash
npm run build
npm run preview
```

---

## Part 2 — Deploy to Cloudflare Pages

This project deploys via **Cloudflare Pages' Git integration** — push to GitHub, Cloudflare
builds and publishes automatically. No command-line deploy step needed, and it's entirely free
for a site this size (Pages' free tier includes unlimited requests/bandwidth and 500 builds/month).

### One-time setup

1. Go to the [Cloudflare dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create**
   → **Pages** → **Connect to Git**.
2. Authorize Cloudflare's GitHub app and select this repository
   (`flamepointroleplay/FPRP`).
3. Set the build configuration:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Click **Save and Deploy**. Cloudflare will install dependencies, build, and publish the site —
   you'll get a live URL like `fprp.pages.dev` within a minute or two.

### Custom domain

If you have a domain already on your Cloudflare account:

1. In your new Pages project, go to **Custom domains** → **Set up a custom domain**.
2. Enter your domain (`flamepointroleplay.com`) and follow the prompts. Since the domain's DNS is
   already on Cloudflare, this is usually automatic — no manual DNS record editing required.

### Branch workflow (dev vs. production)

`main` is the **production branch** — every push to `main` deploys straight to
`flamepointroleplay.com`. To avoid pushing untested changes live:

1. Do your work on the `dev` branch (`git checkout dev`, or branch off it for a specific change).
2. Push `dev` to GitHub. Cloudflare automatically builds a **preview deployment** for it — check
   the **Deployments** tab in the Cloudflare dashboard (or Workers & Pages project) for the
   preview URL. Nothing on the live site changes.
3. Once you're happy with how it looks, merge `dev` into `main` (locally: `git checkout main && git merge dev && git push`,
   or open a pull request on GitHub) — *that* push triggers the production deploy.

---

## Part 3 — Customize the Content

### 1. Discord invite link
Search for `discord.gg/5GKxAhPa4` across `src/` and replace it with your real invite if it changes.

### 2. Server connect address
Search for `connect.flamepointrp.com` across `src/` and replace it with your server's real FiveM
connect address or IP:port.

### 3. Server stats
In `src/pages/index.astro`, find the `<section class="stats">` block and update the numbers.

### 4. Text content
Homepage and apply-page copy is plain text/JSX inside `src/pages/index.astro` and
`src/pages/apply.astro`. Server rules live in a data array at the top of `src/pages/rules.astro`
— edit the `title`/`items` there rather than the markup below.

### 5. Colors and theme
Design tokens are defined once in `src/styles/global.css` inside the `@theme { ... }` block:

```css
--color-flame-1: #ff4d00;   /* deep orange */
--color-flame-2: #ff8c00;   /* mid orange  */
--color-flame-3: #ffc107;   /* gold        */
```

Change these hex codes to shift the entire site's accent color.

### 6. Logo / favicon
Replace the files in `public/img/` (`logo.png`, `favicon.png`, `apple-touch-icon.png`), keeping
the same filenames.

### 7. Social and store links
In `src/components/Footer.astro`, update the placeholder `#` links for Twitter/X and your Tebex
store.

---

## Troubleshooting

**My build fails on Cloudflare but works locally.**
Check the deployment log in the Cloudflare dashboard — it's almost always a typo in an `.astro`
file that only shows up during `astro build`. Run `npm run build` locally to reproduce it.

**My changes aren't showing up.**
Check the **Deployments** tab of your Pages project for a successful build, then hard-refresh
your browser (`Ctrl+Shift+R` / `Cmd+Shift+R`).

**Fonts look different than expected.**
The site loads "Bebas Neue" and "Inter" from Google Fonts over the internet. If blocked, the page
falls back to a default system font — the layout still works fine either way.

---

## Credits

Built for **Flame Point Roleplay**, a FiveM roleplay community. Not affiliated with Rockstar
Games, Take-Two Interactive, or Cfx.re. FiveM® and GTA V® are property of their respective
owners.
