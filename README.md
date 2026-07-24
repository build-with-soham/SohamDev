# DevPortfolio Pro X

A premium, production-grade personal portfolio website. Built with plain HTML5, CSS3, and vanilla JavaScript (ES6+) — no framework, no build step. Open `index.html` and it runs.

## Folder Structure

```
DevPortfolio-Pro-X/
├── index.html
├── assets/
│   ├── fonts/
│   ├── icons/
│   └── images/
├── css/
│   ├── variables.css     → design tokens (colors, type, spacing, shadows)
│   ├── style.css         → reset + base typography + layout primitives
│   ├── components.css    → navbar, hero, cards, forms, footer, etc.
│   ├── animations.css    → keyframes + scroll-reveal system
│   └── responsive.css    → breakpoints (mobile/tablet/laptop/desktop)
├── js/
│   ├── main.js           → orchestrator: preloader, mobile menu, skill tabs
│   ├── theme.js           → dark/light theme toggle (localStorage)
│   ├── scroll.js          → progress bar, nav state, reveals, counters
│   ├── cursor.js          → custom cursor (desktop only)
│   ├── typing.js          → hero typing animation
│   ├── github.js          → live GitHub API stats + repos
│   ├── projects.js        → project filtering + modal
│   └── contact.js         → form validation + EmailJS submission
└── README.md
```

## Before you deploy — customize these

1. **Your name & copy** — search `index.html` for "Soham" and replace with your name/bio throughout.
2. **GitHub username** — change `data-github-user="sohamdev"` on the `<body>` tag in `index.html`. The GitHub section pulls live data automatically, no key needed for public data.
3. **Profile photo & project screenshots** — replace the placeholder files in `assets/images/` (same filenames, or update the `src`/`data-image` attributes in `index.html`).
4. **Resume PDF** — drop your resume at `assets/resume-soham.pdf` (or update the two `href="assets/resume-soham.pdf"` links).
5. **Social links** — update the GitHub/LinkedIn/email links in the hero, contact, and footer sections.
6. **Contact form (EmailJS)** — sign up at emailjs.com, then in `js/contact.js` replace:
   ```js
   const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
   const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
   const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
   ```
   Until configured, the form still validates and shows a success state in the console for demo purposes — it just won't actually send an email.
7. **Projects & Experience** — each project card in the Projects section and each entry in Skills/Experience/Certificates is plain HTML — duplicate a `<div>`/`<article>` block and edit its content/data attributes.

## Architecture decisions (so you understand *why*, not just *what*)

- **CSS variables first**: every color, spacing value, and font size is a token in `variables.css`. Nothing else hardcodes a hex code or pixel value — that's what makes the whole site feel consistent and lets you re-theme it by editing one file.
- **One HTML file, CSS-only responsiveness**: per your spec, there's no separate mobile markup. `responsive.css` overrides layout at each breakpoint using the same DOM.
- **IntersectionObserver over scroll listeners**: reveal animations, active-nav tracking, and counters all use `IntersectionObserver`, which only fires when elements actually cross the viewport — far cheaper than recalculating on every scroll event.
- **Each JS file has one job**: this isn't just organization for its own sake — it means you can delete or disable a feature (e.g. the custom cursor) by removing one `<script>` tag with zero side effects on the rest.
- **Accessibility floor**: skip link, visible focus states, `aria-*` attributes on interactive elements, `prefers-reduced-motion` respected globally.

## Next sprints (not yet built)

Per your 13-sprint roadmap, this delivers Sprints 1–9 (architecture through contact) plus animations, responsiveness, and initial optimization. Remaining:

- **Sprint 12 (Optimization)**: image compression, font subsetting, Lighthouse audit pass
- **Sprint 13 (Deployment)**: Vercel/Netlify/GitHub Pages walkthrough

Ask and we'll tackle those next.
