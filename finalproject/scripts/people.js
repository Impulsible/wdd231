// === Navigation & UI ===
document.addEventListener('DOMContentLoaded', () => {
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

  const scrollBtn = document.getElementById('scrollTopBtn');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const yearEl = document.getElementById('currentYear');
  const modifiedEl = document.getElementById('lastModified') || document.getElementById('last-modified');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (modifiedEl) modifiedEl.textContent = `Last Modified: ${document.lastModified}`;

  const toggleButton = document.getElementById('menu-toggle');
  if (toggleButton && navMenu) {
    toggleButton.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const expanded = toggleButton.getAttribute('aria-expanded') === 'true' || false;
      toggleButton.setAttribute('aria-expanded', !expanded);
    });
  }
});

// === Story Submission (explore.html) ===
document.addEventListener('DOMContentLoaded', () => {
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
});

// === Story Confirmation ===
document.addEventListener('DOMContentLoaded', () => {
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
});

// === Community Page Rendering ===
document.addEventListener('DOMContentLoaded', () => {
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

// === People Page Logic ===
document.addEventListener('DOMContentLoaded', async () => {
  const cardsContainer = document.getElementById('cards-container');
  const filterRadios = document.querySelectorAll('input[name="category"]');
  let peopleData = [];

  try {
    const response = await fetch('https://impulsible.github.io/wdd231/finalproject/people.json');
    peopleData = await response.json();
  } catch (error) {
    if (cardsContainer) cardsContainer.innerHTML = "<p>Error loading people data.</p>";
    console.error(error);
    return;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function renderCards(category = 'all') {
    if (!cardsContainer) return;
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
        <img src="${person.image}" alt="Portrait of ${person.name}" loading="lazy">
        <h3>${person.name}</h3>
        <p class="market-category">${person.market} — ${capitalize(person.category)} Market</p>
        <a href="story.html?id=${encodeURIComponent(person.id)}" class="read-story-link" aria-label="Read story of ${person.name}">Read Story</a>
      `;

      cardsContainer.appendChild(card);
    });
  }

  renderCards();

  filterRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      renderCards(radio.value);
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Optional: Close menu when a nav link is clicked (on mobile)
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }
});

// Utility: Get all stories from localStorage
function getStories() {
  return JSON.parse(localStorage.getItem('lagosStories') || '[]');
}

// Utility: Save stories back to localStorage
function saveStories(stories) {
  localStorage.setItem('lagosStories', JSON.stringify(stories));
  window.dispatchEvent(new Event('storage')); // ✅ Force update across all pages/tabs
}

// Utility: Convert image to base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}

// Display 2 recent stories in carousel (index or explore)
function displayRecentStories() {
  const carousel = document.getElementById('recent-stories-carousel');
  if (!carousel) return;

  const stories = getStories().slice(-2).reverse();
  carousel.innerHTML = '';

  stories.forEach(story => {
    const card = document.createElement('div');
    card.className = 'story-card';
    card.innerHTML = `
      ${story.image ? `<img src="${story.image}" alt="Story photo">` : ''}
      <div class="story-info">
        <h4>${story.name}</h4>
        <p>${story.story.slice(0, 100)}...</p>
        <small>${new Date(story.timestamp).toLocaleString()}</small>
      </div>
    `;
    carousel.appendChild(card);
  });
}

// Display all community stories
function displayCommunityStories() {
  const communityList = document.getElementById('community-story-list');
  if (!communityList) return;

  const stories = getStories();
  communityList.innerHTML = '';

  stories.forEach((story, i) => {
    const div = document.createElement('div');
    div.className = 'story-card';
    div.innerHTML = `
      ${story.image ? `<img src="${story.image}" alt="User image">` : ''}
      <div class="story-info">
        <h4>${story.name}</h4>
        <p>${story.story}</p>
        <small>${new Date(story.timestamp).toLocaleString()}</small>
        <br>
        <button class="delete-btn" data-index="${i}">Delete</button>
      </div>
    `;
    communityList.appendChild(div);
  });

  // Attach delete event listeners after rendering
  communityList.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.dataset.index);
      const stories = getStories();
      stories.splice(index, 1);
      saveStories(stories); // ✅ Updates storage and triggers sync
      displayCommunityStories(); // Re-render community list
    });
  });
}

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const story = form.story.value.trim();
  const imageFile = form.image.files[0];

  if (!name || !email || !story) {
    alert('Please fill in all required fields.');
    return;
  }

  let image = '';
  if (imageFile) {
    try {
      image = await toBase64(imageFile);
    } catch (err) {
      console.error('Image error:', err);
    }
  }

  const newStory = {
    name,
    email,
    story,
    image,
    timestamp: new Date().toISOString()
  };

  const stories = getStories();
  stories.push(newStory);
  saveStories(stories); // ✅ Saves and triggers sync
  form.reset();

  displayRecentStories();

  // Redirect to community page if coming from homepage/explore
  const current = window.location.pathname;
  if (current.includes('explore.html') || current === '/' || current.includes('index.html')) {
    window.location.href = 'community.html';
  }
}

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('story-form');
  if (form) form.addEventListener('submit', handleSubmit);

  displayRecentStories();
  displayCommunityStories();
});

// Cross-tab sync and live updates
window.addEventListener('storage', (e) => {
  if (e.key === 'lagosStories') {
    displayRecentStories();
    displayCommunityStories();
  }
});
    // Set current year
    document.getElementById("currentYear").textContent = new Date().getFullYear();

    // Set last modified date
    document.getElementById("lastModified").textContent =
      "Last Modified: " + document.lastModified;

  document.addEventListener("DOMContentLoaded", function () {
      const menuToggle = document.getElementById("menu-toggle");
      const navMenu = document.getElementById("nav-menu");

      menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        menuToggle.classList.toggle("active");

        const expanded = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", !expanded);
      });
    });

  
    const latestStory = JSON.parse(localStorage.getItem("latestStory"));
    const card = document.getElementById("story-card");

    function formatTimestamp(iso) {
      const date = new Date(iso);
      return date.toLocaleString("en-NG", {
        dateStyle: "medium",
        timeStyle: "short"
      });
    }

    if (latestStory) {
      // ✅ Show the confirmation story
      card.innerHTML = `
        ${latestStory.image ? `<img src="${latestStory.image}" alt="User uploaded photo">` : ""}
        <p><strong>Name:</strong> ${latestStory.name}</p>
        <p><strong>Email:</strong> ${latestStory.email}</p>
        <p><strong>Your Story:</strong></p>
        <p>${latestStory.story}</p>
        <p><strong>Submitted:</strong> ${formatTimestamp(latestStory.timestamp)}</p>
      `;

      // ✅ Save to communityStories array
      const communityStories = JSON.parse(localStorage.getItem("communityStories")) || [];
      communityStories.push(latestStory);
      localStorage.setItem("communityStories", JSON.stringify(communityStories));

      // Optional: clear latestStory to avoid duplicate submission
      // localStorage.removeItem("latestStory");
    } else {
      card.innerHTML = `
        <h2>Oops! No story found.</h2>
        <p>Please return to the Explore page and submit your story again.</p>
      `;
}
    
    // Set current year
    document.getElementById("currentYear").textContent = new Date().getFullYear();

    // Set last modified date
    document.getElementById("lastModified").textContent =
      "Last Modified: " + document.lastModified;

    const container = document.getElementById("stories-container");
    let stories = JSON.parse(localStorage.getItem("communityStories")) || [];

    function formatTimestamp(iso) {
      const date = new Date(iso);
      return date.toLocaleString("en-NG", {
        dateStyle: "medium",
        timeStyle: "short"
      });
    }

    function renderStories() {
      container.innerHTML = "";

      if (stories.length === 0) {
        container.innerHTML = `<p class="empty-message">No stories yet. Be the first to share yours!</p>`;
        return;
      }

      stories.slice().reverse().forEach((story, index) => {
        const card = document.createElement("div");
        card.className = "story-card";

        card.innerHTML = `
          ${story.image ? `<img src="${story.image}" alt="Story photo" onerror="this.style.display='none'">` : ""}
          <h3>${story.name}</h3>
          <p>${story.story}</p>
          <p class="timestamp">Submitted on: ${formatTimestamp(story.timestamp)}</p>
          <button class="delete-btn" onclick="deleteStory(${index})">🗑️ Delete</button>
        `;

        container.appendChild(card);
      });
    }

    function deleteStory(index) {
      if (confirm("Delete this story?")) {
        const actualIndex = stories.length - 1 - index; // reverse order
        stories.splice(actualIndex, 1);
        localStorage.setItem("communityStories", JSON.stringify(stories));
        renderStories();
      }
    }

    function clearStories() {
      if (confirm("Are you sure you want to delete all community stories?")) {
        localStorage.removeItem("communityStories");
        stories = [];
        renderStories();
      }
    }

renderStories();
    
  // Set current year
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  // Set last modified date
  document.getElementById("lastModified").textContent = 
    "Last Modified: " + document.lastModified;


    document.addEventListener('DOMContentLoaded', async () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');

      if (!id) {
        document.getElementById('story-main').innerHTML = "<p>Story not found.</p>";
        return;
      }

      try {
        const response = await fetch('people.json');
        const data = await response.json();
        const person = data.find(p => p.name.toLowerCase().replace(/\s+/g, '-') === id);

        if (!person) {
          document.getElementById('story-main').innerHTML = "<p>Person not found.</p>";
          return;
        }

        document.getElementById('story-name').textContent = person.name;
        document.getElementById('story-market-category').textContent =
          `${person.market} — ${person.category.charAt(0).toUpperCase() + person.category.slice(1)} Market`;
        document.getElementById('story-image').src = person.image;
        document.getElementById('story-image').alt = `Portrait of ${person.name}`;
        document.getElementById('story-text').textContent = person.story;

      } catch (error) {
        document.getElementById('story-main').innerHTML = "<p>Error loading story.</p>";
        console.error(error);
      }
    });