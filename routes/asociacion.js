const express = require("express");

const Asociacion = require("../models/asociacion");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

/**
 * AGREGAR NUEVA ASOCIACION
 */
router.post("/add-asociacion", (req, res, next) => {
    const asociacion = new Asociacion({
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        icono: req.body.icono
    });
    asociacion
        .save()
        .then(result => {
            res.status(201).json({
                message: "Asociacion agregada",
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
 * ASOCIACION ESPECIFICA
 */
router.get("/:id", (req, res, next) => {
    Asociacion.findById(req.params.id).then(asociacion => {
        if (asociacion) {
            res.status(200).json(asociacion);
        } else {
            res.status(404).json({ message: "Asociación no encontrada" });
        }
    })
        .catch(err => {
            res.status(500).json({
                err: err,
                message: "Método traer asociación falló"
            });
        });
});

/**
 * EDITAR ASOCIACION
 */
router.put("/edit/:id", (req, res, next) => {
    const asociacion = {
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        icono: req.body.icono
    };
    Asociacion.findOneAndUpdate({_id: req.params.id}, asociacion).then(result => {
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
 * TRAER TODAS LAS ASOCIACIONES
 */
router.get("", (req, res, next) => {
    Asociacion.find().then(asociaciones => {
        res.status(200).json({
            message: "Traídas con éxito",
            asociaciones: asociaciones
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
 * BORRAR ASOCIACION
 */
router.delete("/:id", (req, res, next) => {
    Asociacion.deleteOne({_id: req.params.id}).then(result => {
        res.status(200).json({
            message: "Asociación borrada"
        })
            .catch(err => {
                res.status(500).json({
                    err: err,
                    message: "Borrar asociación falló"
                });
            });
    });
});

module.exports = router;
