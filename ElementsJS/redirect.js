const express = require("express");
const app = express();

app.use("/about", function(request, response){
    response.redirect("https://metanit.com/")
});
app.use("/",function(request, response){
    response.send("<h1>Main</h1>");
})
app.listen(3000)

