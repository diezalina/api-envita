const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Usuario = require('../models/user');

const router = express.Router();

router.post("", (req, res, next) => {
    let fetchedUsr;
    Usuario.findOne({ email: req.body.email })
        .then(usuario => {
            if (!usuario) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            fetchedUsr = usuario;
            return bcrypt.compare(req.body.password, usuario.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            const token = jwt.sign(
                { usr_login: fetchedUsr.email, usrId: fetchedUsr._id },
                "mobile_salt_auth"
            );
            res.status(200).json({
                token: token,
                usrId: fetchedUsr._id
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(401).json({
                message: "Auth failed"
            });
        });
});

module.exports = router;
