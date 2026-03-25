// ===== PRICING REVEAL CONTROLLER =====
    // Function: revealPricing()
    // Purpose: Smoothly show pricing and urgency sections once the video reaches the trigger point
    // Trigger: Called by video timeupdate (>= 60s) or ended event
    function revealPricing() {
      const pricingSection = document.getElementById('pricingSection');
      const urgencySection = document.getElementById('urgencySection');
      if (!pricingSection || !urgencySection) return;
      if (pricingSection.classList.contains('pricing-visible')) return;

      pricingSection.classList.add('pricing-visible');
      urgencySection.classList.add('pricing-visible');

      const cards = document.querySelectorAll('[data-card]');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('show');
        }, index * 150);
      });
    }

    // ===== VIDEO EVENT BINDING =====
    // Function: initVideoReveal()
    // Purpose: Monitor video playback and reveal pricing after 60 seconds or on end
    // Triggers: timeupdate and ended events on the sales video
    function initVideoReveal() {
      const video = document.getElementById('salesVideo');
      if (!video) return;

      const maybeReveal = function() {
        if (video.currentTime >= 60) {
          revealPricing();
        }
      };

      video.addEventListener('timeupdate', maybeReveal);
      video.addEventListener('ended', revealPricing);
    }

    // ===== PAGE LOAD ANIMATIONS =====
    // Function: initEntryAnimations()
    // Purpose: Stagger hero and video section reveal for a polished first impression
    // Trigger: DOMContentLoaded
    function initEntryAnimations() {
      const hook = document.querySelector('[data-section="video-hook"]');
      const videoSection = document.querySelector('[data-section="video-player"]');
      if (hook) {
        hook.classList.add('fade-in-up');
      }
      if (videoSection) {
        setTimeout(() => {
          videoSection.classList.add('fade-in-up');
        }, 180);
      }
    }

    document.addEventListener('DOMContentLoaded', function() {
      initEntryAnimations();
      initVideoReveal();
    });