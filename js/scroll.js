/* ==========================================================================
   scroll.js — Everything driven by scroll position
   Scroll progress bar, sticky navbar blur state, active nav-link tracking,
   Intersection-Observer scroll reveals, animated counters, back-to-top.
   Uses IntersectionObserver instead of scroll listeners wherever possible —
   far cheaper than recalculating on every scroll tick.
   ========================================================================== */

(function () {
  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.querySelector(".scroll-progress");

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = progress + "%";
  }

  /* ---------- Navbar blur-on-scroll + back-to-top visibility ---------- */
  const header = document.querySelector(".header");
  const backToTop = document.querySelector(".back-to-top");
  const SCROLL_THRESHOLD = 40;

  function updateHeaderState() {
    const scrolled = window.scrollY > SCROLL_THRESHOLD;
    if (header) header.classList.toggle("is-scrolled", scrolled);
    if (backToTop) backToTop.classList.toggle("is-visible", window.scrollY > 600);
  }

  let ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateProgress();
        updateHeaderState();
        ticking = false;
      });
      ticking = true;
    }
  });

  updateProgress();
  updateHeaderState();

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Active nav-link tracking via IntersectionObserver ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".navbar__link, .mobile-menu__link");

  if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => navObserver.observe(section));
  }

  /* ---------- Scroll reveal ([data-reveal] elements) ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Animated counters ([data-counter] elements) ---------- */
  const counters = document.querySelectorAll("[data-counter]");
  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.getAttribute("data-counter"));
          const duration = 1400;
          const startTime = performance.now();

          function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
            el.textContent = Math.floor(eased * target).toString();
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = target.toString();
            }
          }
          requestAnimationFrame(step);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  }

  /* ---------- Skill bar fill on reveal ---------- */
  const skillBars = document.querySelectorAll(".skill-card__bar-fill");
  if (skillBars.length) {
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const fill = entry.target;
            fill.style.width = fill.getAttribute("data-fill") + "%";
            barObserver.unobserve(fill);
          }
        });
      },
      { threshold: 0.4 }
    );
    skillBars.forEach((bar) => barObserver.observe(bar));
  }

  /* ---------- Hero mouse glow (subtle parallax-like light following cursor) ---------- */
  const hero = document.querySelector(".hero");
  const glow = document.querySelector(".hero__mouse-glow");
  if (hero && glow && window.matchMedia("(pointer: fine)").matches) {
    hero.addEventListener("mousemove", function (e) {
      const rect = hero.getBoundingClientRect();
      glow.style.left = e.clientX - rect.left + "px";
      glow.style.top = e.clientY - rect.top + "px";
      glow.style.opacity = "1";
    });
    hero.addEventListener("mouseleave", function () {
      glow.style.opacity = "0";
    });
  }
})();
