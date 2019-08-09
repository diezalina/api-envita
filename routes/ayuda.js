const express = require('express');

const Ayuda = require('../models/ayuda');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

/**
 * AGREGAR NUEVA AYUDA
 */
router.post("/add-ayuda", (req, res, next) => {
    const ayuda = new Ayuda({
        descripcion: req.body.descripcion,
        recomendacion: req.body.recomendacion,
        centrosDeAcopio: req.body.centrosDeAcopio,
        donaciones: req.body.donaciones
    });
    ayuda
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Ayuda agregada',
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
 * AYUDA ESPECIFICA
 */
router.get("/:id", (req, res, next) => {
    Ayuda.findById(req.params.id).then(ayuda => {
        if (ayuda) {
            res.status(200).json(ayuda);
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
 * EDITAR AYUDA
 */
router.put("/edit/:id", (req, res, next) => {
    const ayuda = {
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        icono: req.body.icono
    };
    Ayuda.findOneAndUpdate({_id: req.params.id}, ayuda).then(result => {
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
 * TRAER TODAS LAS AYUDAS
 */
router.get("", (req, res, next) => {
    Ayuda.find().then(ayuda => {
        res.status(200).json({
            message: "Traídas con éxito",
            ayuda: ayuda
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
 * BORRAR AYUDA
 */
router.delete("/:id", (req, res, next) => {
    Ayuda.deleteOne({_id: req.params.id}).then(result => {
        res.status(200).json({
            message: "Ayuda borrada"
        })
            .catch(err => {
                res.status(500).json({
                    err: err,
                    message: "Borrar ayuda falló"
                });
            });
    });
});

module.exports = router;
