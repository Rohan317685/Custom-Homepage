const background = document.getElementById("background");

async function getBackground() {
    
    const url = "https://api.nasa.gov/planetary/apod?api_key=ajiOhbncaSAojXhqnHevZ1qwHcxvmiBjTYrhREFd";

    try {

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log("NASA Data:", result);

        if (result.media_type !== "image") {
            console.log("APOD returned a non-image media type (like a video).");
            return null;
        }

        return result.url; 
    } catch (error) {
        console.log("Error fetching data:", error.message);
        return null;
    }
}



const timeElement = document.getElementById("time");

setInterval(() => {
    let dateObject = new Date ();

    let unixMs = dateObject.getTime();


    let localMs = unixMs - (dateObject.getTimezoneOffset() * 60 * 1000);

    const msInDay = 24 * 60 * 60 * 1000;
    let msToday = localMs % msInDay;


    let hours = Math.floor(msToday / (60 * 60 * 1000));

    let minutes = Math.floor((msToday % (60 * 60 * 1000)) / (60 * 1000));

    let seconds = Math.floor((msToday % (60 * 1000)) / 1000);

    let h = hours < 10 ? '0' + hours : hours;
    let m = minutes < 10 ? '0' + minutes : minutes;
    let s = seconds <10 ? '0' + seconds : seconds;

    timeElement.innerText = `${h}:${m}:${s}`;
}, 1000);

async function getWeather(lat, lon) {
   
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=relative_humidity_2m,temperature_2m,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Weather fetch failed");

        const data = await response.json();

        const temp = Math.floor(data.current.temperature_2m);
        const humidity = data.current.relative_humidity_2m;
        const wind = Math.floor(data.current.wind_speed_10m);

        const weatherElement = document.getElementById("weather");
        if (weatherElement) {
            weatherElement.innerText = `${humidity}% ${temp}°F ${wind} MPH`;
        }
    } catch (error) {
        console.log("Weather Error", error.message);
    }
}

window.onload = function () {
    
    getBackground().then(function (imageUrl) {
        if (background && imageUrl) {
            background.style.backgroundImage = `url('${imageUrl}')`;
        }
    });

    if (navigator.geolocation) {
        console.log("Attempting to find user location");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log(`Success! Lat: ${lat}, Lon: ${lon}`);

                getWeather(lat, lon);

                setInterval(() => getWeather(lat, lon), 900000);
            },
            (error) => {
                console.log("location acces rejected, default is boston");
                getWeather(42.36, -71.06);
            }
        );
    } else {
        console.log("Browser does not support Geolocation.");
        getWeather(42.36, -71.06);
    }
};

window.onpageshow = function(event) {
    if (event.persisted){
        window.location.reload();
    }
};

function performSearch() {
    const query = document.getElementById("user-request").value;
    if (query) {
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }
}

document.getElementById("oracle-btn").addEventListener("click", performSearch);

document.getElementById("user-request").addEventListener("keypress", (e) => {
    if (e.key === "Enter") performSearch();
});
