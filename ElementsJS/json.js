const express = require("express");
const app = express()

const jsonParser = express.json();

app.post("/user", jsonParser, function(request, response){
    console.log(request.body)
    if(!request.body) return response.sendStatus(404);
    response.json(request.body); 
})

app.use("/", function(request, response){
    response.sendFile(__dirname + "/reg.html");
})
app.listen(3000);

