const express = require("express");

const app = express();

app.use(express.json());

app.use("/api/user", require("./routes/users"));

/*app.use("/", function(request, response){
    response.sendFile(__dirname + "/reg.html");
})*/



app.listen(5000, () =>{
    console.log("Server is working")
})