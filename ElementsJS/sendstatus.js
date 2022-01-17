const express = require("express");
const app = express();
 
app.use("/home/foo/bar",function (request, response) {
  response.sendStatus(404).send('Resourse not found');
});
 
app.listen(3000);