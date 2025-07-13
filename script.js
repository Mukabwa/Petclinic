// Script for navigation between steps
document.querySelectorAll('.next-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const nextStep = btn.dataset.next;
    goToStep(nextStep);
  });
});

document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const backStep = btn.dataset.back;
    goToStep(backStep);
  });
});

document.querySelectorAll('.step').forEach(nav => {
  nav.addEventListener('click', () => {
    const target = nav.dataset.step;
    goToStep(target);
  });
});

function goToStep(stepNum) {
  // Hide all steps
  document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
  document.querySelector(`#step-${stepNum}`).classList.add('active');

  // Update sidebar active state
  document.querySelectorAll('.step').forEach(nav => nav.classList.remove('active'));
  document.querySelector(`.step[data-step="${stepNum}"]`).classList.add('active');
}
