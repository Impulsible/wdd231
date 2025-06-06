document.addEventListener("DOMContentLoaded", () => {
  const discoverGrid = document.querySelector(".discover-grid");
  const visitMessage = document.getElementById("visit-message");

  // Fetch and build discover cards
  fetch("http://127.0.0.1:5500/discover.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        // Create card container
        const card = document.createElement("div");
        card.classList.add("discover-card");

        // Title (h2)
        const title = document.createElement("h2");
        title.textContent = item.title;

        // Figure with image
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.title;
        img.width = 300;
        img.height = 200;
        img.loading = "lazy";  // <-- lazy loading added here
        figure.appendChild(img);


        // Content div
        const content = document.createElement("div");
        content.classList.add("content");

        // Address
        const address = document.createElement("address");
        address.textContent = item.address;

        // Description
        const description = document.createElement("p");
        description.textContent = item.description;

        // Button
        const button = document.createElement("button");
        button.textContent = "Learn More";
        button.classList.add("learn-more-btn");

        // Append elements to content
        content.appendChild(address);
        content.appendChild(description);
        content.appendChild(button);

        // Append title, figure, content to card
        card.appendChild(title);
        card.appendChild(figure);
        card.appendChild(content);

        // Append card to grid container
        discoverGrid.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Error loading discover data:", error);
    });

  // Handle last visit message
  const lastVisit = localStorage.getItem("lastVisit");
  const currentVisit = Date.now();
  const msInDay = 24 * 60 * 60 * 1000;

  if (!lastVisit) {
    visitMessage.textContent = "🎉 Welcome! Let us know if you have any questions.";
  } else {
    const days = Math.floor((currentVisit - Number(lastVisit)) / msInDay);

    if (days < 1) {
      visitMessage.textContent = "👋 Back so soon! Awesome!";
    } else if (days === 1) {
      visitMessage.textContent = "📅 You last visited 1 day ago.";
    } else {
      visitMessage.textContent = `📅 You last visited ${days} days ago.`;
    }
  }

  // Save current visit timestamp
  localStorage.setItem("lastVisit", currentVisit);
});

