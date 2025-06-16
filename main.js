const api ={
    base: "https://api.openweathermap.org/data/2.5/",
    key: "24c7ec9e3889de3f74862a6ab09917d5",
    location_api: "13296b6383bc47c5a994906bfca1eb2f",
}
let weather = {}
let mainClass ="";
const app_container = document.getElementById("app_container");
const weather_location = document.getElementById("location");
const date = document.getElementById("date");
const temperature_current = document.getElementById("temperature_current");
const temperature_max_min = document.getElementById("temperature_max_min");
const _weather = document.getElementById("weather");
const weather_desc = document.getElementById("weather_desc");

document.addEventListener("readystatechange",(e)=>{
    if (e.target.readyState === "complete"){
        console.log("ready");
        firstCall();
        AddSerachListner();
    }
})
const AddSerachListner =()=>{
let location_input = document.getElementById("location_input");
location_input.addEventListener("keypress",(e)=>{
if(e.key==="Enter"){
    getWeatherData (location_input.value);
}
});
}

const firstCall = ()=>{
    fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${api.location_api}`)
    .then((res) => res.json())
    .then((result) =>{
        console.log(result);
        getWeatherData(result.city);
    })
};

const getWeatherData = (city) => {
    fetch(`${api.base}weather?q=${city}&units=metric&appid=${api.key}`)
        .then((res) => res.json())
        .then((result) => {
            if (result.cod !== 200) {
                alert(" Stad ist nicht da");
                return;
            }
            weather = { ...result };
            fill_data(weather);
        })
        .catch((err) => {
            alert("⚠️Fehler beim Datenholen!");
            console.error(err);
        });
};

const fill_data=(weather)=>{
    mainClass =
    mainClass = weather.main && weather.main.temp > 18 ? "hot" : "cold";
    app_container.className=mainClass;
    weather_location.textContent = weather.name + " , " + weather.sys.country;
    date.textContent = dateBuild(new Date());
    temperature_current.textContent = 
    "Current Tempertaure:" + Math.round(weather.main.temp) + "°C";
    temperature_max_min.textContent =
    "Hight:" +
    Math.round(weather.main.temp_max) +
    "°C / Low:" +
    Math.round(weather.main.temp_min) +
    "°C";
    _weather.textContent = weather.weather[0].main;
    weather_desc.textContent =
    weather.weather[0].description + " , wind speed is " + weather.wind.speed;
};
const dateBuild = (d) => {
    let date = String(new window.Date());
    date = date.slice(3, 15);
    return date;
};
