const weatherDashboard = document.querySelector(".cityWeatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "a4eeb0b26e1b416a00308470c5375406";

// Event listener for form submission
weatherDashboard.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (city) {
    try {
      const weatherData = await getWeather(city);
      displayWeatherInfo(weatherData);
      updateSearchHistory(city);
    } catch (error) {
      console.error(error);
      displayError("Unable to display data. Please try again.");
    }
  } else {
    displayError("Please enter a city");
  }
});

// Function to get weather data using city name
async function getWeather(city) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
  const response = await fetch(weatherUrl);
  if (!response.ok) {
    throw new Error("Could not get weather data");
  }
  return await response.json();
}

// Function to display the weather information
function displayWeatherInfo(data) {
  const { city, list } = data;

  // Clear previous content
  card.innerHTML = "";

  // Display city name
  const cityName = document.createElement("h1");
  cityName.textContent = city.name;
  card.appendChild(cityName);

  // Create containers for current day and forecast
  const currentDayContainer = document.createElement("div");
  currentDayContainer.className = "currentDay";
  const forecastContainer = document.createElement("div");
  forecastContainer.className = "forecast-container";

  // Process and display 5-day forecast
  let forecastData = [];
  list.forEach((item) => {
    const date = new Date(item.dt_txt).toLocaleDateString();
    const existingDay = forecastData.find((f) => f.date === date);

    if (existingDay) {
      existingDay.temps.push(item.main.temp);
      existingDay.windSpeeds.push(item.wind.speed);
      existingDay.humidities.push(item.main.humidity);
    } else {
      forecastData.push({
        date: date,
        temps: [item.main.temp],
        windSpeeds: [item.wind.speed],
        humidities: [item.main.humidity],
        weatherId: item.weather[0].id,
      });
    }
  });

  // Ensure only 5 days are displayed
  const fiveDayForecast = forecastData.slice(0, 5);

  // Display the current day (first day)
  if (fiveDayForecast.length > 0) {
    const today = fiveDayForecast.shift(); // Remove the first element to display as current day
    const avgTemp = (
      today.temps.reduce((a, b) => a + b, 0) / today.temps.length
    ).toFixed(1);
    const avgWindSpeed = (
      today.windSpeeds.reduce((a, b) => a + b, 0) / today.windSpeeds.length
    ).toFixed(1);
    const avgHumidity = (
      today.humidities.reduce((a, b) => a + b, 0) / today.humidities.length
    ).toFixed(1);

    // Create a card for the current day
    const currentDayCard = document.createElement("div");
    currentDayCard.className = "current-day-card";
    currentDayCard.innerHTML = `
            <h2>Today</h2>
            <p class="emoji">${getWeatherEmoji(today.weatherId)}</p>
            <p>Temperature: ${avgTemp}°F</p>
            <p>Wind Speed: ${avgWindSpeed} mph</p>
            <p>Humidity: ${avgHumidity}%</p>
        `;

    // Append the card to the current day container
    currentDayContainer.appendChild(currentDayCard);
  }

  // Display the rest of the days
  fiveDayForecast.forEach((day) => {
    const avgTemp = (
      day.temps.reduce((a, b) => a + b, 0) / day.temps.length
    ).toFixed(1);
    const avgWindSpeed = (
      day.windSpeeds.reduce((a, b) => a + b, 0) / day.windSpeeds.length
    ).toFixed(1);
    const avgHumidity = (
      day.humidities.reduce((a, b) => a + b, 0) / day.humidities.length
    ).toFixed(1);

    // Create a new card for each day
    const dayCard = document.createElement("div");
    dayCard.className = "day-card";
    dayCard.innerHTML = `
            <h2>${day.date}</h2>
            <p class="emoji">${getWeatherEmoji(day.weatherId)}</p>
            <p>Temperature: ${avgTemp}°F</p>
            <p>Wind Speed: ${avgWindSpeed} mph</p>
            <p>Humidity: ${avgHumidity}%</p>
        `;

    // Append the card to the forecast container
    forecastContainer.appendChild(dayCard);
  });

  // Append the containers to the main card
  card.appendChild(currentDayContainer);
  card.appendChild(forecastContainer);

  // Show the card
  card.style.display = "block";
}

// Function to display error
function displayError(message) {
  card.innerHTML = `<p class="error">${message}</p>`;
  card.style.display = "block";
}

// Function to show the weather emoji
function getWeatherEmoji(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return "⛈️"; // stormy
  if (weatherId >= 300 && weatherId < 400) return "🌦️"; // light rain
  if (weatherId >= 500 && weatherId < 600) return "🌧️"; // rain
  if (weatherId >= 600 && weatherId < 700) return "❄️"; // snow
  if (weatherId >= 700 && weatherId < 800) return "🌫️"; // foggy
  if (weatherId === 800) return "☀️"; // sunny
  if (weatherId > 800) return "☁️"; // cloudy
  return "🌈"; // default
}

// Function to update and render search history
function updateSearchHistory(city) {
  let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    renderSearchHistory();
  }
}

// Function to render search history
function renderSearchHistory() {
  const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  const historyEl = document.querySelector(".search-history");
  historyEl.innerHTML = "";

  searchHistory.forEach((city) => {
    const cityButton = document.createElement("button");
    cityButton.textContent = city;
    cityButton.addEventListener("click", () => {
      cityInput.value = city;
      weatherDashboard.dispatchEvent(new Event("submit"));
    });
    historyEl.appendChild(cityButton);
  });
}

// Rendering of search history upon loading
document.addEventListener("DOMContentLoaded", renderSearchHistory);
