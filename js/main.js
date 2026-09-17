/* ==========================================================================
   ZAMIFY — Main JavaScript
   Premium scroll animations, parallax, magnetic buttons, card tilt, theme
   ========================================================================== */

// ── Theme Management (Run immediately) ────────────────────────────────
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  document.documentElement.setAttribute('data-theme', 'dark');
}

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Event Listener
  const themeToggles = document.querySelectorAll('.theme-toggle');
  
  function updateThemeIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeToggles.forEach(toggle => {
      const icon = toggle.querySelector('i');
      if (icon) {
        if (isDark) {
          icon.classList.remove('ph-moon');
          icon.classList.add('ph-sun');
        } else {
          icon.classList.remove('ph-sun');
          icon.classList.add('ph-moon');
        }
      }
    });
  }

  // Initial icon update
  updateThemeIcon();

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon();
    });
  });

  // Respect reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Scroll Reveal Animations ──────────────────────────────────────────
  if (!prefersReducedMotion) {
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // If reduced motion, show everything immediately
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('is-visible');
    });
  }

  // ── Stat Counter Animation ────────────────────────────────────────────
  const statNumbers = document.querySelectorAll('[data-count]');

  if (statNumbers.length > 0) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'), 10);
            const suffix = el.getAttribute('data-suffix') || '';
            const prefix = el.getAttribute('data-prefix') || '';
            const duration = prefersReducedMotion ? 0 : 2000;

            if (duration === 0) {
              el.textContent = prefix + target + suffix;
              countObserver.unobserve(el);
              return;
            }

            let start = 0;
            const startTime = performance.now();

            function updateCount(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);

              // Spring-like ease out
              const eased = 1 - Math.pow(1 - progress, 5);
              const current = Math.floor(eased * target);

              el.textContent = prefix + current + suffix;

              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                el.textContent = prefix + target + suffix;
              }
            }

            requestAnimationFrame(updateCount);
            countObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach((el) => countObserver.observe(el));
  }

  // ── Parallax Hero Glow on Scroll ──────────────────────────────────────
  if (!prefersReducedMotion) {
    const heroGlow = document.querySelector('.hero__glow');
    if (heroGlow) {
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            if (scrollY < 1000) {
              heroGlow.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.15}px))`;
              heroGlow.style.opacity = Math.max(0, 1 - scrollY / 600);
            }
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }
  }

  // ── Magnetic Button Hover Effect ──────────────────────────────────────
  if (!prefersReducedMotion && window.innerWidth > 768) {
    const magneticBtns = document.querySelectorAll('.btn--primary, .btn--on-dark');
    
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translateY(-2px) translate(${x * 0.15}px, ${y * 0.15}px)`;
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ── Service Card 3D Tilt ──────────────────────────────────────────────
  if (!prefersReducedMotion && window.innerWidth > 1024) {
    const tiltCards = document.querySelectorAll('.service-card, .differentiator');
    
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        const rotateX = (y - 0.5) * -6;
        const rotateY = (x - 0.5) * 6;
        
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)';
        setTimeout(() => {
          card.style.transition = '';
        }, 500);
      });
    });
  }

  // ── Smooth scroll for anchor links ────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = document.querySelector('.nav')?.offsetHeight || 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      }
    });
  });
});
