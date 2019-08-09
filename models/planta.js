const mongoose = require("mongoose");

const plantaSchema = mongoose.Schema({
    nombre: { type: String },
    descripcion: { type: String },
    imagePath: { type: String },
    region: { type: String }
});

module.exports = mongoose.model("Planta", plantaSchema);
