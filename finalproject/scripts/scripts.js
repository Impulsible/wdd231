document.addEventListener('DOMContentLoaded', () => {
  // Hamburger Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.getElementById('nav-menu') || document.querySelector('.nav-links');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !expanded);
      navMenu.classList.toggle('show');
      navMenu.toggleAttribute('hidden', !navMenu.classList.contains('show'));
    });
  }

  // Scroll to Top Button
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Footer Dates
  const yearEl = document.getElementById('currentYear');
  const modifiedEl = document.getElementById('last-modified');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (modifiedEl) modifiedEl.textContent = `Last Modified: ${document.lastModified}`;

 

  // Story Submission (explore.html)
  const form = document.querySelector("#story-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.querySelector("#name").value.trim();
      const email = document.querySelector("#email").value.trim();
      const story = document.querySelector("#story").value.trim();
      const imageInput = document.querySelector("#image");
      const timestamp = new Date().toISOString();

      if (name && email && story.length >= 20) {
        const newStory = { name, email, story, timestamp };
        const reader = new FileReader();

        reader.onload = function (e) {
          newStory.image = e.target.result;
          saveAndRedirect(newStory);
        };

        if (imageInput?.files[0]) {
          reader.readAsDataURL(imageInput.files[0]);
        } else {
          newStory.image = "";
          saveAndRedirect(newStory);
        }
      } else {
        alert("Please fill out all fields correctly.");
      }
    });

    function saveAndRedirect(newStory) {
      localStorage.setItem("latestStory", JSON.stringify(newStory));
      const stories = JSON.parse(localStorage.getItem("communityStories")) || [];
      stories.push(newStory);
      localStorage.setItem("communityStories", JSON.stringify(stories));
      window.location.href = "story-confirmation.html";
    }
  }

  // Story Confirmation Page
  const latestStory = JSON.parse(localStorage.getItem("latestStory"));
  if (document.getElementById("user-name")) {
    if (latestStory) {
      document.getElementById("user-name").textContent = latestStory.name;
      document.getElementById("user-email").textContent = latestStory.email;
      document.getElementById("user-story").textContent = latestStory.story;
    } else {
      document.querySelector(".confirmation").innerHTML = `
        <h1>Oops! No story found.</h1>
        <p>Please return to the Explore page and submit your story again.</p>
        <a href="explore.html" class="back-button">Back to Explore</a>
      `;
    }
  }

  // Community Stories Page
  const communityContainer = document.getElementById("community-stories");
  if (communityContainer) {
    const stories = JSON.parse(localStorage.getItem("communityStories")) || [];
    if (!stories.length) {
      communityContainer.innerHTML = `<p class="empty-message">No stories submitted yet. Be the first to share yours!</p>`;
    } else {
      stories.reverse().forEach(story => {
        const card = document.createElement("div");
        card.className = "story-card";
        if (story.image) {
          const img = document.createElement("img");
          img.src = story.image;
          img.alt = "User uploaded photo";
          card.appendChild(img);
        }
        card.innerHTML += `
          <h2>${story.name}</h2>
          <p><strong>Email:</strong> ${story.email}</p>
          <p>${story.story}</p>
          <small>Submitted on: ${new Date(story.timestamp).toLocaleString()}</small>
        `;
        communityContainer.appendChild(card);
      });
    }
  }
});
document.addEventListener('DOMContentLoaded', async () => {
  const cardsContainer = document.getElementById('cards-container');
  const filterRadios = document.querySelectorAll('input[name="category"]');
  let peopleData = [];

  // Load JSON data
  try {
    const response = await fetch('people.json');
    peopleData = await response.json();
  } catch (error) {
    cardsContainer.innerHTML = "<p>Error loading people data.</p>";
    console.error(error);
    return;
  }

  // Helper to capitalize first letter
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Function to render cards filtered by category
  function renderCards(category = 'all') {
    cardsContainer.innerHTML = '';

    const filteredPeople = category === 'all' ? peopleData :
      peopleData.filter(person => person.category === category);

    if (filteredPeople.length === 0) {
      cardsContainer.innerHTML = '<p>No people found for this category.</p>';
      return;
    }

    filteredPeople.forEach(person => {
      const card = document.createElement('article');
      card.className = 'person-card';

      card.innerHTML = `
        <img src="${person.image}" alt="Portrait of ${person.name}" loading="lazy" />
        <h3>${person.name}</h3>
        <p class="market-category">${person.market} — ${capitalize(person.category)} Market</p>
        <a href="story.html?id=${encodeURIComponent(person.id)}" class="read-story-link" aria-label="Read story of ${person.name}">Read Story</a>
      `;

      cardsContainer.appendChild(card);
    });
  }

  // Initial render: all categories
  renderCards();

  // Listen for filter changes
  filterRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      renderCards(radio.value);
    });
  });
});

  const toggleButton = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  toggleButton.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const expanded = toggleButton.getAttribute('aria-expanded') === 'true' || false;
    toggleButton.setAttribute('aria-expanded', !expanded);
  });


