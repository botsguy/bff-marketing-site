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
      async function handleSubmit(e) {
        e.preventDefault();
        const answers = state;

        loadingState.classList.remove('hidden');
        surveyForm.classList.add('hidden');

        const nameInput = document.querySelector('#fullName') || document.querySelector('input[placeholder*="name" i]') || document.querySelector('input[type="text"]');
        const emailInput = document.querySelector('#email') || document.querySelector('input[type="email"]');
        const fullName = nameInput ? nameInput.value.trim() : '';
        const emailVal = emailInput ? emailInput.value.trim() : '';

        // Save to localStorage
        localStorage.setItem('bff_survey_answers', JSON.stringify({
          name: fullName, email: emailVal,
          businessType: answers.businessType || '',
          bookingMethod: answers.bookingMethod || '',
          frustrations: Array.isArray(answers.frustrations) ? answers.frustrations.join(', ') : (answers.frustrations || ''),
          bookingsPerMonth: answers.bookingsPerMonth || ''
        }));

        // Submit via hidden iframe to avoid CORS and page redirect
        try {
          // Create hidden iframe to receive the form response
          const iframe = document.createElement('iframe');
          iframe.name = 'bff_submit_frame';
          iframe.style.display = 'none';
          document.body.appendChild(iframe);

          // Create hidden form targeting the iframe
          const hiddenForm = document.createElement('form');
          hiddenForm.method = 'POST';
          hiddenForm.action = 'https://paymegpt.com/forms/xdsb5rnv/submit';
          hiddenForm.target = 'bff_submit_frame';
          hiddenForm.style.display = 'none';

          const fields = {
            'Name': fullName,
            'Email': emailVal,
            'Business Type': answers.businessType || '',
            'Booking Method': answers.bookingMethod || '',
            'Frustrations': Array.isArray(answers.frustrations) ? answers.frustrations.join(', ') : (answers.frustrations || ''),
            'Monthly Bookings': answers.bookingsPerMonth || '',
            'Submitted At': new Date().toLocaleString()
          };

          for (const [key, value] of Object.entries(fields)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            hiddenForm.appendChild(input);
          }

          document.body.appendChild(hiddenForm);
          hiddenForm.submit();

          // Small delay to let form submit before redirect
          await new Promise(resolve => setTimeout(resolve, 800));
        } catch(e) {
          console.log('Submit error:', e);
        }

        window.location.href = 'https://paymegpt.com/p/pdYB8WVW';
      }

      document.querySelectorAll('.tile-btn').forEach((button) => {
        button.addEventListener('click', () => handleTileClick(button));
      });

      document.getElementById('next1').addEventListener('click', goNext);
      document.getElementById('next2').addEventListener('click', goNext);
      document.getElementById('next3').addEventListener('click', goNext);
      document.getElementById('next4').addEventListener('click', goNext);
      backLink.addEventListener('click', goBack);
      surveyForm.addEventListener('submit', handleSubmit);

      showStep(1);
    })();