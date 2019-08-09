const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

<<<<<<< HEAD
const usuarioRoutes = require("./routes/user");
const serVivoRoutes = require("./routes/serVivo");
const plantaRoutes = require("./routes/planta");
const emergenciaRoutes = require("./routes/emergencia");
const ayudaRoutes = require("./routes/ayuda");
const asociacionRoutes = require("./routes/asociacion");
const mobileAuth = require("./routes/loginApi");
=======
>>>>>>> parent of 2b6cd4c... Added routes
const app = express();

mongoose
    .connect(
    "mongodb+srv://envita:3nv1t42019@envita-cluster-orzvt.mongodb.net/envita?retryWrites=true&w=majority"
    )
    .then(() => {
        console.log("Connected to db!");
    })
    .catch(err => {
        console.log(err);
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "/images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    next();
});

module.exports = app;
