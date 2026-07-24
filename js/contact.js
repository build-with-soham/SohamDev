/* ==========================================================================
   contact.js — Contact form validation + EmailJS submission
   EmailJS is loaded via CDN in index.html and initialized with a public key.
   Replace the placeholder SERVICE_ID / TEMPLATE_ID / PUBLIC_KEY constants
   with your real EmailJS credentials before going live.
   ========================================================================== */

(function () {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  // ---- Replace these with your EmailJS credentials ----
  const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
  const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
  const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

  if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  const statusEl = form.querySelector("[data-form-status]");
  const submitBtn = form.querySelector("[data-form-submit]");

  const validators = {
    name: (v) => v.trim().length >= 2 || "Enter your full name.",
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address.",
    subject: (v) => v.trim().length >= 3 || "Subject must be at least 3 characters.",
    message: (v) => v.trim().length >= 10 || "Message should be at least 10 characters.",
  };

  function validateField(field) {
    const name = field.getAttribute("name");
    const validator = validators[name];
    if (!validator) return true;

    const result = validator(field.value);
    const group = field.closest(".form-group");
    const errorEl = group ? group.querySelector(".form-error") : null;

    if (result === true) {
      group && group.classList.remove("has-error");
      return true;
    }

    group && group.classList.add("has-error");
    if (errorEl) errorEl.textContent = result;
    return false;
  }

  // Validate on blur for immediate, non-annoying feedback
  form.querySelectorAll(".form-input, .form-textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const fields = Array.from(form.querySelectorAll(".form-input, .form-textarea"));
    const isValid = fields.map(validateField).every(Boolean);

    if (!isValid) {
      showStatus("Please fix the highlighted fields.", "error");
      return;
    }

    setSubmitting(true);

    try {
      if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
      } else {
        // EmailJS not configured yet — simulate success so the UI can be
        // demoed/reviewed before real credentials are added.
        await new Promise((resolve) => setTimeout(resolve, 900));
        console.warn(
          "EmailJS is not configured. Add your SERVICE_ID / TEMPLATE_ID / PUBLIC_KEY in js/contact.js."
        );
      }
      showStatus("Message sent successfully. I'll get back to you soon.", "success");
      form.reset();
    } catch (err) {
      console.error("Contact form submission failed:", err);
      showStatus("Something went wrong. Please try again or email me directly.", "error");
    } finally {
      setSubmitting(false);
    }
  });

  function showStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = "form-status is-" + type;
  }

  function setSubmitting(isSubmitting) {
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    submitBtn.textContent = isSubmitting ? "Sending..." : "Send Message";
  }
})();
