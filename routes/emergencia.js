const express = require("express");

const Emergencia = require("../models/emergencia");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, "images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname
            .toLowerCase()
            .split(" ")
            .join("-");
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + "-" + Date.now() + "." + ext);
    }
});

/**
 * AGREGAR NUEVA EMERGENCIA
 */
router.post("/add-emergencia", multer({ storage: storage }),(req, res, next) => {
    const url = req.protocol + "://" + req.get("host")+/images/;
    const emergencia = new Emergencia({
        nombre: req.body.nombre,
        fecha: req.body.fecha,
        imagen: url + req.file.filename
    });
    emergencia
        .save()
        .then(result => {
            res.status(201).json({
                message: "Emergencia agregada",
                result: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

/**
 * EMERGENCIA ESPECIFICA
 */
router.get("/:id", (req, res, next) => {
    Emergencia.findById(req.params.id).then(emergencia => {
        if (emergencia) {
            res.status(200).json(emergencia);
        } else {
            res.status(404).json({ message: "Emergencia no encontrada" });
        }
    })
        .catch(err => {
            res.status(500).json({
                err: err,
                message: "Método traer emergencia falló"
            });
        });
});

/**
 * EDITAR EMERGENCIA
 */
router.put("/edit/:id", multer({storage: storage}), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }
    const emergencia = {
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        imagen: imagePath
    };
    Emergencia.findOneAndUpdate({_id: req.params.id}, emergencia).then(result => {
        res.status(200).json({
            message: "Actualización exitosa"
        });
    })
        .catch(err => {
            res.status(500).json({
                err: err,
                message: "Actualización fallida"
            });
        });
});

/**
 * TRAER TODAS LAS EMERGENCIAS
 */
router.get("", (req, res, next) => {
    Emergencia.find().then(emergencias => {
        res.status(200).json({
            message: "Traídas con éxito",
            emergencias: emergencias
        });
    })
        .catch(err => {
            res.status(500).json({
                message: "Método falló",
                err: err
            });
        });
});

/**
 * BORRAR EMERGENCIA
 */
router.delete("/:id", (req, res, next) => {
    Emergencia.deleteOne({_id: req.params.id}).then(result => {
        res.status(200).json({
            message: "Emergencia borrada"
        })
            .catch(err => {
                res.status(500).json({
                    err: err,
                    message: "Borrar emergencia falló"
                });
            });
    });
});

module.exports = router;
