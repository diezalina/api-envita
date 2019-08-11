const express = require('express');
const bcrypt = require('bcrypt');

const Usuario = require('../models/user');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

/**
 * AGREGAR USUARIO
 */
router.post("/add-usuario", (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const usuario = new Usuario({
            name: req.body.nombre,
            lastName: req.body.apellido,
            email: req.body.email,
            password: hash
        });
        usuario
            .save()
            .then(result => {
                res.status(201).json({
                    message: 'Usuario creado',
                    result: result
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
                console.log(err);
            });
    });
});

/**
 * EDIT USUARIO
 */
router.put("/edit/:id", (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const usuario = {
            name: req.body.nombre,
            lastName: req.body.apellido,
            email: req.body.email,
            password: hash,
        };
        Usuario.findOneAndUpdate({_id: req.params.id}, usuario).then(result => {
            res.status(201).json({
                message: "Actualización exitosa",
                result: result
            });
        })
            .catch(err => {
                console.log(err);
                res.status(501).json({
                    message: "Couldn't update"
                });
            });
    });
});

/**
 * GET SPECIFIC USER
 */
router.get("/:id", (req, res, next) => {
    Usuario.findById(req.params.id).then(usuario => {
        if (usuario) {
            res.status(200).json(usuario);
        } else {
            res.status(404).json({
                message: "Usuario no encontrado"
            });
        }
    })
        .catch(err => {
            res.status(500).json({
                err: err,
                message: "Error inesperado"
            });
            console.log(err);
        });
});

/**
 * GET ALL USERS
 */
router.get("", (req, res, next) => {
    Usuario.find().then(usuarios => {
        res.status(200).json({
            message: "Éxito",
            usuarios: usuarios
        });
    })
        .catch(err => {
            res.status(500).toJSON({
                err: err,
                message: "Error inesperado"
            });
            console.log(err);
        });
});

/**
 * DELETE USER
 */
router.delete("/:id", (req, res, next) => {
    Usuario.findOneAndDelete({_id: req.params.id}).then(result => {
        res.status(200).json({
            message: "Usuario eliminado"
        });
    })
        .catch(err => {
            res.status(500).json({
                err: err,
                message: "Error inesperado"
            });
            console.log(err);
        });
});

module.exports = router;
