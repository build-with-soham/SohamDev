/* ==========================================================================
   github.js — Live GitHub stats via the public GitHub REST API
   No auth token required for public read-only endpoints (rate-limited to
   60 req/hr per IP, which is plenty for a portfolio). Configure the
   username via data-github-user on <body>.
   ========================================================================== */

(function () {
  const body = document.body;
  const username = body.getAttribute("data-github-user");
  if (!username) return;

  const statsEl = document.querySelector("[data-github-stats]");
  const reposEl = document.querySelector("[data-github-repos]");

  async function fetchGithubProfile() {
    try {
      const res = await fetch(`https://api.github.com/users/${username}`);
      if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
      const data = await res.json();
      renderStats(data);
    } catch (err) {
      console.error("GitHub profile fetch failed:", err);
      if (statsEl) {
        statsEl.innerHTML = `<p class="section-desc">Live GitHub stats are temporarily unavailable. Check back shortly.</p>`;
      }
    }
  }

  async function fetchGithubRepos() {
    try {
      const res = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`
      );
      if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
      const data = await res.json();
      renderRepos(data);
    } catch (err) {
      console.error("GitHub repos fetch failed:", err);
    }
  }

  function renderStats(profile) {
    if (!statsEl) return;
    const stats = [
      { label: "Public Repos", value: profile.public_repos ?? 0 },
      { label: "Followers", value: profile.followers ?? 0 },
      { label: "Following", value: profile.following ?? 0 },
      { label: "Public Gists", value: profile.public_gists ?? 0 },
    ];

    statsEl.innerHTML = stats
      .map(
        (s) => `
        <div class="github-stat" data-reveal="up">
          <div class="github-stat__num counter" data-counter="${s.value}">0</div>
          <div class="github-stat__label">${s.label}</div>
        </div>`
      )
      .join("");

    // Newly-injected [data-counter] and [data-reveal] elements need their
    // own observers since scroll.js already ran on the static DOM.
    initCountersFor(statsEl.querySelectorAll("[data-counter]"));
    initRevealFor(statsEl.querySelectorAll("[data-reveal]"));
  }

  function renderRepos(repos) {
    if (!reposEl) return;
    if (!Array.isArray(repos) || repos.length === 0) {
      reposEl.innerHTML = `<p class="section-desc">No public repositories to show yet.</p>`;
      return;
    }

    reposEl.innerHTML = repos
      .map(
        (repo) => `
        <div class="repo-card" data-reveal="up">
          <div class="repo-card__name">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.994 1.117.75.75 0 11-1.492-.15A2.5 2.5 0 014.5 9h8v-7.5H4.5a1 1 0 00-1 1v9a1 1 0 001 1h.75a.75.75 0 010 1.5H4.5A2.5 2.5 0 012 12.5v-10z"></path>
            </svg>
            ${escapeHtml(repo.name)}
          </div>
          <p class="repo-card__desc">${escapeHtml(repo.description || "No description provided.")}</p>
          <div class="repo-card__meta">
            <span>★ ${repo.stargazers_count}</span>
            <span>⑂ ${repo.forks_count}</span>
            <span>${repo.language || "—"}</span>
          </div>
        </div>`
      )
      .join("");

    initRevealFor(reposEl.querySelectorAll("[data-reveal]"));
  }

  // Basic XSS-safe text insertion for API-sourced strings
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function initRevealFor(elements) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    elements.forEach((el) => observer.observe(el));
  }

  function initCountersFor(elements) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.getAttribute("data-counter"));
          const duration = 1200;
          const startTime = performance.now();
          function step(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toString();
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          observer.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    elements.forEach((el) => observer.observe(el));
  }

  fetchGithubProfile();
  fetchGithubRepos();
})();
