var searchButton = $(".search-button");
var lastSearches = [];


//saves our array of previous searches to local storage
function saveLastSearch() {

    localStorage.setItem("recentCitySearches", JSON.stringify(lastSearches));
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
}

//gets data from oneWeather API using city call, calls the getDataByCoord functionn and inputs the data as a parameter, also error checks.
function getDataByCity(city) {
    var apiUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=d954b63ba94c93f074805e508116108b";

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
    var lon = cityData.city.coord.lat;
    var lat = cityData.city.coord.lon;
    console.log(lon +' : ' + lat);

}

//call initializer
init();