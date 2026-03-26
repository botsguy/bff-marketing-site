(function () {
      const state = {
        businessType: '',
        bookingMethod: '',
        frustrations: [],
        bookingsPerMonth: '',
        name: '',
        email: ''
      };

      const steps = Array.from(document.querySelectorAll('.slide-step'));
      const stepCount = document.getElementById('stepCount');
      const progressFill = document.getElementById('progressFill');
      const backLink = document.getElementById('backLink');
      const surveyForm = document.getElementById('surveyForm');
      const loadingState = document.getElementById('loadingState');
      const formContainer = document.querySelector('.survey-form').parentElement;
      let currentStep = 1;

      // ===== UPDATE STEP VISIBILITY =====
      function showStep(stepNumber) {
        currentStep = stepNumber;
        steps.forEach((step) => step.classList.remove('active'));
        const activeStep = document.querySelector(`[data-step="${stepNumber}"]`);
        if (activeStep) activeStep.classList.add('active');
        stepCount.textContent = stepNumber;
        progressFill.style.width = `${(stepNumber / 5) * 100}%`;
        backLink.classList.toggle('hidden', stepNumber === 1);
        updateDots(stepNumber);
      }

      // ===== UPDATE PROGRESS DOTS =====
      function updateDots(stepNumber) {
        for (let i = 1; i <= 5; i++) {
          const dot = document.getElementById(`dot-${i}`);
          if (!dot) continue;
          if (i < stepNumber) dot.className = 'h-2 rounded-full bg-[#F8B4D9]';
          else if (i === stepNumber) dot.className = 'h-2 rounded-full bg-[#E91E8C]';
          else dot.className = 'h-2 rounded-full bg-[#0A0A0A]/15';
        }
      }

      // ===== HANDLE TILE SELECTIONS =====
      function handleTileClick(button) {
        const field = button.dataset.field;
        const value = button.dataset.value;
        const parentStep = button.closest('[data-step]');
        const isMulti = field === 'frustrations';

        if (isMulti) {
          const index = state.frustrations.indexOf(value);
          if (index > -1) {
            state.frustrations.splice(index, 1);
            button.classList.remove('selected');
          } else {
            state.frustrations.push(value);
            button.classList.add('selected');
          }
          return;
        }

        parentStep.querySelectorAll(`[data-field="${field}"]`).forEach((btn) => btn.classList.remove('selected'));
        button.classList.add('selected');
        state[field] = value;

        if (field === 'businessType') document.getElementById('next1').disabled = false;
        if (field === 'bookingMethod') document.getElementById('next2').disabled = false;
        if (field === 'bookingsPerMonth') document.getElementById('next4').disabled = false;
      }

      // ===== ADVANCE TO NEXT STEP =====
      function goNext() {
        if (currentStep < 5) showStep(currentStep + 1);
      }

      // ===== GO TO PREVIOUS STEP =====
      function goBack(e) {
        e.preventDefault();
        if (currentStep > 1) showStep(currentStep - 1);
      }

      // ===== FINAL FORM SUBMISSION =====
      async function handleFinalSubmit(e) {
        if (e) e.preventDefault();
        
        // Get name and email from step 5 inputs
        const nameVal = document.querySelector('#fullName') ? document.querySelector('#fullName').value.trim() : '';
        const emailVal = document.querySelector('#emailAddress') ? document.querySelector('#emailAddress').value.trim() : '';
        
        // Validate
        if (!nameVal || !emailVal) {
          alert('Please enter your name and email.');
          return;
        }

        // Save to localStorage
        localStorage.setItem('bff_survey_answers', JSON.stringify({
          name: nameVal,
          email: emailVal,
          businessType: state.businessType || '',
          bookingMethod: state.bookingMethod || '',
          frustrations: Array.isArray(state.frustrations) ? state.frustrations.join(', ') : (state.frustrations || ''),
          bookingsPerMonth: state.bookingsPerMonth || ''
        }));

        // Fill the hidden form
        document.getElementById('hf-name').value = nameVal;
        document.getElementById('hf-email').value = emailVal;
        document.getElementById('hf-business').value = state.businessType || '';
        document.getElementById('hf-booking').value = state.bookingMethod || '';
        document.getElementById('hf-frustrations').value = Array.isArray(state.frustrations) ? state.frustrations.join(', ') : (state.frustrations || '');
        document.getElementById('hf-bookings').value = state.bookingsPerMonth || '';

        // Submit the hidden form to the iframe (no CORS, no page redirect)
        document.getElementById('paymegpt-hidden-form').submit();

        // Show loading state
        const btn = document.querySelector('.submit-btn') || document.querySelector('button[type="submit"]') || document.querySelector('button');
        if (btn) btn.textContent = 'Let me show you the demo...';

        // Wait 1 second then redirect
        setTimeout(() => {
          window.location.href = 'https://paymegpt.com/p/pdYB8WVW';
        }, 1000);
      }

      document.querySelectorAll('.tile-btn').forEach((button) => {
        button.addEventListener('click', () => handleTileClick(button));
      });

      document.getElementById('next1').addEventListener('click', goNext);
      document.getElementById('next2').addEventListener('click', goNext);
      document.getElementById('next3').addEventListener('click', goNext);
      document.getElementById('next4').addEventListener('click', goNext);
      backLink.addEventListener('click', goBack);
      surveyForm.addEventListener('submit', handleFinalSubmit);

      showStep(1);
    })();