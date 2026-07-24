/* ==========================================================================
   projects.js — Category filtering + detail modal for the Projects section
   Filtering is done by toggling a CSS class rather than re-rendering the
   DOM, since the project count here is small; this keeps it simple and fast.
   ========================================================================== */

(function () {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll("[data-project-card]");
  const modalOverlay = document.querySelector("[data-project-modal]");
  const modalClose = document.querySelector("[data-modal-close]");

  /* ---------- Filtering ---------- */
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const filter = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const categories = (card.getAttribute("data-category") || "").split(" ");
        const shouldShow = filter === "all" || categories.includes(filter);
        card.style.display = shouldShow ? "" : "none";
      });
    });
  });

  /* ---------- Modal ---------- */
  if (!modalOverlay) return;

  const modalFields = {
    title: modalOverlay.querySelector("[data-modal-title]"),
    desc: modalOverlay.querySelector("[data-modal-desc]"),
    image: modalOverlay.querySelector("[data-modal-image]"),
    tags: modalOverlay.querySelector("[data-modal-tags]"),
    github: modalOverlay.querySelector("[data-modal-github]"),
    demo: modalOverlay.querySelector("[data-modal-demo]"),
  };

  function openModal(card) {
    const title = card.getAttribute("data-title") || "";
    const desc = card.getAttribute("data-description") || "";
    const image = card.getAttribute("data-image") || "";
    const tags = (card.getAttribute("data-tags") || "").split(",").map((t) => t.trim());
    const github = card.getAttribute("data-github") || "#";
    const demo = card.getAttribute("data-demo") || "#";

    if (modalFields.title) modalFields.title.textContent = title;
    if (modalFields.desc) modalFields.desc.textContent = desc;
    if (modalFields.image) {
      modalFields.image.src = image;
      modalFields.image.alt = title;
    }
    if (modalFields.tags) {
      modalFields.tags.innerHTML = tags.map((t) => `<span class="tag">${t}</span>`).join("");
    }
    if (modalFields.github) modalFields.github.href = github;
    if (modalFields.demo) modalFields.demo.href = demo;

    modalOverlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    modalClose && modalClose.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  projectCards.forEach((card) => {
    card.addEventListener("click", () => openModal(card));
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  modalClose && modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("is-open")) closeModal();
  });
})();
