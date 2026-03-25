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

    // ===== SPARKLE PARTICLE GENERATOR =====
    function createSparkles() {
      const layer = document.getElementById('sparkleLayer');
      if (!layer) return;
      const stars = ['✦', '✧', '★'];
      for (let i = 0; i < 22; i++) {
        const s = document.createElement('span');
        s.className = 'float-star text-[#E91E8C]';
        s.textContent = stars[i % stars.length];
        s.style.left = Math.random() * 100 + '%';
        s.style.bottom = (-10 - Math.random() * 40) + '%';
        s.style.fontSize = (12 + Math.random() * 20) + 'px';
        s.style.animationDuration = (8 + Math.random() * 12) + 's';
        s.style.animationDelay = (Math.random() * 5) + 's';
        layer.appendChild(s);
      }
    }

    function initPageMotion() {
      initScrollReveal();
      createSparkles();
      updateNavState();
    }

    window.addEventListener('scroll', updateNavState, { passive: true });
    document.addEventListener('DOMContentLoaded', initPageMotion);