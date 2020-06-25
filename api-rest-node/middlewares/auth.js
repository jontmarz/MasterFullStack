'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
var secret= 'clave-secreta-para-generar-token-125885';


exports.auth = (req, res, next) => {
    // comprobar autorización
    if (!req.headers.authorization) {
        return res.status(403).send({
            message: 'La petición no tiene la Autorización'
        });
    } 

    // Limpiar token y quitar comillas
    const token = req.headers.authorization.replace(/['"']+/g, '');

    try {
        // decodificar el token
        var payload = jwt.decode(token, secret);

        // comprobar la expiración del token
        if (payload.exp <= moment().unix()) {
            return res.status(404).send({
                message: 'El token ha expirado'
            });
        }
        
    } catch (ex) {
        return res.status(404).send({
            message: 'El token no es válido'
        });
    }
    // adjuntar usuario identificado a request
    req.user = payload;

    // autorizar y dejar pasar
    next();
}