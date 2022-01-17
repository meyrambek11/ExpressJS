const MongoClient = require("mongodb").MongoClient;
    
const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url);
  
mongoClient.connect(function(err, client){
       
    const db = client.db("usersdb");
    const collection = db.collection("users");
    collection.countDocuments(function(err, result){
           
        if(err){ 
            return console.log(err);
        }
        console.log(`В коллекции users ${result} документов`);
        client.close();
    });
});