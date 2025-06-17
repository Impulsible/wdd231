document.addEventListener("DOMContentLoaded", async () => {
  // === Utility Elements ===
  const currentYearEl = document.getElementById("currentYear");
  const lastModifiedEl = document.getElementById("lastModified");
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const form = document.getElementById("story-form");
  const imageInput = document.getElementById("image");
  const imagePreview = document.getElementById("image-preview");
  const entryContainer = document.querySelector(".story-entry");
  const resetBtn = document.getElementById("resetBtn");

  // === Footer Date ===
  if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();
  if (lastModifiedEl) lastModifiedEl.textContent = "Last modified: " + document.lastModified;

  // === Hamburger Toggle ===
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", !expanded);
    });
  }

  // === Image Preview Handler ===
  if (imageInput && imagePreview) {
    imageInput.addEventListener("change", () => {
      const file = imageInput.files[0];
      imagePreview.textContent = file ? `Selected file: ${file.name}` : "No file chosen yet";
    });
  }

  // === Story Form Submission ===
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) return form.reportValidity();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const storyText = document.getElementById("story").value.trim();
      const timestamp = new Date().toLocaleString();
      const file = imageInput.files[0];

      const saveStory = (imageData) => {
        const newStory = { name, email, story: storyText, image: imageData, timestamp };
        const stories = JSON.parse(localStorage.getItem("lagosStories")) || [];
        stories.push(newStory);
        localStorage.setItem("lagosStories", JSON.stringify(stories));
        window.location.href = "confirmation.html";
      };

      if (file) {
        const reader = new FileReader();
        reader.onload = () => saveStory(reader.result);
        reader.readAsDataURL(file);
      } else {
        saveStory(null);
      }
    });
  }

  // === Confirmation Page: Render Submitted Stories ===
  if (entryContainer) {
    const stories = JSON.parse(localStorage.getItem("lagosStories")) || [];
    if (stories.length === 0) {
      entryContainer.innerHTML = "<p>No stories found. Please share one!</p>";
    } else {
      entryContainer.innerHTML = stories.map(({ name, email, story, image, timestamp }) => `
        <div class="story-card lazy-hidden">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Story:</strong><br>${story}</p>
          ${image ? `<img src="${image}" alt="Photo" loading="lazy">` : ""}
          <p style="margin-top: 0.5rem; font-size: 0.9rem;"><strong>Submitted:</strong> ${timestamp}</p>
        </div>
      `).join("");
    }
  }

  // === Reset Button Handler ===
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      localStorage.removeItem("lagosStories");
      window.location.href = "explore.html#story-form";
    });
  }

  // === Load JSON Data and Handle Pages ===
  try {
    const res = await fetch("https://impulsible.github.io/wdd231/finalproject/people.json");
    const data = await res.json();

    // === Page: people.html - Render Cards ===
    const cardContainer = document.getElementById("cards-container");
    const filters = document.querySelectorAll("input[name='category']");

    if (cardContainer) {
      const renderCards = (people) => {
        cardContainer.innerHTML = people.map(person => `
          <div class="person-card lazy-hidden">
            <img src="${person.image}" alt="${person.name}" loading="lazy">
            <div class="card-content">
              <h3>${person.name}</h3>
              <p><strong>${person.market}</strong></p>
              <p>${person.story.substring(0, 150)}...</p>
              <a href="story.html?id=${person.id}" class="read-more">Read More</a>
            </div>
          </div>
        `).join("");
      };

      const applyFilter = (category) => {
        if (category === "all") {
          renderCards(data);
        } else {
          const filtered = data.filter(p => p.category === category);
          renderCards(filtered);
        }
      };

      filters.forEach(filter =>
        filter.addEventListener("change", (e) => applyFilter(e.target.value))
      );

      renderCards(data);
    }

    // === Page: story.html - Show Full Story ===
    const storyDetail = document.getElementById("story-detail");
    if (storyDetail) {
      const params = new URLSearchParams(window.location.search);
      const storyId = params.get("id");
      const story = data.find(p => p.id === storyId);

      if (story) {
        const formattedStory = story.story.split(/\n+/).map(p => `<p>${p.trim()}</p>`).join("");
        storyDetail.innerHTML = `
          <h1>${story.name}</h1>
          <img src="${story.image}" alt="${story.name}" class="story-image" loading="lazy">
          <h2>${story.market} | ${story.category}</h2>
          ${formattedStory}
          <a href="people.html" class="back-link">&larr; Back to People</a>
        `;
      } else {
        storyDetail.innerHTML = `<p>Story not found. <a href="people.html">Back to People</a></p>`;
      }
    }

  } catch (err) {
    console.error("Error loading data:", err);
    const fallback = "<p>Failed to load data. Try again later.</p>";
    const container = document.getElementById("cards-container") || document.getElementById("story-detail");
    if (container) container.innerHTML = fallback;
  }

  // === Intersection Observer: Lazy Reveal ===
  const lazySections = document.querySelectorAll(".lazy-hidden");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    lazySections.forEach(section => observer.observe(section));
  }
});
