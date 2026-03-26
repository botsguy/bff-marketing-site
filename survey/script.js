window.answers = {
      businessType: '',
      bookingMethod: '',
      frustrations: [],
      bookingsPerMonth: ''
    };

    (function () {
      const steps = Array.from(document.querySelectorAll('.slide-step'));
      const stepCount = document.getElementById('stepCount');
      const progressFill = document.getElementById('progressFill');
      const backLink = document.getElementById('backLink');
      const surveyForm = document.getElementById('surveyForm');
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
          const index = window.answers.frustrations.indexOf(value);
          if (index > -1) {
            window.answers.frustrations.splice(index, 1);
            button.classList.remove('selected');
          } else {
            window.answers.frustrations.push(value);
            button.classList.add('selected');
          }
          return;
        }

        parentStep.querySelectorAll(`[data-field="${field}"]`).forEach((btn) => btn.classList.remove('selected'));
        button.classList.add('selected');
        window.answers[field] = value;

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

      document.querySelectorAll('.tile-btn').forEach((button) => {
        button.addEventListener('click', () => handleTileClick(button));
      });

      document.getElementById('next1').addEventListener('click', goNext);
      document.getElementById('next2').addEventListener('click', goNext);
      document.getElementById('next3').addEventListener('click', goNext);
      document.getElementById('next4').addEventListener('click', goNext);
      backLink.addEventListener('click', goBack);

      showStep(1);
    })();

    async function submitSurvey() {
      const nameVal = document.getElementById('survey-name').value.trim();
      const emailVal = document.getElementById('survey-email').value.trim();
      
      if (!nameVal || !emailVal) {
        alert('Please enter your name and email to continue.');
        return;
      }
      
      if (!emailVal.includes('@')) {
        alert('Please enter a valid email address.');
        return;
      }

      // Update button state
      const btn = document.getElementById('survey-submit-btn');
      btn.textContent = 'Let me show you the demo...';
      btn.style.opacity = '0.8';
      btn.style.cursor = 'not-allowed';

      // Save everything to localStorage
      const surveyData = {
        name: nameVal,
        email: emailVal,
        businessType: typeof answers !== 'undefined' ? (answers.businessType || answers.step1 || '') : '',
        bookingMethod: typeof answers !== 'undefined' ? (answers.bookingMethod || answers.step2 || '') : '',
        frustrations: typeof answers !== 'undefined' ? (Array.isArray(answers.frustrations) ? answers.frustrations.join(', ') : (answers.frustrations || answers.step3 || '')) : '',
        bookingsPerMonth: typeof answers !== 'undefined' ? (answers.bookingsPerMonth || answers.step4 || '') : ''
      };
      localStorage.setItem('bff_survey_answers', JSON.stringify(surveyData));

      // Redirect to demo page
      window.location.href = 'https://paymegpt.com/p/pdYB8WVW';
    }