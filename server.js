require('dotenv').config();
const express = require('express');
const https = require('https');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.API_KEY;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/weather/:city', (req, res) => {
    const cityName = req.params.city;
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    console.log('Geocoding URL:', geocodingUrl);

    const geocodingRequest = https.get(geocodingUrl, geoResponse => {
        let geoData = '';

        geoResponse.on('data', (chunk) => {
            geoData += chunk;
        });

        geoResponse.on('end', () => {
            const city = JSON.parse(geoData)[0];
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}`;

            console.log('Forecast URL:', forecastUrl);

            const forecastRequest = https.get(forecastUrl, forecastResponse => {
                let forecastData = '';

                forecastResponse.on('data', (chunk) => {
                    forecastData += chunk;
                });

                forecastResponse.on('end', () => {
                    res.json(JSON.parse(forecastData));
                });
            });

            forecastRequest.on('error', (error) => {
                console.error('Error fetching forecast:', error);
                res.status(500).send('An error occurred while fetching the forecast');
            });
        });
    });

    geocodingRequest.on('error', (error) => {
        console.error('Error fetching geocoding data:', error);
        res.status(500).send('An error occurred while fetching the geocoding data');
    });
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
