const express = require('express');

const app = express();

app.use(function(req,res){
    res.sendFile(__dirname + "/index.html");
});
app.listen(3000);