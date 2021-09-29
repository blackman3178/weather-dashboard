var searchButton = $(".search-button");
var lastSearches = [];


//saves our array of previous searches to local storage
function saveLastSearch() {

    localStorage.setItem("recentCitySearches", JSON.stringify(lastSearches));
}

function renderLastSearches() {
    var searchListHTML = $(".filled-by-local-storage");
    searchListHTML.text("");
    console.log(lastSearches);

    for ( var i = 0; i < lastSearches.length; i++) {
        var searchCity = lastSearches[i];

        var div = $("<button>");
        div.text(searchCity);
        div.addClass("btn btn-secondary w-100 mb-3 border");
        searchListHTML.append(div);
    }

}

//on a click of the submit button, get the input from the user search, error check, trim the input and then add it to the array of last searches by calling the function. then call the function to get data by city.
searchButton.on("click",function (event) {
    event.preventDefault();
    var searchInputVal = document.querySelector("#search-input").value;
    console.log(searchInputVal);
    if (!searchInputVal) {
        console.error("You need a search input value!!");
        return;
    }
    lastSearches.push(searchInputVal.trim());
    console.log(lastSearches);
    document.querySelector("#search-input").value = "";
    saveLastSearch();
    getDataByCity(searchInputVal.trim());
});


//initializer function whcih parses data from local storage to the storedSearches array. 
function init() {
    var storedSearches = JSON.parse(localStorage.getItem("recentCitySearches"));

    if (storedSearches !== null ) {
        lastSearches = storedSearches;
    }
    getDataByCity("Tampa");
    renderLastSearches();
}

//gets data from oneWeather API using city call, calls the getDataByCoord functionn and inputs the data as a parameter, also error checks.
function getDataByCity(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=d954b63ba94c93f074805e508116108b";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data){
                getDataByCoord(data);
            }); 
        } else {
            alert("Error: "+ response.statusText);
        }
    });
}

//uses the data passed in by the city call to get more weather data using lat and lon of user city.
function getDataByCoord(cityData) {
    var lat = cityData.city.coord.lat;
    var lon = cityData.city.coord.lon;
    var name = cityData.city.name;
    console.log(lon +' : ' + lat);
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=d954b63ba94c93f074805e508116108b&units=imperial";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayTodaysData(data,name);
                displayForecast(data);
            });
        } else {
            alert("Error: "+response.statusText + "(COORD)");
        }
    });

}

//gets data from second API call and displays it to the HTML page as todays data.
function displayTodaysData(data, cityName) {
    var tempDisplay = $(".temp-text-main");
    var windDisplay = $(".wind-text-main");
    var humidityDisplay = $(".humidity-text-main");
    var uviDisplay = $("#put-uvi-here");
    var cityAndDate = $("#city-header");
    var weatherImage = $(".weather-icon-main");


    
    //clear existing data
    tempDisplay.text("");
    windDisplay.text("");
    humidityDisplay.text("");
    uviDisplay.text("");
    cityAndDate.text('');
    //show weather icon
    weatherImage.attr("style", "visibility: visible;");

    cityAndDate.text(cityName + " (" + moment().format("M/D/YYYY" + ")"));
    
    //change the current weather icon
    var iconCode = data.current.weather[0].icon;
    var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
    weatherImage.attr("src", iconURL);
    
    //pull data and display in text on webpage
    var currentTemp = data.current.temp;
    currentTemp = String (currentTemp);
    tempDisplay.text("Temp: " + currentTemp + " F" );

    var currentWind = data.current.wind_speed;
    windDisplay.text("Wind: " + currentWind + " MPH");

    var currentHumidity = data.current.humidity;
    humidityDisplay.text("Humidity: " + currentHumidity + "%");

    var currentUVI = data.current.uvi
    uviDisplay.text(currentUVI);

    renderLastSearches();
}

// compiles and renders the weather forecast for the next five days
function displayForecast (data) {

    for (var i = 0; i < 5; i++) {
        count = i+1;
        //calls elements based on count number
        var dateBox = $(".date-" + count);
        var weatherIcon = $(".weather-icon-" + count);
        var tempBox = $(".temp-text-" + count);
        var windBox = $(".wind-text-" + count);
        var humidityBox = $(".humidity-text-" + count);

        // display weather icons
        var iconCode = data.daily[i].weather[0].icon;
        var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
        weatherIcon.attr("src", iconURL);

        dateBox.text(moment().add(count, "days").format("M/D/YYYY"))
        dateBox.addClass("font-bolder text-white")

        //clear previous input
        tempBox.text("");
        windBox.text("");
        humidityBox.text("");

        //update data and display
        var tempurature = data.daily[i].temp.day;
        tempBox.text("Temp: " + tempurature + " F").addClass("text-white");

        var windSpeed = data.daily[i].wind_speed;
        windBox.text("Wind: " + windSpeed + " MPH").addClass("text-white");

        var humidity = data.daily[i].humidity;
        humidityBox.text("Humidity: " + humidity + "%").addClass("text-white");

    }

}

//call initializer
init();