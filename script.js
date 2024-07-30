async function getWeather(city = 'Washington') {
    const apiKey = 'your_api_key_here'; // Replace with your actual API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
    const historicalUrl = `https://history.openweathermap.org/data/2.5/aggregated/year?lat=47.6062&lon=-122.3321&appid=${apiKey}`; // Example coordinates for Seattle, replace with actual coordinates

    try {
        // Fetch current and forecast weather data
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        // Fetch historical weather data
        const historicalResponse = await fetch(historicalUrl);
        const historicalData = await historicalResponse.json();

        if (weatherData.cod !== "200") {
            document.getElementById('location').innerText = weatherData.message;
        } else {
            document.getElementById('location').innerText = weatherData.city.name;
            document.getElementById('current-weather').innerText = `${weatherData.list[0].main.temp}° | ${weatherData.list[0].weather[0].description}`;

            const hourly = document.getElementById('hourly');
            hourly.innerHTML = '';
            for (let i = 0; i < 5; i++) {
                const item = weatherData.list[i];
                hourly.innerHTML += `
                    <div class="forecast-item">
                        <span>${new Date(item.dt * 1000).getHours()}h</span>
                        <span>${item.main.temp}°</span>
                        <span>${item.weather[0].main}</span>
                    </div>
                `;
            }

            const daily = document.getElementById('daily');
            daily.innerHTML = '';
            for (let i = 0; i < weatherData.list.length; i += 8) {
                const item = weatherData.list[i];
                daily.innerHTML += `
                    <div class="forecast-item">
                        <span>${new Date(item.dt * 1000).toLocaleDateString()}</span>
                        <span>${item.main.temp_min}° / ${item.main.temp_max}°</span>
                        <span>${item.weather[0].main}</span>
                    </div>
                `;
            }
        }

        if (historicalData.cod === "200") {
            const historical = document.getElementById('historical');
            historical.innerHTML = `
                <div class="forecast-item">
                    <span>Yearly Average: </span><span>${historicalData.result.temp.average}°</span>
                </div>
                <div class="forecast-item">
                    <span>Yearly Max: </span><span>${historicalData.result.temp.max}°</span>
                </div>
                <div class="forecast-item">
                    <span>Yearly Min: </span><span>${historicalData.result.temp.min}°</span>
                </div>
            `;
        } else {
            document.getElementById('historical').innerText = 'Historical data not available.';
        }
    } catch (error) {
        console.error('Error fetching the weather data', error);
    }
}

getWeather();
