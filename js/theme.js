/* ==========================================================================
   theme.js — Theme toggle with localStorage persistence
   The site ships dark-first (matches the premium SaaS brief), but this module
   keeps a light-mode hook ready: toggling adds/removes [data-theme="light"]
   on <html>, and CSS variables can be overridden under that selector later.
   ========================================================================== */

(function () {
  const STORAGE_KEY = "devportfolio-theme";
  const toggleBtn = document.querySelector("[data-theme-toggle]");
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-pressed", theme === "light");
    }
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* localStorage unavailable (private browsing) — fail silently */
    }
  }

  // Initialize from storage, default to dark (this site's premium baseline)
  const savedTheme = getStoredTheme() || "dark";
  applyTheme(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      const isLight = root.getAttribute("data-theme") === "light";
      const nextTheme = isLight ? "dark" : "light";
      applyTheme(nextTheme);
      storeTheme(nextTheme);
    });
  }
})();
