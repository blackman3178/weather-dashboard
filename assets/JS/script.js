var searchButton = $(".search-button");
var lastSearches = [];



function saveLastSearch() {

    localStorage.setItem("recentCitySearches", JSON.stringify(lastSearches));

    // var searchInputVal = document.querySelector("#search-input").value;
    // console.log(searchInputVal.value);

    // if (!searchInputVal) {
    //     console.error("You need a search input value!!");
    //     return;
    // }
    // lastSearches.push(searchInputVal);
    // localStorage.setItem("Recent City Searches", JSON.stringify(lastSearches));
}

searchButton.on("click",function (event) {
    event.preventDefault();
    var searchInputVal = document.querySelector("#search-input").value;
    console.log(searchInputVal);
    if (!searchInputVal) {
        console.error("You need a search input value!!");
        return;
    }
    lastSearches.push(searchInputVal);
    console.log(lastSearches);
    document.querySelector("#search-input").value = "";
    saveLastSearch();
});

function init() {
    var storedSearches = JSON.parse(localStorage.getItem("recentCitySearches"));

    if (storedSearches !== null ) {
        lastSearches = storedSearches;
    }
}

init();