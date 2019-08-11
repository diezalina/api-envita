const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const usuarioRoutes = require("./routes/user");
const serVivoRoutes = require("./routes/serVivo");
const plantaRoutes = require("./routes/planta");
const emergenciaRoutes = require("./routes/emergencia");
const ayudaRoutes = require("./routes/ayuda");
const asociacionRoutes = require("./routes/asociacion");
const mobileAuth = require("./routes/loginApi");

const app = express();

const cors = require("cors");

mongoose
    .connect(
    "mongodb://envita:3nv1t42019@ds261567.mlab.com:61567/envita-soft"
    )
    .then(() => {
        console.log("Connected to db!");
    })
    .catch(err => {
        console.log(err);
    });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use("/images", express.static(path.join(__dirname, "/images")));

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/plantas", plantaRoutes);
app.use("/api/asociaciones", asociacionRoutes);
app.use("/api/seres-vivos", serVivoRoutes);
app.use("/api/emergencias", emergenciaRoutes);
app.use("/api/ayudar", ayudaRoutes);
app.use("/api/mobile/auth", mobileAuth);

module.exports = app;
