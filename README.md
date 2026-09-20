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

## Part 2 — Deploy to Cloudflare

This project deploys as a **Cloudflare Worker** (Workers & Pages → Git integration) named `fprp` —
push to GitHub, Cloudflare installs dependencies, runs `npm run build`, and publishes
automatically. It uses the free tier throughout: Workers requests, D1 (the database), and builds
are all well within the free-tier limits for a site this size.

### What it needs beyond the static site

Because of the member/staff areas, this is no longer a purely static site — it needs two things
configured on the Cloudflare side:

- **A D1 database** (already created: `fprp-db`, bound as `DB` in `wrangler.jsonc`, which is
  committed to the repo so Cloudflare's build picks up the binding automatically).
- **Two secrets** on the `fprp` Worker — go to **Settings → Variables and Secrets** and add
  `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` (from your app at
  [discord.com/developers/applications](https://discord.com/developers/applications)). Add them
  as **Secrets**, not plain variables, and never commit them to the repo — locally they live in a
  gitignored `.dev.vars` file instead (copy `.dev.vars.example` and fill in real values).

### Database migrations

New SQL files in `migrations/` need to be applied to both the local dev database and the real one:

```bash
npx wrangler d1 execute fprp-db --local --file=./migrations/000X_something.sql
npx wrangler d1 execute fprp-db --remote --file=./migrations/000X_something.sql
```

### Custom domain

Already set up: `flamepointroleplay.com` is attached as a custom domain on the `fprp` Worker
(under its **Domains** tab), pointing at the production deployment.

### Branch workflow (dev vs. production)

`main` is the **production branch** — every push to `main` deploys straight to
`flamepointroleplay.com`. To avoid pushing untested changes live, do your work on the `dev` branch
and merge to `main` only when you're happy with it
(`git checkout main && git merge dev && git push`, or a GitHub pull request).

Every push (to any branch) also creates its own **version** under the Worker's **Deployments**
tab, each with its own preview URL — useful for confirming a build succeeds without touching
production. One limitation worth knowing: that preview URL changes on every push (it's keyed to
the version hash, e.g. `07d0c9e2-fprp.flamepointroleplay.workers.dev`), so Discord login won't
work there unless you register that exact URL as a redirect URI in the Discord app each time. For
day-to-day testing of the login flow, use `npm run dev` locally instead (`localhost:4321` is
already a registered redirect URI) — treat merging to `main` as the real end-to-end test.

---

## Part 3 — The Member / Supervisor / Chief / Staff Areas

Anyone can log in at `/login` with their Discord account — this creates their account
automatically, but it sits in a **pending** state (visible under **Pending Approvals** at
`/staff`) until a Staff member approves it and assigns their tier, department, rank, and who they
report to.

There are four tiers, lowest to highest: **Member → Supervisor → Chief → Staff.**

- **`/member`** — every logged-in, approved person lands here: links to internal resources (added
  by Staff, see below) and their own leave-of-absence (LOA) request history + a form to submit a
  new one (only available once they have a supervisor assigned).
- **`/team`** — visible to Supervisor/Chief/Staff: manage your **direct reports** (people whose
  "reports to" is set to you) — edit their tier/department/rank/who they report to, suspend their
  access, and approve or deny their pending LOA requests. A Supervisor only sees the Members
  reporting to them; a Chief only sees the Supervisors reporting to them, and so on up the chain.
- **`/staff`** — Staff-only: the pending-approval queue, and **Manage Resources** — add or remove
  the links that show up on `/member` (set who can see each one: Member+, Supervisor+, Chief+, or
  Staff+).

Nobody can promote someone to a tier higher than their own, so a Supervisor can't accidentally
(or otherwise) create a Chief or Staff account.

---

## Part 4 — Customize the Content

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
