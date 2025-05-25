// toggleview.js
document.addEventListener('DOMContentLoaded', function () {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const primaryNav = document.getElementById('primaryNav');

  hamburgerBtn.addEventListener('click', () => {
    primaryNav.classList.toggle('open');
    
    // Toggle aria-expanded for accessibility
    const expanded = hamburgerBtn.getAttribute('aria-expanded') === 'true' || false;
    hamburgerBtn.setAttribute('aria-expanded', !expanded);
  });
});
