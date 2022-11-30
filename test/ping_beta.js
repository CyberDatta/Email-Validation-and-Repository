import fetch from 'node-fetch'
// var myHeaders = fetch.Headers();
// myHeaders.append("apikey", "4gGrZJAfwbMEuhpf0dQHoClKkApgq1Qm");

var requestOptions = {
  method: 'GET',
  redirect: 'follow',
};

fetch("https://api.apilayer.com/email_verification/check?apikey=4gGrZJAfwbMEuhpf0dQHoClKkApgq1Qm&email=datta.dhruv6sdfsfsdfsf@gmail.com", requestOptions)
  .then(response => response.text())
  .then(result =>{
    var email_status=JSON.parse(result)
    console.log(email_status,1)
} )
  .catch(error => console.log('error', error));
