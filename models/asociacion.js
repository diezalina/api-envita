const mongoose = require("mongoose");

const asociacionSchema = mongoose.Schema({
    nombre: { type: String },
    direccion: { type: String },
    icono: { type: String }
});

module.exports = mongoose.model("Asociacion", asociacionSchema);
