var myHeaders = new Headers();
myHeaders.append("X-eBirdApiToken", "kvj4gs6ni5d6");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

function getApi() {
    var requestUrl = "https://api.ebird.org/v2/data/obs/KZ/recent";

    fetch(requestUrl,requestOptions)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
          console.log(data);
        })
}

getApi();




//--------WIKI API-------//

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '3425c8886cmshb521a908739dc9cp160b7cjsn7a634b12bcb5',
		'X-RapidAPI-Host': 'wiki-briefs.p.rapidapi.com'
	}
};

fetch('https://wiki-briefs.p.rapidapi.com/search?q=Messi&topk=3', options)
	.then(response => response.json())
	.then(response => {console.log(response.summary[0])

      const info = response.summary[0];
      const outputinfo = document.getElementById("information");
      const display12 = document.getElementById("display1");
      const displayinfo = document.createElement("h1");
      displayinfo.innerHTML = outputinfo;
      display12.textContent = info;
  }) 

  
	.catch(err => console.error(err));

 
  
 