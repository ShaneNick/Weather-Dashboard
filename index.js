require('dotenv').config()
const API_KEY = process.env.API_KEY;
const searchButton = document.querySelector('#searchButton');
const cityInput = document.querySelector('#cityInput');
const searchedCityElement = document.querySelector('#searchedCity');

function displaySearchHistory() {
    // Get the search history container
    const searchHistory = document.querySelector('#searchHistory');

    // Clear the current content
    searchHistory.innerHTML = '';

    // Get the cities from local storage
    let cities = localStorage.getItem('cities');
    if (cities) {
        cities = JSON.parse(cities);

        // Only keep the 5 most recent cities
        cities = cities.slice(Math.max(cities.length - 5, 0));

        // Creates a new element for each city and append it to the search history container
        cities.forEach(city => {
            const cityElement = document.createElement('p');
            cityElement.textContent = city;

            // click event listener to each city name
            cityElement.addEventListener('click', function() {
                // When the city name is clicked, update the search bar's value to the city name
                cityInput.value = city;
            });

            searchHistory.appendChild(cityElement);
        });
    }
}

searchButton.addEventListener('click', function () {
    const cityName = cityInput.value;

    // Saves search to local storage
    let cities = localStorage.getItem('cities');
    if (cities) {
        cities = JSON.parse(cities);
    } else {
        cities = [];
    }
    cities.push(cityName);
    localStorage.setItem('cities', JSON.stringify(cities));

    // Display the updated search history
    displaySearchHistory();

    const geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(geocodingUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Geocoding request failed');
            }
        })
        .then(data => {
            const city = data[0];
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}`;

            return fetch(forecastUrl);
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Forecast request failed');
            }
        })
        .then(data => {
            displayWeather(data);
            searchedCityElement.style.borderColor = 'black';
         // Show the border after the search is successful
          })
        .catch(error => {
            console.error('Error:', error);
        });
});

const weatherEmojis = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Snow': '❄️',
    'Thunderstorm': '⛈️',
    'Drizzle': '🌦️',
    'Mist': '🌫️',
    'Smoke': '💨',
    'Haze': '🌫️',
    'Dust': '💨',
    'Fog': '🌫️',
    'Sand': '💨',
    'Ash': '💨',
    'Squall': '🌪️',
    'Tornado': '🌪️',
};

function displayWeather(data) {
    // Update city name
    const cityElement = document.querySelector('#city');
    const dateElement = document.querySelector('#date')
    cityElement.textContent = data.city.name;

    // Get current date
    const currentDate = new Date();
    dateElement.textContent = currentDate.toLocaleDateString();

    // Update current weather
    const currentWeather = data.list[0];
    const weatherCondition = currentWeather.weather[0].main;
    const weatherEmoji = weatherEmojis[weatherCondition] || '';
    cityElement.textContent += ` ${weatherEmoji}`;

    const tempElement = document.querySelector('#temp');
    const windElement = document.querySelector('#wind');
    const humidityElement = document.querySelector('#humidity');

    tempElement.textContent = `Temperature: ${currentWeather.main.temp} K`;
    windElement.textContent = `Wind speed: ${currentWeather.wind.speed} m/s`;
    humidityElement.textContent = `Humidity: ${currentWeather.main.humidity} %`;

       
    // Update 5-day forecast
    const forecastElements = [
        document.querySelector('#day1'),
        document.querySelector('#day2'),
        document.querySelector('#day3'),
        document.querySelector('#day4'),
        document.querySelector('#day5'),
    ];

    forecastElements.forEach(element => {
        element.style.display = "inline-block";  // Sets display back to flex, making it visible again
    });

    const forecastHeaderContainer = document.querySelector('#forecastHeaderContainer');
    forecastHeaderContainer.style.display = 'block';


    // Filter forecasts to only include forecasts for 12:00 each day
    const dailyForecasts = data.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));

    dailyForecasts.forEach((forecast, index) => {
        // Clear old forecast data
        forecastElements[index].innerHTML = '';

        const dateElement = document.createElement('p');
        const tempElement = document.createElement('p');
        const windElement = document.createElement('p');
        const humidityElement = document.createElement('p');
        const weatherCondition = forecast.weather[0].main;
        const weatherEmoji = weatherEmojis[weatherCondition] || '';
        const forecastDate = new Date(forecast.dt_txt);

        // Format the date as a string
        const dateString = forecastDate.toLocaleDateString();

        const conditionElement = document.createElement('p');

        conditionElement.textContent = weatherEmoji;
        forecastElements[index].appendChild(conditionElement);
        dateElement.textContent = dateString;
        tempElement.textContent = `Temperature: ${forecast.main.temp} K`;
        windElement.textContent = `Wind speed: ${forecast.wind.speed} m/s`;
        humidityElement.textContent = `Humidity: ${forecast.main.humidity} %`;

        forecastElements[index].appendChild(dateElement);
        forecastElements[index].appendChild(tempElement);
        forecastElements[index].appendChild(windElement);
        forecastElements[index].appendChild(humidityElement);
    });
}
