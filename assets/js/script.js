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
var display12 = $('#display1');
var factHead = $('#factHead');
//If there's nothing in local storage, set up an array, otherwise parse the array for local storage
if (typeof (localStorage.saveArray) == "undefined") {
  var saveArray = [];
} else {
  var saveArray = JSON.parse(localStorage.saveArray);
}

var birdAdd = $('#bird-input');
var birdButton = $('#add-button')

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

//get map to populate in html
var map = L.map('map').setView([44.9778, -93.2650], 11);
L.tileLayer('https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=BDq8ih5k4CXhmse4zYZL', {
  maxZoom: 19,
  attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
}).addTo(map);

function getLoc() {
  var requestUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchbar.val() + '&appid=' + geokey;
  fetch(requestUrl)
    .then(function (response) {
      searchbar.val("");
      return response.json();
    })
    .then(function(data) {
      var lat = data[0].lat;
      var lon = data[0].lon;
      //move the map to searched location
      map.setView([lat,lon],11);
      var birdRequest = "https://api.ebird.org/v2/data/obs/geo/recent?lat="+ lat + "&lng=" + lon + "&maxResults=10";
      fetch(birdRequest,requestOptions)
        .then(function(birdResponse) {
          return birdResponse.json();
        })
        .then(function(birdData) {
          // only execute for loop if number of children for tableBody is 0 If not 0 then it means its already populated
          // Then execute text replacement instead
          var markerGroup = L.layerGroup();
          if (tableBody.children().length===0) {
            for (var i = 0; i< 10; i++) {
              var tableRow = $('<tr class="border-b">');
              tableBody.append(tableRow);
              var numEl = $('<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"></td>');
              tableRow.append(numEl);
              numEl.text(i+1);
              var nameEl = $('<td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"></td>');
              tableRow.append(nameEl);
              nameEl.attr('id',"name" + i);
              nameEl.text(birdData[i].comName);
              nameEl.attr('class',"birdName");
              var locEl = $('<td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"></td>');
              tableRow.append(locEl);
              locEl.text(birdData[i].locName);
              locEl.attr('id',"loc" + i);
              var marker = L.marker([birdData[i].lat, birdData[i].lng])
                .bindPopup(birdData[i].comName + "<br><br>" + birdData[i].locName)
                .openPopup();
              markerGroup.addLayer(marker);
            }
            markerGroup.addTo(map);
          } else {
            // remove markers for leaflet map
            map.eachLayer((layer) => {
              if(layer['_latlng']!=undefined)
                  layer.remove();
            });
            // add markers for bird locations back to map
            for (var i = 0; i<10; i++) {
              var nameid = "#name" + i;
              var locid = "#loc" + i;
              $(nameid).text(birdData[i].comName);
              $(locid).text(birdData[i].locName);
              var marker = L.marker([birdData[i].lat, birdData[i].lng]);
              markerGroup.addLayer(marker);
            }
            markerGroup.addTo(map);
          }
        })
    })
}

//Click function for searchbar
go.on('click',function() {
  if (searchbar.val() !=""){
    getLoc();
  }
});
//searchbar also executes on clicking "enter"
searchbar.keydown(function(e) {
  var keyCode = e.which;
  if (keyCode ==13 && searchbar.val() != "") {
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

//wiki api for facts
function getFact(e) {
  fetch('https://wiki-briefs.p.rapidapi.com/search?q=' + e + '&topk=3', options)
	  .then(response => response.json())
	  .then(response => {
      //clear text
      for (var j=0; j<3; j++) {
        display12.children().eq(j).text("");
      }
      for (var i=0; i<response.summary.length; i++) {
        display12.children().eq(i).text(response.summary[i]);
      }
  }) 

  
	.catch(err => console.error(err));
}
//Searchbar function that executes on pressing enter
birdSearch.keydown(function(e) {
  var keyCode = e.which;
  if (keyCode ==13 && birdSearch.val()!="") {
    getFact(birdSearch.val());
  }
});
var birdFormEl = $('#bird-form');
var birdListEl = $('#bird-list');
 

//Function to add a bird to the list of birds to see
function addBird(event) {
  
  if (event != "Generate a Table by Searching for a Location then Click on the Common Name to search generate facts about the bird!") {
    var newCheck = $('<input id="default-checkbox" type="checkbox" value="" class="col-start-1 col-span-1 w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">');
    birdListEl.append(newCheck);
    var checkCol = $('<div class="grid grid-cols-12 gap-2 items-center"></div>');
    birdListEl.append(checkCol);
    checkCol.append(newCheck);
    
    // print to the page
    checkCol.append('<li class="col-span-9 birdSave">' + event + '</li>');
    var removeBtn = $('<button class="bg-red-600 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded col-span-2 m-2 removeBtn">X</button>');
    checkCol.append(removeBtn);
  }
}
  


//function to save the array to the local storage
function saveText() {
  if (factHead.text() != "Generate a Table by Searching for a Location then Click on the Common Name to search generate facts about the bird!") {
    saveArray.push(factHead.text());
    localStorage.setItem("saveArray", JSON.stringify(saveArray));
  }
}

//Function to add birds that want to see to the list
birdButton.on('click', function() {
  saveText(factHead.text());
  addBird(factHead.text());
});

// click function for birds that get added to the table.
$(document).on('click','.birdName' ,function() {
  factHead.text(this.innerText);
  getFact(this.innerText);
})

//function that is executed on load of the webpage.
function webLoad() {
  var saveLoc = JSON.parse(localStorage.saveArray);
  for (i=0; i<saveArray.length; i++) {
    var newCheck = $('<input id="default-checkbox" type="checkbox" value="" class="col-start-1 col-span-1 w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 strikethrough">');
    birdListEl.append(newCheck);
    var checkCol = $('<div class="grid grid-cols-12 gap-2 items-center leading-5"></div>');
    var removeBtn = $('<button class="bg-red-600 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded col-span-2 m-2 removeBtn">X</button>');
    birdListEl.append(checkCol);
    checkCol.append(newCheck);
    
    // print to the page
    checkCol.append('<li class="col-span-9 birdSave">' + saveLoc[i] + '</li>');
    checkCol.append(removeBtn);
  }
}

//click function for buttons that are created when adding birds to the list.
$(document).on('click','.removeBtn',  function() {
  $(this).parent().remove();
  var alen = birdListEl.children().length;
  saveArray=[];
  for (i=0; i<alen; i++) {
    saveArray.push(birdListEl.children().eq(i).children().eq(1).text());
  }
  localStorage.setItem("saveArray", JSON.stringify(saveArray));
})

//if local storage exists, then it'll execute the webload funciton
if (typeof (localStorage.saveArray) !== "undefined") {
  webLoad();
}
