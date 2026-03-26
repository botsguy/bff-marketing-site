// ===== PRICING REVEAL CONTROLLER =====
    // Function: revealPricing()
    // Purpose: Smoothly show pricing and urgency sections once the video reaches the trigger point
    function revealPricing() {
      const pricingSection = document.getElementById('pricingSection');
      const urgencySection = document.getElementById('urgencySection');
      if (!pricingSection || !urgencySection) return;
      if (pricingSection.classList.contains('pricing-revealed')) return;

      // Reveal sections by swapping classes
      pricingSection.classList.remove('pricing-hidden');
      pricingSection.classList.add('pricing-revealed');
      urgencySection.classList.remove('pricing-hidden');
      urgencySection.classList.add('pricing-revealed');

      const cards = document.querySelectorAll('[data-card]');
      cards.forEach((card, index) => {
        // Delay card animations slightly after the container starts opening
        setTimeout(() => {
          card.classList.add('show');
        }, 400 + (index * 150));
      });
    }

    // ===== VIDEO EVENT BINDING =====
    // Function: initVideoReveal()
    // Purpose: Monitor video playback and reveal pricing after 60 seconds or on end
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

(function() {
  try {
    const p = new URLSearchParams(window.location.search);
    const name = p.get('name');
    const email = p.get('email');
    if (!name || !email) return;

    const notes = [
      'Business Type: ' + (p.get('b') || 'N/A'),
      'Booking Method: ' + (p.get('m') || 'N/A'),
      'Frustrations: ' + (p.get('f') || 'N/A'),
      'Monthly Bookings: ' + (p.get('bpm') || 'N/A'),
      'Source: BFF Survey',
      'Date: ' + new Date().toLocaleString()
    ].join('\n');

    // Use the PayMeGPT widget chat API to create contact
    fetch('https://paymegpt.com/api/v1/widget/66300591/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'NEW SURVEY LEAD: ' + name + ' | ' + email + '\n' + notes,
        contactName: name,
        contactEmail: email,
        createContact: true,
        notes: notes
      })
    }).catch(() => {});

  } catch(e) {}
})();