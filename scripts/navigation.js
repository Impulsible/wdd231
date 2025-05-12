// JavaScript (navigation.js)
const menuButton = document.getElementById('menu');
const nav = document.querySelector('.navigation');

menuButton.addEventListener('click', () => {
    nav.classList.toggle('active'); // Toggles the 'active' class to show/hide the menu on small screens
});
// navigation.js

// Handle the hamburger menu toggle
document.getElementById('menu').addEventListener('click', () => {
    const nav = document.querySelector('nav ul');
    nav.classList.toggle('active'); // Toggle visibility of the menu
});

// Highlight the active navigation link based on the current page
const setActiveLink = () => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
        if (link.href.includes(currentPath)) {
            link.classList.add('active'); // Add active class
        } else {
            link.classList.remove('active'); // Remove active class from other links
        }
    });
};

// Call the function to highlight the active link
setActiveLink();
