/* ==========================================================================
   ZAMIFY — Navigation
   Sticky nav, mobile menu with staggered reveal
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const mobileMenu = document.querySelector('.nav__mobile');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link');
  let isMenuOpen = false;

  // ── Sticky nav on scroll ──────────────────────────────────────────────
  let lastScroll = 0;

  function handleScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll > 60) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ── Mobile menu toggle ────────────────────────────────────────────────
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      toggle.classList.toggle('is-active', isMenuOpen);
      mobileMenu.classList.toggle('is-open', isMenuOpen);
      nav.classList.toggle('is-menu-open', isMenuOpen);
      document.body.style.overflow = isMenuOpen ? 'hidden' : '';

      // Update ARIA
      toggle.setAttribute('aria-expanded', isMenuOpen.toString());
    });

    // Close menu on link click
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        isMenuOpen = false;
        toggle.classList.remove('is-active');
        mobileMenu.classList.remove('is-open');
        nav.classList.remove('is-menu-open');
        document.body.style.overflow = '';
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        isMenuOpen = false;
        toggle.classList.remove('is-active');
        mobileMenu.classList.remove('is-open');
        nav.classList.remove('is-menu-open');
        document.body.style.overflow = '';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }
});
