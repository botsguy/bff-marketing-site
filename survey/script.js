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
        state.name = document.getElementById('fullName').value.trim();
        state.email = document.getElementById('emailAddress').value.trim();

        if (!state.name || !state.email) {
          alert('Please enter your full name and email address.');
          return;
        }

        loadingState.classList.remove('hidden');
        surveyForm.classList.add('hidden');

        // Collect all survey answers
        const surveyData = {
          businessType: localStorage.getItem('bff_businessType') || state.businessType || '',
          bookingMethod: localStorage.getItem('bff_bookingMethod') || state.bookingMethod || '',
          frustrations: localStorage.getItem('bff_frustrations') || (state.frustrations ? (Array.isArray(state.frustrations) ? state.frustrations.join(', ') : state.frustrations) : ''),
          bookingsPerMonth: localStorage.getItem('bff_bookingsPerMonth') || state.bookingsPerMonth || '',
          name: document.getElementById('fullName') ? document.getElementById('fullName').value : '',
          email: document.getElementById('emailAddress') ? document.getElementById('emailAddress').value : ''
        };

        // Also save to localStorage
        localStorage.setItem('bff_survey_answers', JSON.stringify(surveyData));

        // POST to PayMeGPT contacts API
        try {
          const nameParts = surveyData.name.trim().split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          await fetch('https://paymegpt.com/api/contacts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Widget-ID': '66300591'
            },
            body: JSON.stringify({
              firstName: firstName,
              lastName: lastName,
              email: surveyData.email,
              phone: '',
              company: surveyData.businessType,
              notes: `BFF Survey Lead\n\nBusiness Type: ${surveyData.businessType}\nCurrent Booking Method: ${surveyData.bookingMethod}\nBiggest Frustrations: ${surveyData.frustrations}\nMonthly Bookings: ${surveyData.bookingsPerMonth}\nSurvey Completed: ${new Date().toLocaleDateString()}`,
              pipelineId: 92,
              pipelineStage: 'New Lead',
              tags: ['survey-lead', 'bff-funnel', surveyData.businessType.toLowerCase().replace(/\s+/g, '-')]
            })
          });
        } catch(e) {
          // Fail silently — don't block redirect if API call fails
          console.log('Contact creation error:', e);
        }

        setTimeout(() => {
          window.location.href = 'https://paymegpt.com/p/pdYB8WVW';
        }, 1500);
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