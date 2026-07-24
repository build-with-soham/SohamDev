/* ==========================================================================
   cursor.js — Custom cursor (desktop, fine-pointer devices only)
   Two elements: a dot that tracks the mouse exactly, and a ring that eases
   toward it for a "trailing" feel. Skipped entirely on touch devices, since
   a synthetic cursor makes no sense without a real pointer.
   ========================================================================== */

(function () {
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;
  if (!isFinePointer) return;

  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (!dot || !ring) return;

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  window.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  // Ease the ring toward the pointer every frame for a smooth trailing effect
  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Grow the ring on hoverable / interactive elements
  const interactiveSelector = "a, button, [data-cursor-hover], input, textarea";
  document.addEventListener("mouseover", function (e) {
    if (e.target.closest(interactiveSelector)) {
      ring.classList.add("is-active");
    }
  });
  document.addEventListener("mouseout", function (e) {
    if (e.target.closest(interactiveSelector)) {
      ring.classList.remove("is-active");
    }
  });

  // Hide cursor visuals when the pointer leaves the viewport
  document.addEventListener("mouseleave", function () {
    dot.style.opacity = "0";
    ring.style.opacity = "0";
  });
  document.addEventListener("mouseenter", function () {
    dot.style.opacity = "1";
    ring.style.opacity = "1";
  });
})();
