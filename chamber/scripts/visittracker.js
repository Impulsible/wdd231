document.addEventListener("DOMContentLoaded", () => {
  const visitMessage = document.getElementById("visit-message");
  if (!visitMessage) {
    console.error("No element with id 'visit-message' found.");
    return;
  }

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
