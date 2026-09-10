# 🔥 Flame Point Roleplay — Official Website

This repository contains the full source code for the **Flame Point Roleplay** website — a
FiveM roleplay server homepage with a rules page and a whitelist application page. It's plain
HTML, CSS, and JavaScript, so it costs nothing to host and is easy to edit even if you've never
coded before.

**Live structure:**

```
flame-point-roleplay/
├── index.html              # Homepage
├── rules.html               # Server rules page
├── apply.html                # Whitelist application info page
├── assets/
│   ├── css/style.css        # All site styling
│   ├── js/script.js         # Mobile nav, FAQ accordion, animations
│   └── img/favicon.svg      # Browser tab icon (flame logo)
└── README.md                 # You are here
```

---

## Part 1 — Put This Site on GitHub

### Step 1: Create a GitHub account
If you don't already have one, go to [github.com](https://github.com) and sign up. It's free.

### Step 2: Create a new repository
1. Click the **+** icon in the top-right corner of GitHub → **New repository**.
2. Name it something like `flame-point-roleplay` (or, for the cleanest possible web
   address, name it exactly `your-username.github.io` — see the note in Step 5).
3. Set it to **Public** (GitHub Pages requires a public repo on free accounts).
4. Do **not** check "Add a README" — you already have one in this project.
5. Click **Create repository**.

### Step 3: Upload the website files
The easiest way, with no command line required:

1. On your new repository's page, click **uploading an existing file** (or **Add file → Upload
   files**).
2. Open the `flame-point-roleplay` folder on your computer and drag in **everything inside
   it** — `index.html`, `rules.html`, `apply.html`, the `assets` folder, and this
   `README.md`. Make sure `index.html` ends up at the **root** of the repo, not inside an
   extra subfolder.
3. Scroll down and click **Commit changes**.

**Prefer Git on the command line?**

```bash
git clone https://github.com/YOUR-USERNAME/flame-point-roleplay.git
cd flame-point-roleplay
# copy all the website files into this folder, then:
git add .
git commit -m "Initial website upload"
git push origin main
```

### Step 4: Turn on GitHub Pages
1. In your repository, go to **Settings** (top menu).
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Under **Branch**, select `main` and folder `/ (root)`, then click **Save**.
5. Wait 1–2 minutes. Refresh the page — GitHub will show a green box with your live URL,
   usually:

   ```
   https://YOUR-USERNAME.github.io/flame-point-roleplay/
   ```

That's it — your website is live!

### Step 5 (optional): Get a cleaner URL
If you named your repository exactly `YOUR-USERNAME.github.io` in Step 2, your site is instead
published directly at `https://YOUR-USERNAME.github.io/` with no extra folder name.

### Step 6 (optional): Use your own domain name
If you own a custom domain (e.g. `flamepointrp.com`):
1. In **Settings → Pages**, enter it under **Custom domain** and save.
2. At your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.), add a `CNAME` record
   pointing to `YOUR-USERNAME.github.io`.
3. DNS changes can take up to 24 hours to fully apply.

---

## Part 2 — Customize the Content

Everything below is a search-and-replace edit. You can edit files directly on GitHub (click the
pencil ✏️ icon on any file) or download the repo and edit locally, then re-upload.

### 1. Discord invite link
This placeholder appears in **every file** (`index.html`, `rules.html`, `apply.html`):

```
https://discord.gg/YOUR-INVITE-CODE
```

Replace `YOUR-INVITE-CODE` with your real Discord invite (e.g. `https://discord.gg/flamepoint`).

### 2. Server connect address
In `index.html`, `rules.html`, and `apply.html`, find:

```
fivem://connect/connect.flamepointrp.com
```

Replace `connect.flamepointrp.com` with your server's actual FiveM connect address or IP:port
(for example `fivem://connect/123.45.67.89:30120`). The plain-text version also appears in the
hero section of `index.html`:

```html
<code>connect.flamepointrp.com</code>
```

### 3. Server stats
In `index.html`, find the `<section class="stats">` block and update the numbers to match your
real server (slot count, job count, MLO count, etc.):

```html
<div class="stat"><span class="stat-num">128</span><span class="stat-label">Player Slots</span></div>
```

### 4. Text content
All wording — the hero tagline, About Us story, feature descriptions, rules, and FAQ — is plain
text inside the HTML files. Open any `.html` file in a text editor, find the text between tags
like `<h1>...</h1>` or `<p>...</p>`, and replace it with your own words.

### 5. Colors and theme
All colors are defined once at the top of `assets/css/style.css` inside `:root { ... }`:

```css
--flame-1: #ff4d00;   /* deep orange */
--flame-2: #ff8c00;   /* mid orange  */
--flame-3: #ffc107;   /* gold        */
```

Change these hex codes to shift the entire site's accent color — every button, heading
highlight, and glow effect references these three variables.

### 6. Logo / favicon
The flame icon in the browser tab is `assets/img/favicon.svg`. Replace it with your own logo
file (keep the filename `favicon.svg`, or update the `<link rel="icon">` line in each HTML
file's `<head>` if you rename it).

### 7. Social and store links
In the footer of each page (`<div class="footer-links">`), update the placeholder `#` links for
Twitter/X and your Tebex store to your real URLs.

---

## Part 3 — Updating the Site Later

Any time you want to make a change:

1. Edit the file directly on GitHub (pencil icon) **or** edit it locally and re-upload.
2. Commit the change with a short message describing what you changed.
3. GitHub Pages automatically rebuilds and publishes the update, usually within 1–2 minutes.
4. Hard-refresh your browser (`Ctrl+Shift+R` / `Cmd+Shift+R`) if you don't see the change right
   away — browsers cache pages aggressively.

---

## Troubleshooting

**My site shows a 404 page.**
Make sure `index.html` sits at the root of the repository (not inside a subfolder), and that
GitHub Pages is enabled under Settings → Pages with the `main` branch selected.

**My changes aren't showing up.**
Check the **Actions** tab in your repo for a green checkmark confirming the Pages build
finished, then hard-refresh your browser.

**The page looks unstyled / broken.**
This usually means `assets/css/style.css` wasn't uploaded, or the folder structure got flattened
during upload. Confirm the `assets` folder (with `css`, `js`, and `img` subfolders) exists at
the repo root, exactly as shown in the file tree at the top of this README.

**Fonts look different than expected.**
The site loads "Bebas Neue" and "Inter" from Google Fonts over the internet. If your server's
network blocks external requests, the page will fall back to a default system font — the layout
still works fine either way.

---

## Credits

Built for **Flame Point Roleplay**, a FiveM roleplay community. Not affiliated with Rockstar
Games, Take-Two Interactive, or Cfx.re. FiveM® and GTA V® are property of their respective
owners.
