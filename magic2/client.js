const fetch = require('node-fetch')
const mongoose =require('mongoose') 
const prompt = require('prompt-sync')

var requestOptions = {
    method: 'GET',
    redirect: 'follow',
};

const connection_link = "mongodb+srv://admin:admin@cluster0.vpkpr8r.mongodb.net/Email_Repository?retryWrites=true&w=majority"

try {
    // Connect to the MongoDB cluster
    mongoose.connect(
        connection_link,
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => console.log(`Connecting console to database ...SESSION STATE = "active"`)
    );

} catch (err) {
    console.log("could not connect");
}

const list_schema = new mongoose.Schema({
    name: String,
    keywords: Array
})

const List = new mongoose.model("Verified_Keyword", list_schema);

//domain => domain name
const getdomainList = async (domain) => {
    try {
        // console.log("dfsffdfs");
        const result = await List.find({ name: domain });
        // console.log(result[0].keywords);
        return result[0].keywords;
    } catch (err) {
        console.log(err);
    }
}


const updatedomainList = async (domain, workable) => {
    try {
        const old_list = await List.find({ name: domain });
        var new_list = old_list[0].keywords
        new_list.push(workable);
        const result = await List.updateOne({ name: domain }, {
            $set: {
                keywords: new_list
            }
        });
        console.log(result);
    } catch (err) {
        console.log(err);
    }
}
// updatedomainList("hell.com",["1","4","5","6"]);
// getdomainList("hell.com")

const pingkeywords = async (domain) => {
    try {
        const old_list = await List.find({ name: domain });
        const result = await List.updateOne({ name: domain }, {
            $set: {
                keywords: []
            }
        });
        const unverified = await List.find({ name: "unverified" });
        const unverified_list = unverified[0].keywords;
        for (let value of unverified_list) {
            await fetch("https://api.apilayer.com/email_verification/check?apikey=YOiQ51CeqENzwkiZp917gFYKpxqwpczE&email=" + value + "@" + domain, requestOptions)
                .then(response => response.json())
                .then(result => {
                    // console.log(result)
                    if (result.smtp_check == true) {
                        //action needed here
                        updatedomainList(domain, value)
                        // console.log(`${value} added to ${domain}`); 
                    }
                })
                .catch(error => console.log('error', error));
        }
    } catch (err) {
        console.log(err);
    }
}
console.log(`pls wait, connecting you to admin console ...SESSION STATE = "active"`)


//Content to export
const take_client_input = async (admin_cmd) => {
    try {
        await pingkeywords(admin_cmd);
        return await getdomainList(admin_cmd);
    } catch (err) {
        console.log(err);
    }

}
// take_client_input("amazon.com");
module.exports=take_client_input;
// take_client_input()