// ===== NAV SCROLL STATE =====
    // Function: updateNavState()
    // Purpose: Increase nav opacity and add editorial depth after scrolling
    // Triggers: Window scroll position changes
    function updateNavState() {
      const nav = document.getElementById('siteNav');
      if (!nav) return;
      nav.classList.toggle('nav-scrolled', window.scrollY > 10);
    }

    // ===== INTERSECTION OBSERVER REVEAL =====
    // Function: initScrollReveal()
    // Purpose: Fade and slide elements into view as they enter the viewport
    // Triggers: IntersectionObserver on elements with reveal classes
    function initScrollReveal() {
      const items = document.querySelectorAll('.reveal-on-scroll, .word-reveal');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });
      items.forEach((item) => observer.observe(item));
    }

    // ===== SPARKLE PARTICLE GENERATOR =====
    // Function: createSparkles()
    // Purpose: Create floating decorative star particles for the hero section
    // Triggers: Page load, injects randomized sparkle elements
    function createSparkles() {
      const layer = document.getElementById('sparkleLayer');
      if (!layer) return;
      const stars = ['✦', '✧', '★'];
      for (let i = 0; i < 18; i++) {
        const s = document.createElement('span');
        s.className = 'float-star text-[#E91E8C]';
        s.textContent = stars[i % stars.length];
        s.style.left = Math.random() * 100 + '%';
        s.style.bottom = (-10 - Math.random() * 40) + '%';
        s.style.fontSize = (12 + Math.random() * 18) + 'px';
        s.style.animationDuration = (10 + Math.random() * 10) + 's';
        s.style.animationDelay = (Math.random() * 6) + 's';
        layer.appendChild(s);
      }
    }

    // ===== LOAD SEQUENCE =====
    // Function: initPageMotion()
    // Purpose: Start reveal animations and update navigation state
    // Triggers: DOMContentLoaded
    function initPageMotion() {
      initScrollReveal();
      createSparkles();
      updateNavState();
    }

    window.addEventListener('scroll', updateNavState, { passive: true });
    document.addEventListener('DOMContentLoaded', initPageMotion);