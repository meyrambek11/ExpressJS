const express = require('express');
const app = express();

app.get("/bo?k", function(req, res){
    res.send("<h1>Book</h1>");
})
app.listen(3000);