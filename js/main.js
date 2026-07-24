/* ==========================================================================
   main.js — Entry point / orchestrator
   Handles the preloader lifecycle, mobile menu toggle, skills-tab switching,
   and current-year footer stamp. Feature-specific logic (cursor, typing,
   scroll, github, projects, contact) lives in its own module and self-inits.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  /* ---------- Preloader ---------- */
  const preloader = document.querySelector(".preloader");
  window.addEventListener("load", function () {
    if (preloader) {
      setTimeout(() => preloader.classList.add("is-hidden"), 400);
    }
  });
  // Fallback: never let the preloader block the site for more than 3s
  setTimeout(() => preloader && preloader.classList.add("is-hidden"), 3000);

  /* ---------- Mobile menu ---------- */
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", function () {
      const isOpen = mobileMenu.classList.toggle("is-open");
      hamburger.classList.toggle("is-open", isOpen);
      hamburger.setAttribute("aria-expanded", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("is-open");
        hamburger.classList.remove("is-open");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Skills category tabs ---------- */
  const skillTabs = document.querySelectorAll(".skills__tab");
  const skillGroups = document.querySelectorAll("[data-skill-group]");

  skillTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      skillTabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");

      const category = tab.getAttribute("data-skill-category");
      skillGroups.forEach((group) => {
        const matches = category === "all" || group.getAttribute("data-skill-group") === category;
        group.style.display = matches ? "" : "none";
      });
    });
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.querySelector("[data-current-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
