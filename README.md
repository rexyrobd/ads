# Rexyro | Google Ads & Meta Ads Specialist Portfolio

A modern, responsive, single-page portfolio website for a Google Ads and Meta Ads specialist. Built with plain HTML, CSS and JavaScript. No frameworks, no build step, no dependencies.

**Live site:** [https://rexyrobd.github.io/ads/](https://rexyrobd.github.io/ads/)

---

## Features

- **Modern dark UI** with glassmorphism cards, animated gradient background and a dark/light theme toggle (saved in the browser)
- **Animated hero** with a live ROAS chart drawn on canvas (no chart library)
- **Services bento grid** covering Google Ads, Meta Ads, tracking, CRO, retargeting and reporting
- **Case studies** with Google Ads / Meta Ads filter and animated KPI bars
- **Screenshot gallery** with category filters and a click-to-zoom lightbox (Esc to close)
- **ROAS & break-even calculator** that shows projected revenue, orders and profit
- **Process, testimonials and FAQ** sections
- **Blog section** with article cards linking to LinkedIn Articles (or any URL)
- **Newsletter form** powered by Formspree (no page reload)
- **Contact form** that opens a pre-filled WhatsApp message
- **Floating WhatsApp button** with a welcome tooltip
- **Fully responsive**, centered layout on mobile, polished two- and three-column layouts on desktop
- Scroll progress bar, scroll-reveal animations, count-up stats, 3D card tilt and a scrolling tools marquee
- Respects `prefers-reduced-motion`

---

## Project structure

```
.
├── index.html     # Page content and structure
├── style.css      # All styling, themes and responsive rules
├── script.js      # Interactions: theme, filters, lightbox, chart, calculator, forms
└── README.md
```

Optional: create an `images/` folder for real screenshots (see below).

---

## Run locally

No installation needed.

1. Download or clone the repository.
2. Keep `index.html`, `style.css` and `script.js` in the **same folder**.
3. Open `index.html` in your browser.

For live reload while editing, you can use the VS Code **Live Server** extension, or run:

```bash
python3 -m http.server 8000
```

then open `http://localhost:8000`.

---

## Deploy to GitHub Pages

1. Create a new repository (this project uses `rexyrobd/ads`).
2. Upload all files to the repository root.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then click **Save**.
5. After a minute or two, the site is live at [https://rexyrobd.github.io/ads/](https://rexyrobd.github.io/ads/).

If you see an unstyled page, make sure `style.css` and `script.js` are in the same folder as `index.html`.

---

## Customize

### Personal details
Edit `index.html`:
- Site title, meta description and Open Graph tags in `<head>`
- Logo text in the navigation (`.logo`)
- Hero text, badges, stats and services
- Contact links (email, WhatsApp, LinkedIn, Facebook) and the footer

### WhatsApp number
In `script.js`, set your number with country code and no `+`:

```js
const WA_NUMBER = '8801XXXXXXXXX';
```

Also update the links in `index.html` that use `https://wa.me/8801XXXXXXXXX`, including the floating WhatsApp button.

### Newsletter (Formspree)
1. Create a form at [formspree.io](https://formspree.io) and copy its endpoint.
2. Put it in the form tag in `index.html`:

```html
<form class="newsletter card glass reveal" id="newsletter" action="https://formspree.io/f/xpppjale" method="POST">
```

3. Confirm the first submission email Formspree sends you. Submissions then arrive in your Formspree inbox.

### Blog links
In the `#blog` section, replace each `href="#"` with your article URL (for example a LinkedIn Article). Update the date, read time, title and summary to match the real article.

### Real screenshots in the gallery
1. Create an `images/` folder and add your screenshots (for example `images/pmax.jpg`).
2. In `index.html`, set `data-img` on the matching gallery card:

```html
<figure class="shot-card reveal" data-g="google" data-img="images/pmax.jpg">
```

The built-in mock dashboard is replaced by your image automatically. Hide or blur private client information (names, billing, account IDs) before uploading.

### Colors and fonts
All colors are CSS variables at the top of `style.css`:

```css
:root{
  --a1:#6c5cff; --a2:#00d4ff; --a3:#ff4d8d;
  --bg:#07080f; --text:#eef0ff;
}
```

Fonts (Inter and Space Grotesk) are loaded from Google Fonts in the `<head>` of `index.html`.

---

## Important: replace sample content

Case study numbers, gallery dashboards, testimonials and blog entries are **sample content**. Replace them with real, verified client results and permitted testimonials before promoting the site. Do not publish results or quotes you cannot back up.

---

## Browser support

Works in current versions of Chrome, Edge, Firefox and Safari. Uses CSS Grid, `backdrop-filter`, `IntersectionObserver` and `<canvas>`.

---

## License

All rights reserved by the site owner. Add a license file (for example MIT) if you want others to reuse the code.
