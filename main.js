// index.js
const cityInput = document.getElementById('city');
const searchButton = document.querySelector('.search');
const weatherOutput = document.querySelector('.weather-output');

const API_KEY = 'e0f6750dc43833cda937ebd116baa01b'; // Replace with your actual API key

searchButton.addEventListener('click', () => {
    const cityName = cityInput.value;
    if (cityName) {
        fetchWeatherData(cityName);
    } else {
        weatherOutput.textContent = "Please enter a city name.";
    }
});

async function fetchWeatherData(city) {
    try {
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error("City not found or API error.");
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        displayWeather(currentData, forecastData);

    } catch (error) {
        console.error("Error fetching weather data:", error);
        weatherOutput.textContent = "Error fetching weather data. Please check the city name and your internet connection.";
    }
}

function displayWeather(current, forecast) {
    let output = `<h2>Current Weather in ${current.name}, ${current.sys.country}</h2>`;
    output += `<p>Temperature: ${current.main.temp}°C</p>`;
    output += `<p>Description: ${current.weather[0].description}</p>`;
    output += `<p>Humidity: ${current.main.humidity}%</p>`;

    output += "<h2>3-Day Forecast</h2>";
    // Filter for midday forecasts for the next 3 days
    const forecastList = forecast.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0,3);

    if (forecastList.length > 0) {
        output += "<ul>";
        forecastList.forEach(day => {
            const date = new Date(day.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            output += `<li>${dayName}: ${day.main.temp}°C, ${day.weather[0].description}</li>`;
        });
        output += "</ul>";
    } else {
        output += "<p>Forecast not available.</p>";
    }


    weatherOutput.innerHTML = output;
}