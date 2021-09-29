var searchButton = $(".search-button");
var lastSearches = [];



function saveLastSearch() {

    localStorage.setItem("recentCitySearches", JSON.stringify(lastSearches));
}

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

function init() {
    var storedSearches = JSON.parse(localStorage.getItem("recentCitySearches"));

    if (storedSearches !== null ) {
        lastSearches = storedSearches;
    }
}

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

function getDataByCoord(cityData) {
    var lon = cityData.city.coord.lat;
    var lat = cityData.city.coord.lon;
    console.log(lon +' : ' + lat);
}

init();