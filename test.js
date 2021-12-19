const express = require("express");
const app = express();

const getRouter = express.Router();
const createRouter = express.Router();

createRouter.use("/:id", function(request,response){
    response.send(`Creating product number: ${request.params.id}`);
})

createRouter.use("/new", function(request, response){
    response.send("New product creation");
})

createRouter.use("/", function(request, response){
    response.send("Create a product");
})

getRouter.use("/create",createRouter);

getRouter.use("/technology",function(request, response){
    response.send("Product of technologies")
})
getRouter.use("/", function(request,response){
    response.send("Table of products")
})
//getRouter.use("/:id", function(request,))


app.use("/product", getRouter);


app.use("/", function(request, response){
    response.sendFile(__dirname + "/reg.html");
})
app.use("/about",function(request,response){
    response.send("It's page about a site");
})
app.listen(3000);