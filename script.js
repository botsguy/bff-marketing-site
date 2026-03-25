// ===== NAV SCROLL STATE =====
    function updateNavState() {
      const nav = document.getElementById('siteNav');
      if (!nav) return;
      nav.classList.toggle('nav-scrolled', window.scrollY > 10);
    }

    // ===== INTERSECTION OBSERVER REVEAL =====
    function initScrollReveal() {
      const items = document.querySelectorAll('.reveal-on-scroll, .word-reveal');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
      items.forEach((item) => observer.observe(item));
    }

    function initPageMotion() {
      initScrollReveal();
      updateNavState();
    }

    window.addEventListener('scroll', updateNavState, { passive: true });
    document.addEventListener('DOMContentLoaded', initPageMotion);