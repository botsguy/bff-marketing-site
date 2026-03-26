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

    const bt = p.get('bt') || '';
    const bm = p.get('bm') || '';
    const fr = p.get('fr') || '';
    const mb = p.get('mb') || '';
    const submittedAt = new Date().toLocaleString();

    // Write to Google Sheet via PayMeGPT API
    fetch('https://paymegpt.com/api/v1/sheets/rows', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer api_467c627269da737e8946ed75ada458834a7d9b2a19f96705fe824537a831ec14'
      },
      body: JSON.stringify({
        spreadsheetId: '1xzw0m4JanLVV9si8aZcltY2UJoz-zxB3fCP2bqTyrdc',
        sheetName: 'Sheet1',
        data: {
          'Name': name,
          'Email': email,
          'Business Type': bt,
          'Booking Method': bm,
          'Frustrations': fr,
          'Monthly Bookings': mb,
          'Submitted At': submittedAt
        }
      })
    }).catch(function(){});

    // Create contact via PayMeGPT API
    fetch('https://paymegpt.com/api/v1/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer api_467c627269da737e8946ed75ada458834a7d9b2a19f96705fe824537a831ec14'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        widgetId: 66300591,
        company: bt,
        notes: 'Business Type: ' + bt + '\nBooking Method: ' + bm + '\nFrustrations: ' + fr + '\nMonthly Bookings: ' + mb + '\nSubmitted: ' + submittedAt,
        pipelineId: 92,
        pipelineStage: 'New Lead'
      })
    }).catch(function(){});

  } catch(e) {}
})();