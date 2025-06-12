document.addEventListener('DOMContentLoaded', () => {
  // Hamburger menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true' || false;
    hamburger.setAttribute('aria-expanded', !expanded);
    navLinks.classList.toggle('show');
    if (navLinks.classList.contains('show')) {
      navLinks.removeAttribute('hidden');
    } else {
      navLinks.setAttribute('hidden', '');
    }
  });

  // Filter buttons for people & markets section
  const filterButtons = document.querySelectorAll('.filters button');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update aria-pressed and active class
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');

      // You would add logic here to filter your cards dynamically
      // (e.g., fetch filtered data or show/hide elements)
    });
  });

  // Scroll to top button
  const scrollBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollBtn.style.display = 'block';
    } else {
      scrollBtn.style.display = 'none';
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Footer dates
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  document.getElementById('last-modified').textContent = `Last Modified: ${document.lastModified}`;
});


// js/people-markets.js
const container = document.getElementById("cards-container");
const modal = document.getElementById("detail-modal");
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalClose = document.getElementById("modal-close");

let peopleData = [];

async function loadPeople() {
  try {
    const res = await fetch("people.json");
    peopleData = await res.json();
    displayPeople("all");
  } catch (err) {
    console.error("Error loading people.json:", err);
  }
}

function displayPeople(category) {
  container.innerHTML = "";
  const filtered = category === "all" ? peopleData : peopleData.filter(p => p.category === category);

  filtered.forEach(person => {
    const card = document.createElement("div");
    card.className = "person-card";
    card.innerHTML = `
      <img src="${person.imageUrl}" alt="Portrait of ${person.name}" loading="lazy" />
      <h3>${person.name}</h3>
      <p>${person.market}</p>
    `;
    card.addEventListener("click", () => openModal(person));
    container.appendChild(card);
  });
}

function openModal(person) {
  modalTitle.textContent = person.name;
  modalImage.src = person.imageUrl;
  modalImage.alt = `Portrait of ${person.name}`;
  modalDesc.textContent = person.story;
  modal.showModal();
}

modalClose.addEventListener("click", () => modal.close());

document.querySelectorAll("input[name='category']").forEach(radio => {
  radio.addEventListener("change", e => displayPeople(e.target.value));
});

loadPeople();

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.getElementById('nav-menu');
  const container = document.getElementById('cards-container');
  const modal = document.getElementById('detail-modal');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalImage = document.getElementById('modal-image');
  const modalDesc = document.getElementById('modal-desc');
  const filterRadios = document.querySelectorAll('input[name="category"]');
  let people = [];

  // Hamburger toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !expanded);
      navMenu.classList.toggle('show');
    });
  }

  // Fetch people data
  async function fetchPeople() {
    try {
      const response = await fetch('data/people.json');
      if (!response.ok) throw new Error('Could not load people.json');
      people = await response.json();
      renderCards(people);
    } catch (err) {
      console.error(err);
    }
  }

  // Render person cards
  function renderCards(data) {
    container.innerHTML = '';
    data.forEach(person => {
      const card = document.createElement('div');
      card.className = 'person-card';
      card.innerHTML = `
        <img src="${person.image}" alt="Portrait of ${person.name}" loading="lazy">
        <div class="card-text">
          <h3>${person.name}</h3>
          <h4>${person.market}</h4>
          <p><a href="story.html?id=${person.name.toLowerCase().replace(/\s+/g, '-')}">Read Their Story →</a></p>
        </div>
      `;
      card.addEventListener('click', () => openModal(person));
      container.appendChild(card);
    });
  }

  // Modal open
  function openModal(person) {
    modalTitle.textContent = person.name;
    modalImage.src = person.image;
    modalImage.alt = `Portrait of ${person.name}`;
    modalDesc.textContent = person.story;
    modal.showModal();
  }

  // Modal close
  modalClose.addEventListener('click', () => modal.close());

  // Category filter
  filterRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const selected = radio.value;
      if (selected === 'all') {
        renderCards(people);
      } else {
        const filtered = people.filter(p => 
          p.category.toLowerCase() === selected
        );
        renderCards(filtered);
      }
    });
  });

  fetchPeople();
});

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('story-container');

  // Extract ID from URL (e.g., ?id=chidi-okafor)
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (!id) {
    container.innerHTML = '<p>Invalid story link.</p>';
    return;
  }

  try {
    const response = await fetch('https://impulsible.github.io/wdd231/finalproject/people.json');
    if (!response.ok) throw new Error('Failed to load data');
    const people = await response.json();

    // Match the person's id by slugified name
    const person = people.find(p =>
      p.name.toLowerCase().replace(/\s+/g, '-') === id
    );

    if (!person) {
      container.innerHTML = `<p>Story not found.</p>`;
      return;
    }

    // Display the story
    container.innerHTML = `
      <article class="story">
        <h2>${person.name}</h2>
        <h3>${person.market} (${person.category})</h3>
        <img src="${person.image}" alt="Portrait of ${person.name}" loading="lazy">
        <p>${person.story}</p>
        <a href="people.html">← Back to all people</a>
      </article>
    `;
  } catch (error) {
    console.error(error);
    container.innerHTML = '<p>Error loading the story.</p>';
  }
});

