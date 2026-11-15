// Die Schlüssel kommen aus config.js (siehe config.example.js).
// Fehlt die Datei, ist CONFIG nicht definiert und wir nehmen ein leeres Objekt.
const settings = typeof CONFIG !== "undefined" ? CONFIG : {};

const api = {
    base: "https://api.openweathermap.org/data/2.5/",
    key: settings.openWeatherKey || "",
    locationKey: settings.ipGeolocationKey || "",
    defaultCity: settings.defaultCity || "Bremerhaven",
};

// Ab dieser Temperatur (°C) wird der warme Hintergrund gezeigt.
const HOT_FROM = 18;

const app_container = document.getElementById("app_container");
const data_container = document.getElementById("data_container");
const message = document.getElementById("message");
const location_input = document.getElementById("location_input");
const weather_location = document.getElementById("location");
const date = document.getElementById("date");
const temperature_current = document.getElementById("temperature_current");
const temperature_max_min = document.getElementById("temperature_max_min");
const weather_main = document.getElementById("weather");
const weather_desc = document.getElementById("weather_desc");

// Start: Die Skripte sind mit "defer" eingebunden, das HTML ist also schon da.
addSearchListener();
firstCall();

function addSearchListener() {
    location_input.addEventListener("keydown", (e) => {
        const city = location_input.value.trim();
        if (e.key === "Enter" && city !== "") {
            getWeatherData(city);
        }
    });
}

// Erster Aufruf: Stadt über die IP-Adresse bestimmen.
// Ohne Schlüssel oder bei einem Fehler wird die Standard-Stadt genommen.
async function firstCall() {
    if (api.key === "" || api.key.startsWith("DEIN_")) {
        showMessage("No API key found. Copy config.example.js to config.js and add your OpenWeatherMap key.");
        return;
    }

    let city = api.defaultCity;
    if (api.locationKey !== "") {
        try {
            const res = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${api.locationKey}`);
            const result = await res.json();
            if (result.city) {
                city = result.city;
            }
        } catch (err) {
            console.error(err);
        }
    }
    getWeatherData(city);
}

async function getWeatherData(city) {
    showMessage("Loading…");
    try {
        // encodeURIComponent sorgt dafür, dass Leerzeichen und Umlaute
        // (z. B. "Frankfurt am Main", "Köln") in der URL gültig sind.
        const url = `${api.base}weather?q=${encodeURIComponent(city)}&units=metric&appid=${api.key}`;
        const res = await fetch(url);
        const result = await res.json();

        // Die API liefert "cod" mal als Zahl, mal als Text. Number() gleicht das aus.
        if (Number(result.cod) === 404) {
            showMessage(`City "${city}" was not found.`);
            return;
        }
        if (Number(result.cod) !== 200) {
            showMessage("The weather service returned an error: " + (result.message || result.cod));
            return;
        }
        fillData(result);
    } catch (err) {
        showMessage("Could not load the weather data. Please check your internet connection.");
        console.error(err);
    }
}

function fillData(weather) {
    app_container.className = weather.main.temp > HOT_FROM ? "hot" : "cold";
    weather_location.textContent = weather.name + ", " + weather.sys.country;
    date.textContent = buildDate(new Date());
    temperature_current.textContent = Math.round(weather.main.temp) + " °C";
    temperature_max_min.textContent =
        "High: " + Math.round(weather.main.temp_max) + " °C / Low: " + Math.round(weather.main.temp_min) + " °C";
    weather_main.textContent = weather.weather[0].main;
    weather_desc.textContent = weather.weather[0].description + ", wind speed " + weather.wind.speed + " m/s";

    showMessage("");
    data_container.hidden = false;
}

function buildDate(d) {
    return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function showMessage(text) {
    message.textContent = text;
    message.hidden = text === "";
}
