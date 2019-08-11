const express = require('express');

const SerVivo = require('../models/serVivo');
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
router.post("/add-ser-vivo", /*multer({ storage: storage }),*/ (req, res, next) => {
    // const url = req.protocol + "://" + req.get("host")+/images/;
    const serVivo = new SerVivo({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        // imagen: url + req.file.filename,
        region: req.body.region
    });
    serVivo
        .save()
        .then(result => {
            res.status(201).json({
                message: 'SerVivo agregada',
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
    SerVivo.findById(req.params.id).then(serVivo => {
        if (serVivo) {
            res.status(200).json(serVivo);
        } else {
            res.status(404).json({ message: "SerVivo no encontrada" });
        }
    })
        .catch(err => {
            res.status(500).json({
                err: err,
                message: "Método traer ser vivo falló"
            });
        });
});

/**
 * EDITAR PLANTA
 */
router.put("/edit/:id", /*multer({ storage: storage }),*/ (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }
    const serVivo = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        imagen: imagePath,
        region: req.body.descripcion
    };
    SerVivo.findOneAndUpdate({_id: req.params.id}, serVivo).then(result => {
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
    SerVivo.find().then(serVivo => {
        res.status(200).json({
            message: "Traídos con éxito",
            serVivo: serVivo
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
    SerVivo.deleteOne({_id: req.params.id}).then(result => {
        res.status(200).json({
            message: "ser vivo borrada"
        })
            .catch(err => {
                res.status(500).json({
                    err: err,
                    message: "Borrar ser vivo falló"
                });
            });
    });
});

module.exports = router;
