const apiKey = '1e8c17a9d8864e285b79664791782aa3'; // Your API key
const city = 'Surulere, Lagos';

const weatherDiv = document.getElementById('weather');      // current weather container
const forecastDiv = document.getElementById('forecast');    // forecast cards container

async function fetchWeather() {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    weatherDiv.textContent = 'Weather data not available.';
    forecastDiv.textContent = '';
    console.error('Error fetching weather:', error);
  }
}

function displayWeather(data) {
  // Current weather from first forecast item
  const current = data.list[0];
  const currentTemp = current.main.temp.toFixed(1);
  const currentDesc = capitalize(current.weather[0].description);
  const currentIconCode = current.weather[0].icon;

  // Show current weather nicely
  weatherDiv.innerHTML = `
    <div class="current-weather-content">
      <img src="https://openweathermap.org/img/wn/${currentIconCode}@2x.png" alt="${currentDesc}">
      <p><strong>Temperature:</strong> ${currentTemp}°C</p>
      <p><strong>Conditions:</strong> ${currentDesc}</p>
    </div>
  `;

  // Prepare forecast for next 3 days at 12:00:00
  const forecastDays = [];
  const forecastDates = new Set();

  for (let item of data.list) {
    const [date, time] = item.dt_txt.split(' ');
    if (time === '12:00:00' && !forecastDates.has(date)) {
      forecastDates.add(date);
      forecastDays.push({
        date: new Date(date),
        temp: item.main.temp.toFixed(1),
        description: capitalize(item.weather[0].description),
        icon: item.weather[0].icon
      });
    }
    if (forecastDays.length === 3) break;
  }

  // Clear previous forecast
  forecastDiv.innerHTML = '';

  // Build forecast day cards
  forecastDays.forEach(day => {
    const dayName = day.date.toLocaleDateString(undefined, { weekday: 'short' });
    const monthDay = day.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    const card = document.createElement('div');
    card.className = 'forecast-day';

    card.innerHTML = `
      <div class="day-name">${dayName}</div>
      <div class="date">${monthDay}</div>
      <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.description}" class="forecast-icon">
      <div class="temp">${day.temp}°C</div>
      <div class="desc">${day.description}</div>
    `;

    forecastDiv.appendChild(card);
  });
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Run on page load
fetchWeather();
function displayWeather(data) {
  // Current weather from first forecast item
  const current = data.list[0];
  const currentTemp = current.main.temp.toFixed(1);
  const currentDesc = capitalize(current.weather[0].description);
  const currentIconCode = current.weather[0].icon;

  // Get city details (for sunrise/sunset)
  const cityInfo = data.city;

  // Convert sunrise and sunset UNIX timestamps to local time strings
  const sunrise = new Date(cityInfo.sunrise * 1000).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  const sunset = new Date(cityInfo.sunset * 1000).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  // Find the high and low temps from the current day’s forecast items
  const todayDate = current.dt_txt.split(' ')[0];
  const todayTemps = data.list
    .filter(item => item.dt_txt.startsWith(todayDate))
    .map(item => item.main.temp);

  const highTemp = Math.max(...todayTemps).toFixed(1);
  const lowTemp = Math.min(...todayTemps).toFixed(1);

  // Current humidity
  const humidity = current.main.humidity;

  // Show current weather nicely with details
  weatherDiv.innerHTML = `
  <div class="current-weather-content" style="
    display: flex; 
    align-items: center; 
    gap: 24px; 
    background: linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(233, 240, 240) 100%);
    padding: 20px 30px;
    border-radius: 15px;
    box-shadow: 0 8px 20px rgba(2, 37, 11, 0.3);
    color: white;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 400px;
    margin: 0 auto;
  ">
    <img src="https://openweathermap.org/img/wn/${currentIconCode}@4x.png" 
         alt="${currentDesc}" 
         style="width: 96px; height: 96px; filter: drop-shadow(0 0 5px rgba(233, 226, 226, 0.7));">
    <div class="weather-info" style="line-height: 1.3;">
      <p style="font-size: 3rem; font-weight: 700; margin: 0 0 8px 0;">${currentTemp}°C</p>
      <p style="font-size: 1.25rem; font-weight: 600; margin: 0 0 12px 0;">${currentDesc}</p>
      <p style="margin: 4px 0; font-weight: 500;">
        <span style="color:rgb(31, 25, 2);">High:</span> ${highTemp}°C | 
        <span style="color:rgb(33, 37, 41);">Low:</span> ${lowTemp}°C
      </p>
      <p style="margin: 4px 0; font-weight: 500;">Humidity: ${humidity}%</p>
      <p style="margin: 4px 0; font-weight: 500;">Sunrise: ${sunrise}</p>
      <p style="margin: 4px 0; font-weight: 500;">Sunset: ${sunset}</p>
    </div>
  </div>
`;


  // Prepare forecast for next 3 days at 12:00:00
  const forecastDays = [];
  const forecastDates = new Set();

  for (let item of data.list) {
    const [date, time] = item.dt_txt.split(' ');
    if (time === '12:00:00' && !forecastDates.has(date)) {
      forecastDates.add(date);
      forecastDays.push({
        date: new Date(date),
        temp: item.main.temp.toFixed(1),
        description: capitalize(item.weather[0].description),
        icon: item.weather[0].icon
      });
    }
    if (forecastDays.length === 3) break;
  }

  // Clear previous forecast
  forecastDiv.innerHTML = '';

  // Build forecast day cards
  forecastDays.forEach(day => {
    const dayName = day.date.toLocaleDateString(undefined, { weekday: 'short' });
    const monthDay = day.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    const card = document.createElement('div');
    card.className = 'forecast-day';

    card.innerHTML = `
      <div class="day-name">${dayName}</div>
      <div class="date">${monthDay}</div>
      <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.description}" class="forecast-icon">
      <div class="temp">${day.temp}°C</div>
      <div class="desc">${day.description}</div>
    `;

    forecastDiv.appendChild(card);
  });
}
