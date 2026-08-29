/* ==========================================================================
   ZAMIFY — Form Handling
   Validation, submission, FAQ accordion
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── Contact Form Validation & Submission ──────────────────────────────
  const form = document.getElementById('contact-form');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous errors
      form.querySelectorAll('.form-error').forEach((err) => err.remove());
      form.querySelectorAll('.has-error').forEach((el) => el.classList.remove('has-error'));

      const name = form.querySelector('#form-name');
      const email = form.querySelector('#form-email');
      const service = form.querySelector('#form-service');
      const message = form.querySelector('#form-message');
      let isValid = true;

      // Name validation
      if (!name.value.trim()) {
        showError(name, 'Please enter your name');
        isValid = false;
      }

      // Email validation
      if (!email.value.trim()) {
        showError(email, 'Please enter your email');
        isValid = false;
      } else if (!isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
      }

      // Service validation
      if (!service.value) {
        showError(service, 'Please select a service');
        isValid = false;
      }

      if (!isValid) return;

      // Submit — Formspree placeholder
      const submitBtn = form.querySelector('.form-submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        // Replace YOUR_FORMSPREE_ID with actual Formspree endpoint
        const response = await fetch(form.action || '#', {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          // Success
          form.innerHTML = `
            <div style="text-align: center; padding: var(--space-12) 0;">
              <svg width="48" height="48" viewBox="0 0 256 256" fill="none" style="margin: 0 auto var(--space-5);">
                <circle cx="128" cy="128" r="120" stroke="currentColor" stroke-width="8" fill="none"/>
                <polyline points="88,136 112,160 168,104" stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <h3 style="margin-bottom: var(--space-3);">Thank you!</h3>
              <p class="text-secondary">We've received your message and will get back to you soon.</p>
            </div>
          `;
        } else {
          throw new Error('Submission failed');
        }
      } catch (error) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        showError(submitBtn.parentElement || form, 'Something went wrong. Please try again or email us directly.');
      }
    });
  }

  function showError(element, message) {
    element.classList.add('has-error');
    const errorEl = document.createElement('span');
    errorEl.className = 'form-error';
    errorEl.textContent = message;
    if (element.parentElement.classList.contains('form-group')) {
      element.parentElement.appendChild(errorEl);
    } else {
      element.after(errorEl);
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ── FAQ Accordion ─────────────────────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all
      faqItems.forEach((other) => other.classList.remove('is-open'));

      // Toggle current
      if (!isOpen) {
        item.classList.add('is-open');
      }
    });

    // Keyboard support
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });
});
