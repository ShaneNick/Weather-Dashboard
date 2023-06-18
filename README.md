# Weather Dashboard

This Weather Dashboard is a web application designed to provide real-time and 5-day forecast weather information for any city. 

## Features

- **City Search**: Users can search for a city to view its current weather conditions and 5-day forecast. 
- **Search History**: The application saves the search history in the local storage, displaying the five most recent cities. When a city in the search history is clicked, the weather information for that city is fetched and displayed.
- **Weather Display**: The current weather display includes the city name, date, temperature, wind speed, and humidity. Weather conditions are represented with relevant emojis.
- **5-Day Forecast**: The 5-day forecast displays the date, temperature, wind speed, and humidity for the next five days. Forecasts are filtered to only include data for 12:00 PM each day.

## Technologies Used

- HTML5
- CSS3
- JavaScript 
- Fetch API
- Local Storage
- OpenWeatherMap API

## How It Works

1. The user enters a city name in the search bar and clicks the "Search" button.
2. The application uses the Geocoding API to get the coordinates of the city.
3. The coordinates are then passed to the Forecast API to get the current weather and 5-day forecast data.
4. The weather data is displayed on the page, with the current weather shown in the main area and the 5-day forecast shown in individual cards.
5. If the user enters another city, the new weather data is fetched and displayed, and the old city is added to the search history. The search history is stored in the local storage, so it persists across page reloads.

## Running the Project Locally

1. Clone the repository to your local machine.
2. Open the `index.html` file in a web browser.
3. Enter a city name in the search bar and click "Search" to view the weather data.

## Future Improvements

- Add an autocomplete feature to the search bar for easier city selection.
- Include more detailed weather data, such as precipitation levels and sunrise/sunset times.
- Display the 5-day forecast in a chart for a more visual representation of the weather trends.

