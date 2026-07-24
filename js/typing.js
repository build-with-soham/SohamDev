/* ==========================================================================
   typing.js — Hero typing animation
   Cycles through a list of roles/phrases defined via data-words on the
   target element (comma-separated), typing and deleting each in turn.
   ========================================================================== */

(function () {
  const el = document.querySelector("[data-typing]");
  if (!el) return;

  const words = (el.getAttribute("data-words") || "")
    .split(",")
    .map((w) => w.trim())
    .filter(Boolean);

  if (words.length === 0) return;

  const TYPE_SPEED = 65;
  const DELETE_SPEED = 35;
  const PAUSE_AFTER_TYPE = 1600;
  const PAUSE_AFTER_DELETE = 300;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
      charIndex++;
      el.textContent = currentWord.slice(0, charIndex);

      if (charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(tick, PAUSE_AFTER_TYPE);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      charIndex--;
      el.textContent = currentWord.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(tick, PAUSE_AFTER_DELETE);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  tick();
})();
