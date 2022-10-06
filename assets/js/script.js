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