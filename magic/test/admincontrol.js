import fetch from 'node-fetch'
import mongoose from 'mongoose'


var requestOptions = {
  method: 'GET',
  redirect: 'follow',
};

const connection_link = "mongodb+srv://admin:admin@cluster0.vpkpr8r.mongodb.net\Email_Repository?retryWrites=true&w=majority"

try {
  // Connect to the MongoDB cluster
  mongoose.connect(
    connection_link,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Connection established...Database Session begins.....")
  );

} catch (err) {
  console.log("could not connect");
}

const list_schema = new mongoose.Schema({
  name: String,
  keywords: Array
})

const List = new mongoose.model("Verified_Keyword", list_schema);

//(domain,workables) => name of domain, verified keywords
const createdomainList = async (domain, workables) => {
  try {
    var entry = new List({
      name: domain,
      keywords: workables
    })
    var prog = await entry.save();
    // console.log(prog);
  } catch (err) {
    console.log(err);
  }
}
// createdomainList("hell.com",["d","g","h"])
//domain => domain name
const getdomainList = async (domain) => {
  try {
    const result = await List.find({ name: domain });
    // console.log(result);
  } catch (err) {
    console.log(err);
  }
}
// getDocument("hell.com")

const updatedomainList = async (domain, workable) => {
  try {
    const old_list = await List.find({ name: domain });
    var new_list = old_list[0].keywords
    new_list.push(workable);
    const result = await List.updateOne({ name: domain }, {
      $set: {
        keywords:new_list
      }
    });
    // console.log(result);
  } catch (err) {
    console.log(err);
  }
}
// updatedomainList("hell.com",["1","4","5","6"]);
// getdomainList("hell.com")

const deletedomainList = async (domain) => {
  try {
    const result = await List.deleteOne({ name: domain });
    // console.log(result);
  } catch (err) {
    console.log(err);
  }
}

const updateunverifiedlist = async (workables) => {
  try {
    const old_list = await List.find({ name: "unverified" });
    const old_list_keywords = (old_list[0].keywords).concat(workables);
    const result = await List.updateOne({ name: "unverified" }, {
      $set: {
        keywords: new_list
      }
    });
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

const pingkeywords = async (domain) => {
  try {
    const old_list = await List.find({ name: domain });
    const result = await List.updateOne({ name: domain }, {
      $set: {
        keywords:[]
      }
    });

    const unverified = await List.find({ name: "unverified" });
    const unverified_list = unverified[0].keywords;
    for (let value of unverified_list) {
      fetch("https://api.apilayer.com/email_verification/check?apikey=4gGrZJAfwbMEuhpf0dQHoClKkApgq1Qm&email=" + value + "@" + domain, requestOptions)
        .then(response => response.json())
        .then(result => {
          // console.log(result)
          if(result.smtp_check==true){
            //action needed here
            updatedomainList(domain,value)
          } 
        })
        .catch(error => console.log('error', error));
    }

  } catch (err) {
    console.log(err);
  }
}

