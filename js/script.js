$(document).ready(function() {
    const apiKey = 'a4eeb0b26e1b416a00308470c5375406';

    $('#search-button').on('click', function() {
        const cityName = $('#city-input').val();
         console.log('Search button clicked'); // debugging
        if (cityName) {
            getCoordinates(cityName);
        }
    });

    function getCoordinates(cityName) {
        console.log('getting coordinates for:', cityName); // debugging
        const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

        $.getJSON(geoUrl, function(data) {
            console.log('received data:', data);
            if (data.length > 0) {
                const { lat, lon } = data[0];
                getWeatherData(lat, lon, cityName);
                addCityToHistory(cityName);
            } else {
                alert('City not found');
            }
        }).fail(function() {
            console.error('Error fetching coordinates');
        });
    }

    function getWeatherData(lat, lon, cityName) {
        console.log('Getting weather data for coordinates:', lat, lon); // Debugging statement
        const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        
        $.getJSON(weatherUrl, function(data) {
            console.log('Received weather data:', data); // Debugging statement
            displayCurrentWeather(data, cityName);
            displayForecast(data);
        }).fail(function() {
            console.error('Error fetching weather data');
        });
    }

    function displayCurrentWeather(data, cityName) {
        const currentWeather = data.list[0];
        const weatherHtml = `
        <     <h2>${cityName}</h2>
            <p>${new Date().toLocaleDateString()}</p>
            <img src="http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png" alt="Weather icon">
            <p>Temperature: ${currentWeather.main.temp}K</p>
            <p>Humidity: ${currentWeather.main.humidity}%</p>
            <p>Wind Speed: ${currentWeather.wind.speed}m/s</p>
            `;
            let x = $('#current-weather').html(weatherHtml);
            console.log("1st: ", weatherHtml);
            console.log("2st: ", x);
    }

    function displayForecast(data) {
        let forecastHtml = '';
        data.list.slice(1, 6).forEach(item => {
            forecastHtml += `
            <div>
                    <p>${new Date(item.dt_txt).toLocaleDateString()}</p>
                    <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="Weather icon">
                    <p>Temperature: ${item.main.temp}K</p>
                    <p>Humidity: ${item.main.humidity}%</p>
                    <p>Wind Speed: ${item.wind.speed}m/s</p>
                </div>
            `;
        });
        $('#forecast').html(forecastHtml);
    }

    function addCityToHistory(cityName) {
        let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        if (!history.includes(cityName)) {
            history.push(cityName);
            localStorage.setItem('searchHistory', JSON.stringify(history));
            updateHistory();
        }
    }

    function updateHistory() {
        let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        let historyHtml = '';
        history.forEach(city => {
            historyHtml += `<button class="history-button">${city}</button>`;
        });
        $('#search-history').html(historyHtml);
    }

    $(document).on('click', 'history-button', function() {
        getCoordinates($(this).text());
    });
    
    // Load search history on page load
    updateHistory();
});