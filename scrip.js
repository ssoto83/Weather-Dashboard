const weatherDashboard = document.querySelector(".cityWeatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = 'a4eeb0b26e1b416a00308470c5375406';

//Event listener for form submission
weatherDashboard.addEventListener("submit", async event => {
event.preventDefault(); // To prevent the default form submission

const city = cityInput.value.trim();

if (city) {
    try {
        const weatherData = await getWeather(city);
        displayWeatherInfo(weatherData);
        updateSearchHistory(city);
    } catch(error){
        console.error(error);
        displayError("Unable to display data. Please try again");
    }
} else {
    displayError("Please enter a city");
}
});

// Function to get weather data
async function getWeather(city) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=cityName&appid=yourAPIKey&units=imperial`;
    const response = await fetch(weatherUrl);
    if(!response.ok) {
        throw new Error("Could not get weather data");
    }
    return await response.json();
}

// Function to display the weather information
function displayWeatherInfo(data) {
   const {name: city, main: {temp, wind, humidity}, weather: [{ id }]} = data; 

    // Update card with weather data
    card.querySelector(".city").textContent = city;
    card.querySelector(".emoji").textContent = getWeatherEmoji(id);
    card.querySelector(".temperature").textContent = `Temperature: ${temp}°F`;
    card.querySelector(".wind").textContent = `Wind Speed: ${wind.speed} MPH`;
    card.querySelector(".humidity").textContent = `Humidity: ${humidity}%`;

    // shows the card
    card.style.display= "block";
}

    // Function to display error
    function displayError(message) {
        card.innerHTML = `<p class="error">${message}</p>`;
        card.style.display = "block";
    }

    // Funtion to show the weather emoji
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

    function updateSearchHistory(city) {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

        if (!searchHistory.includes(city)) {
            searchHistory.push(city);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            renderSearchHistory();
    }
}

// Function to render history
function renderSearchHistory() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const historyEl = document.querySelector(".search-history");
    historyEl.innerHTML = '';

    searchHistory.forEach(city => {
        const cityButton = document.createElement('button');
        cityButton.textContent = city;
        cityButton.addEventListener('click', () => {
            cityInput.value = city;
            weatherDashboard.dispatchEvent(new Event('submit'));
        });
        historyEl.appendChild(cityButton);
    });
}

document.addEventListener('DOMContentLoaded', renderSearchHistory);