document.addEventListener("DOMContentLoaded", () => {
  const discoverGrid = document.querySelector(".discover-grid");
  const visitMessage = document.getElementById("visit-message");

  let dataCache = [];

  function buildCards(data) {
    discoverGrid.innerHTML = "";

    data.forEach((item, index) => {
      const card = document.createElement("div");
      card.classList.add("discover-card");

      const title = document.createElement("h2");
      title.textContent = item.title;

      const figure = document.createElement("figure");
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.title;
      img.width = 300;
      img.height = 200;
      img.loading = "lazy";
      figure.appendChild(img);

      const content = document.createElement("div");
      content.classList.add("content");

      const address = document.createElement("address");
      address.textContent = item.address;

      const description = document.createElement("p");
      description.textContent = item.description;

      const button = document.createElement("button");
      button.textContent = "Learn More";
      button.classList.add("learn-more-btn");

      content.appendChild(address);
      content.appendChild(description);
      content.appendChild(button);

      card.appendChild(title);
      card.appendChild(figure);
      card.appendChild(content);

      discoverGrid.appendChild(card);
    });
  }

  function applyGridAreas() {
  const cards = discoverGrid.querySelectorAll(".discover-card");
  const width = window.innerWidth;

  if (width >= 641) {
    cards.forEach((card, index) => {
      card.style.gridArea = `card${index + 1}`;
    });
  } else {
    cards.forEach((card) => {
      card.style.gridArea = ""; // clear inline style to let CSS handle stacking
    });
  }
}

  fetch("http://127.0.0.1:5500/chamber/discover.json")
    .then((response) => response.json())
    .then((data) => {
      dataCache = data;
      buildCards(dataCache);
      applyGridAreas();
    })
    .catch((error) => {
      console.error("Error loading discover data:", error);
    });

  window.addEventListener("resize", () => {
    applyGridAreas();
  });

  // Visit message logic
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

  localStorage.setItem("lastVisit", currentVisit);
});
