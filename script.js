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

(function() {
  function isMobile() {
    return window.innerWidth <= 768;
  }

  function initFeatureGlow() {
    if (!isMobile()) return;

    // Find all feature cards using multiple selectors
    const cardSelectors = [
      '.feature-card',
      '[class*="feature-card"]',
      '[class*="feature_card"]',
      '.features-grid > div',
      '.features-grid > article',
      '#features .card',
    ];

    let cards = [];
    for (const sel of cardSelectors) {
      const found = document.querySelectorAll(sel);
      if (found.length > 0) {
        cards = Array.from(found);
        break;
      }
    }

    if (cards.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('glow-active');
        } else {
          entry.target.classList.remove('glow-active');
        }
      });
    }, {
      threshold: 0.4,
      rootMargin: '0px 0px -10% 0px'
    });

    cards.forEach(card => observer.observe(card));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFeatureGlow);
  } else {
    initFeatureGlow();
  }

  // Re-init on resize in case user rotates device
  window.addEventListener('resize', initFeatureGlow);
})();