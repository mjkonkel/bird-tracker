//eBird API Parameters
var myHeaders = new Headers();
myHeaders.append("X-eBirdApiToken", "kvj4gs6ni5d6");
var geokey = "c9676e6950f05e39b2aae36c413d9dff";
var factsCont = $('#cont');
var birdNames = $('#birdNames');
var birdLoc = $('#birdLoc');
var tableBody = $('#tableBody');
var go = $('#go');
var searchbar = $('#searchbar');
var birdSearch = $('#birdSearch');


var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

//get map to populate in html
var map = L.map('map').setView([51.505, -0.09], 12);
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
      searchbar.val("");
      return response.json();
    })
    .then(function(data) {
      console.log(data);
      var lat = data[0].lat;
      var lon = data[0].lon;
      map.setView([lat,lon],12);
      var markerGroup = L.layerGroup().addTo(map);
      var birdRequest = "https://api.ebird.org/v2/data/obs/geo/recent?lat="+ lat + "&lng=" + lon;
      fetch(birdRequest,requestOptions)
        .then(function(birdResponse) {
          return birdResponse.json();
        })
        .then(function(birdData) {
          console.log(birdData);
          // only execute for loop if number of children for tableBody is 0 If not 0 then it means its already populated
          // Then execute text replacement instead
          if (tableBody.children().length===0) {
            for (var i = 0; i< 10; i++) {
              var tableRow = $('<tr class="border-b">');
              tableBody.append(tableRow);
              var numEl = $('<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"></td>');
              tableRow.append(numEl);
              numEl.text(i+1);
              var nameEl = $('<td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">');
              tableRow.append(nameEl);
              nameEl.attr('id',"name" + i);
              nameEl.text(birdData[i].comName);
              var locEl = $('<td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">');
              tableRow.append(locEl);
              locEl.text(birdData[i].locName);
              locEl.attr('id',"loc" + i);
              var marker = L.marker([birdData[i].lat, birdData[i].lng]);
              marker.addTo(map);
            }
          } else {
            markerGroup.clearLayers();
            for (var i = 0; i<10; i++) {
              var nameid = "#name" + i;
              var locid = "#loc" + i;
              console.log(birdData[i].comName);
              $(nameid).text(birdData[i].comName);
              $(locid).text(birdData[i].locName);
              var marker = L.marker([birdData[i].lat, birdData[i].lng]);
              marker.addTo(markerGroup);
            }
          }
        })
    })
}

go.on('click',function() {
  getLoc();
});
searchbar.keydown(function(e) {
  var keyCode = e.which;
  if (e.which ==13) {
    getLoc();
  }
})


//--------WIKI API-------//

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '3425c8886cmshb521a908739dc9cp160b7cjsn7a634b12bcb5',
		'X-RapidAPI-Host': 'wiki-briefs.p.rapidapi.com'
	}
};

function getFact(e) {
  fetch('https://wiki-briefs.p.rapidapi.com/search?q=' + e + '&topk=3', options)
	  .then(response => response.json())
	  .then(response => {console.log(response)
      
      const info = response.summary[1];
      console.log(response.summary)
      const outputinfo = document.getElementById("information");
      const display12 = document.getElementById("display1");
      const displayinfo = document.createElement("h1");
      displayinfo.innerHTML = outputinfo;
      display12.textContent = info;
  }) 

  
	.catch(err => console.error(err));
}
  
birdSearch.keydown(function(e) {
  var keyCode = e.which;
  if (keyCode ==13) {
    getFact(birdSearch.val());
  }
});