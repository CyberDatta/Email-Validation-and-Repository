import fetch from 'node-fetch'
// var myHeaders = fetch.Headers();
// myHeaders.append("apikey", "4gGrZJAfwbMEuhpf0dQHoClKkApgq1Qm");

var requestOptions = {
    method: 'GET',
    redirect: 'follow',
};



const array = ["datta.dhruv6", "dhruvmohandatta1234"]
const domain="gmail.com"

var verified_list = [];
for (let value of array) {
    fetch("https://api.apilayer.com/email_verification/check?apikey=4gGrZJAfwbMEuhpf0dQHoClKkApgq1Qm&email=" + value + "@" + domain, requestOptions)
        .then(response => response.text())
        .then(result => {

                let email_status =JSON.parse(result)
                console.log(email_status)
                if (email_status.smtp_check == true) {
                    verified_list.push(value)
                }


        })
        .catch(error => console.log('error', error));
}
