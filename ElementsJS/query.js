const express = require("express");
const app = express();

app.get("/get",function(request,response){
    let id = request.query.id;
    let name = request.query.name;

    response.send("<p>" + id + "</p><p>"+ name + "</p>");
})
app.listen(3000);