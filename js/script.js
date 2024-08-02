$(document).ready(function() {
    const apiKey = 'a4eeb0b26e1b416a00308470c5375406';

    $('#search-button').on('click', function() {
        const cityName = $('#city-input').val();
        if (cityName) {
            getCoordinates(cityName);
        }
    });

    function getCoordinates(cityName) {
        const geoUrl = `http://api.openweathermap.org/geo/1.0/dicrect?q=${cityName}&limit=1&appid=${apiKey}`;

        $.getJSON(weatherUrl, function(data) {
            displayCurrentWeather(data, cityName);
            displayForecast(data);
        }).fail(function() {
            console.error('Error fecthing weather data');
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
            $('#current-weather').html(weatherHtml);
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
        })
    }

    function addCityHistory(cityName) {
        let history = JSON.parse(localStorage.getItem('seachHistory')) || [];
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

    $(document).on('click', )