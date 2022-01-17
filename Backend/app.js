const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require("./helper/error-handler");
require("dotenv/config");
const authJwt = require("./helper/jwt");

//cors
app.use(cors());
app.options('*',cors());

//middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))

//authentication for users
app.use(authJwt());

//errors detect
app.use(errorHandler);

//enviroment
const API = process.env.API_URL;
const CONNECT = process.env.CONNECTION_STRING;

//routers
const categoriesRouter= require('./routers/categories');
const productsRouter= require('./routers/products');
const usersRouter= require('./routers/users');
const ordersRouter= require('./routers/orders');

app.use(`${API}/categories`, categoriesRouter);
app.use(`${API}/products`, productsRouter);
app.use(`${API}/users`, usersRouter);
app.use(`${API}/orders`, ordersRouter);

//db connect
mongoose
    .connect(CONNECT, {
        //useNewUrlParser: true,
        //useUnifiedTopology: true,
        dbName: "eshop-database",
    })
    .then(() => {
        console.log("Database Connection is ready...");
    })
    .catch((err) => {
        console.log(err);
    });

app.listen(3000, () => {
    //console.log(API);
    console.log("Server running...");
});
