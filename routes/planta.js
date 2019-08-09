const express = require('express');

const Planta = require('../models/planta');
const multer = require("multer");
const checkAuth = require('../middleware/check-auth');

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
 * AGREGAR NUEVA PLANTA
 */
router.post("/add-planta", multer({ storage: storage }),(req, res, next) => {
    const url = req.protocol + "://" + req.get("host")+/images/;
    const planta = new Planta({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        imagen: url + req.file.filename,
        region: req.body.region
    });
    planta
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Planta agregada',
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
 * PLANTA ESPECIFICA
 */
router.get("/:id", (req, res, next) => {
    Planta.findById(req.params.id).then(planta => {
        if (planta) {
            res.status(200).json(planta);
        } else {
            res.status(404).json({ message: "Planta no encontrada" });
        }
    })
        .catch(err => {
            res.status(500).json({
                err: err,
                message: "Método traer planta falló"
            });
        });
});

/**
 * EDITAR PLANTA
 */
router.put("/edit/:id", multer({storage: storage}), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }
    const planta = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        imagen: imagePath,
        region: req.body.descripcion
    };
    Planta.findOneAndUpdate({_id: req.params.id}, planta).then(result => {
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
 * TRAER TODAS LAS PLANTAS
 */
router.get("", (req, res, next) => {
    Planta.find().then(plantas => {
        res.status(200).json({
            message: "Traídos con éxito",
            plantas: plantas
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
 * BORRAR PLANTA
 */
router.delete("/:id", (req, res, next) => {
    Planta.deleteOne({_id: req.params.id}).then(result => {
        res.status(200).json({
            message: "Planta borrada"
        })
            .catch(err => {
                res.status(500).json({
                    err: err,
                    message: "Borrar planta falló"
                });
            });
    });
});

module.exports = router;
