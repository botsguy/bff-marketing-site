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
      // Function: showStep(stepNumber)
      // Purpose: Display only the active survey step and update progress states
      // Triggers: Called whenever user advances or goes back
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
      // Function: updateDots(stepNumber)
      // Purpose: Fill completed steps and highlight the current step in the indicator
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
      // Function: handleTileClick(button)
      // Purpose: Save single-select and multi-select answers with visual selection states
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
      // Function: goNext()
      // Purpose: Move forward with a smooth transition and persist current state
      function goNext() {
        if (currentStep < 5) showStep(currentStep + 1);
      }

      // ===== GO TO PREVIOUS STEP =====
      // Function: goBack(e)
      // Purpose: Navigate back one step without losing prior answers
      function goBack(e) {
        e.preventDefault();
        if (currentStep > 1) showStep(currentStep - 1);
      }

      // ===== SAVE ANSWERS TO LOCAL STORAGE =====
      // Function: saveAnswers()
      // Purpose: Store the survey object for later retrieval and redirect continuity
      function saveAnswers() {
        localStorage.setItem('bff_survey_answers', JSON.stringify(state));
      }

      // ===== FINAL FORM SUBMISSION =====
      // Function: handleSubmit(e)
      // Purpose: Validate contact details, show loading state, persist answers, then redirect
      function handleSubmit(e) {
        e.preventDefault();
        state.name = document.getElementById('fullName').value.trim();
        state.email = document.getElementById('emailAddress').value.trim();

        if (!state.name || !state.email) {
          alert('Please enter your full name and email address.');
          return;
        }

        saveAnswers();
        loadingState.classList.remove('hidden');
        surveyForm.classList.add('hidden');

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