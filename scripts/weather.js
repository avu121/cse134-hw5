class WeatherWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
        <style>
            #temperature{
                font-size : 3rem;
            }
            #conditions {
                font-size : 2rem;
                padding-bottom : 1rem; 
            }
        </style>
        <div id="temperature"></div>
        <img src="" alt="loading in weather data..." width="150" height="150"></img>
        <div id="conditions"></div>
        <span id="wind-speed"></span>
        <span id="humidity"></span>`;
    }

    connectedCallback() {
        // update weather on page load
        const weatherRequest = new XMLHttpRequest();
        this.updateWeatherData(weatherRequest);
    }

    updateWeatherData(weatherRequest) {
        const tempDisplay = this.shadowRoot.getElementById("temperature");
        const conditionsDisplay = this.shadowRoot.getElementById("conditions");
        const conditionIcon = this.shadowRoot.querySelector("img");
        const windDisplay = this.shadowRoot.getElementById("wind-speed");
        const humidityDisplay = this.shadowRoot.getElementById("humidity");
        weatherRequest.open('GET', 'https://api.weather.gov/gridpoints/SGX/55,22/forecast/hourly');
        
        weatherRequest.addEventListener('load', () => {
            if(weatherRequest.status === 200) {
                const response = JSON.parse(weatherRequest.responseText);
                const values = response.properties.periods[0];
                conditionsDisplay.innerText = values.shortForecast;
                const conditionString = JSON.stringify(values.shortForecast).toLowerCase();
                tempDisplay.innerText = values.temperature + "\u00B0F";
                windDisplay.innerText = "Wind: " + values.windSpeed + " " + values.windDirection + ",";
                humidityDisplay.innerText = "Humidity: " + values.relativeHumidity.value + "%";
                // switch between day-theme, night-theme, and condition icons
                if(values.isDaytime) {
                    document.body.classList.remove("night-theme");
                    // switch between sunny, cloudy, rainy, etc.
                    if(conditionString.includes("sunny") || conditionString.includes("clear")) {
                        conditionIcon.src = "/images/Icons/SVG/sunny-day-16458.svg";
                        conditionIcon.alt = "picture of a clear sun";
                    }
                    else if(conditionString.includes("cloudy") || conditionString.includes("chance of rain")) {
                        conditionIcon.src = "/images/Icons/SVG/blue-clouds-and-sun-16461.svg";
                        conditionIcon.alt = "picture of a sun with clouds";
                    }
                    else if(conditionString.includes("thunder") || conditionString.includes("lightning") || conditionString.includes("storm")) {
                        conditionIcon.src = "/images/Icons/SVG/lightning-and-rainy-weather.svg";
                        conditionIcon.alt = "picture of a stormy cloud";
                    }
                    else if(conditionString.includes("rain")) {
                        conditionIcon.src = "/images/Icons/SVG/rainy-day-and-blue-cloud-16462.svg";
                        conditionIcon.alt = "picture of a rainy cloud";
                    }
                    else if(conditionString.includes("hail")) {
                        conditionIcon.src = "/images/Icons/SVG/hail-and-blue-cloud-16491.svg";
                        conditionIcon.alt = "picture of a hailing cloud";
                    }
                }
                else {
                    document.body.classList.add("night-theme");
                    // switch between sunny, cloudy, rainy icons
                    if(conditionString.includes("sunny") || conditionString.includes("clear")) {
                        conditionIcon.src = "/images/Icons/SVG/moon-and-clear-sky-16468.svg";
                        conditionIcon.alt = "picture of a clear moon";
                    }
                    else if(conditionString.includes("cloudy") || conditionString.includes("chance of rain")) {
                        conditionIcon.src = "/images/Icons/SVG/moon-and-blue-cloud-16469.svg";
                        conditionIcon.alt = "picture of a moon with clouds";
                    }
                    else if(conditionString.includes("thunder") || conditionString.includes("lightning") || conditionString.includes("storm")) {
                        conditionIcon.src = "/images/Icons/SVG/lightning-and-rainy-weather.svg";
                        conditionIcon.alt = "picture of a stormy cloud";
                    }
                    else if(conditionString.includes("rain")) {
                        conditionIcon.src = "/images/Icons/SVG/rainy-night-and-moon-16471.svg";
                        conditionIcon.alt = "picture of a rainy cloud";
                    }
                    else if(conditionString.includes("hail")) {
                        conditionIcon.src = "/images/Icons/SVG/hail-and-blue-cloud-16491.svg";
                        conditionIcon.alt = "picture of a hailing cloud";
                    }
                }
            }
        });
        weatherRequest.send();
    }
}
customElements.define('weather-widget', WeatherWidget);