document.querySelector("#story-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const story = document.querySelector("#story").value.trim();

  if (name && email && story.length >= 20) {
    localStorage.setItem("storySubmission", JSON.stringify({ name, email, story }));
    window.location.href = "story-confirmation.html";
  } else {
    alert("Please fill out all fields correctly.");
  }
});

const latestStory = JSON.parse(localStorage.getItem("latestStory"));
localStorage.setItem("latestStory", JSON.stringify(submission));
window.location.href = "story-confirmation.html";


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



const reader = new FileReader();
reader.onload = function (e) {
  newStory.image = e.target.result;

  // Save latest story and community list
  localStorage.setItem("latestStory", JSON.stringify(newStory));
  const savedStories = JSON.parse(localStorage.getItem("communityStories")) || [];
  savedStories.push(newStory);
  localStorage.setItem("communityStories", JSON.stringify(savedStories));

  // Redirect
  window.location.href = "confirmation.html";
};

if (imageInput.files[0]) {
  reader.readAsDataURL(imageInput.files[0]);
} else {
  newStory.image = ""; // no image
  // Save without image
  localStorage.setItem("latestStory", JSON.stringify(newStory));
  const savedStories = JSON.parse(localStorage.getItem("communityStories")) || [];
  savedStories.push(newStory);
  localStorage.setItem("communityStories", JSON.stringify(savedStories));
  window.location.href = "confirmation.html";
}


document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("community-stories");
  const stories = JSON.parse(localStorage.getItem("communityStories")) || [];

  if (stories.length === 0) {
    container.innerHTML = `<p class="empty-message">No stories submitted yet. Be the first to share yours!</p>`;
    return;
  }

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

    container.appendChild(card);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#story-form");
  const imageInput = document.querySelector("#image");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Validate fields
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const story = document.querySelector("#story").value.trim();

    if (!name || !email || !story || story.length < 20) {
      alert("Please fill out all fields correctly before submitting.");
      return;
    }

    // Handle optional image
    let imageData = "";
    const file = imageInput.files[0];
    if (file) {
      imageData = await toBase64(file);
    }

    const newStory = {
      name,
      email,
      story,
      image: imageData,
      timestamp: new Date().toISOString()
    };

    // Save latest for confirmation page
    localStorage.setItem("latestStory", JSON.stringify(newStory));

    // Add to communityStories
    const stories = JSON.parse(localStorage.getItem("communityStories")) || [];
    stories.push(newStory);
    localStorage.setItem("communityStories", JSON.stringify(stories));

    // Submit the form normally to confirmation page
    form.submit();
  });
});

// Convert uploaded image to base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("community-stories");
  const stories = JSON.parse(localStorage.getItem("communityStories")) || [];

  if (stories.length === 0) {
    container.innerHTML = "<p>No community stories yet. Be the first to share yours!</p>";
    return;
  }

  container.innerHTML = stories.map((story) => `
    <article class="story-card">
      ${story.image ? `<img src="${story.image}" alt="Story image" class="story-image">` : ""}
      <h3>${story.name}</h3>
      <p><strong>Email:</strong> ${story.email}</p>
      <p>${story.story}</p>
      <p class="timestamp">Submitted on: ${new Date(story.timestamp).toLocaleString()}</p>
    </article>
  `).join("");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const story = form.story.value.trim();
  const imageFile = form.image.files[0];

  if (!name || !email || !story) {
    alert("Please complete all required fields.");
    return;
  }

  const newStory = {
    name,
    email,
    story,
    timestamp: new Date().toISOString()
  };

  // If image is selected, convert it to Base64
  if (imageFile) {
    const reader = new FileReader();
    reader.onload = () => {
      newStory.image = reader.result;

      saveAndRedirect(newStory);
    };
    reader.readAsDataURL(imageFile);
  } else {
    saveAndRedirect(newStory);
  }

  function saveAndRedirect(storyObj) {
    localStorage.setItem("latestStory", JSON.stringify(storyObj));

    const allStories = JSON.parse(localStorage.getItem("communityStories")) || [];
    allStories.push(storyObj);
    localStorage.setItem("communityStories", JSON.stringify(allStories));

    window.location.href = "story-confirmation.html";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("stories-container");
  const stories = JSON.parse(localStorage.getItem("communityStories")) || [];

  if (stories.length === 0) {
    container.innerHTML = `<p>No stories shared yet. <a href="explore.html#share-story">Be the first!</a></p>`;
    return;
  }

  stories.forEach(story => {
    const card = document.createElement("div");
    card.className = "story-card";

    card.innerHTML = `
      ${story.image ? `<img src="${story.image}" alt="User photo" />` : ""}
      <h3>${story.name}</h3>
      <p><strong>Email:</strong> ${story.email}</p>
      <p>${story.story}</p>
      <p><small><em>Submitted on ${new Date(story.timestamp).toLocaleString()}</em></small></p>
    `;

    container.appendChild(card);
  });
});
