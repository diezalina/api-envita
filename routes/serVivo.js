const express = require('express');

const SerVivo = require('../models/servivo');
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
 * AGREGAR NUEVO SER VIVO
 */
router.post("/add-servivo", multer({ storage: storage }),(req, res, next) => {
    const url = req.protocol + "://" + req.get("host")+/images/;
    const servivo = new SerVivo({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        imagen: url + req.file.filename,
        region: req.body.region
    });
    servivo
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
 * SER VIVO ESPECIFICO
 */
router.get("/:id", (req, res, next) => {
    SerVivo.findById(req.params.id).then(servivo => {
        if (servivo) {
            res.status(200).json(servivo);
        } else {
            res.status(404).json({ message: "SerVivo no encontrada" });
        }
    })
        .catch(err => {
            res.status(500).json({
                err: err,
                message: "Método traer servivo falló"
            });
        });
});

/**
 * EDITAR SER VIVO
 */
router.put("/edit/:id", multer({storage: storage}), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }
    const servivo = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        imagen: imagePath,
        region: req.body.descripcion
    };
    SerVivo.findOneAndUpdate({_id: req.params.id}, servivo).then(result => {
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
 * TRAER TODOS LOS SERES VIVOS
 */
router.get("", (req, res, next) => {
    SerVivo.find().then(servivos => {
        res.status(200).json({
            message: "Traídos con éxito",
            servivos: servivos
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
 * BORRAR SER VIVO
 */
router.delete("/:id", (req, res, next) => {
    SerVivo.deleteOne({_id: req.params.id}).then(result => {
        res.status(200).json({
            message: "Ser vivo borrado"
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
