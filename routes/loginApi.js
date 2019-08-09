const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Usuario = require('../models/user');

const router = express.Router();

router.post("", (req, res, next) => {
    let fetchedUsr;
    console.log(req.body);
    Usuario.findOne({ email: req.body.email })
        .then(usuario => {
            if (!usuario) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            fetchedUsr = usuario;
            console.log(fetchedUsr);
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
                userId: fetchedUsr._id
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
