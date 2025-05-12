// JavaScript (navigation.js)

// Handle the hamburger menu toggle
const menuButton = document.getElementById('hamburger'); // ✅ Corrected ID
const nav = document.getElementById('navMenu');

menuButton.addEventListener('click', () => {
    nav.classList.toggle('active'); // Toggle visibility
});

// Highlight the active navigation link based on the current page
const setActiveLink = () => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('#navMenu a');

    navLinks.forEach(link => {
        if (link.href.includes(currentPath)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
};

setActiveLink();
