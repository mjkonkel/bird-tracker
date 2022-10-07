//eBird API Parameters
var myHeaders = new Headers();
myHeaders.append("X-eBirdApiToken", "kvj4gs6ni5d6");
var geokey = "c9676e6950f05e39b2aae36c413d9dff";


var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

var go = $('#go');
var searchbar = $('#searchbar')

//get map to populate in html
var map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=BDq8ih5k4CXhmse4zYZL', {
  maxZoom: 19,
  attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
}).addTo(map);

//Add click element
function onMapClick(e) {
  console.log(e.latlng);
  alert("You clicked the map at " + e.latlng);
}

map.on('click', onMapClick);

function getRecent() {
  var requestUrl = "https://api.ebird.org/v2/data/obs/geo/recent?lat="+ lat + "&lng=" + long;

  fetch(requestUrl,requestOptions)
      .then(function (response) {
          return response.json();
      })
      .then(function (data) {
        console.log(data);
      })
}

function getLoc() {
  var requestUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchbar.val() + '&appid=' + geokey;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data);
      var birdRequest = "https://api.ebird.org/v2/data/obs/geo/recent?lat="+ data[0].lat + "&lng=" + data[0].lon;
      fetch(birdRequest,requestOptions)
        .then(function(birdResponse) {
          return birdResponse.json();
        })
        .then(function(birdData) {
          console.log(birdData);
        })
    })
}

go.on('click',getLoc);

