'use strict'

const express = require('express');
const UserController = require('../controllers/user');

const router = express.Router();
const md_auth = require('../middlewares/auth');

const multipart = require('crypto');
const multer = require('multer');
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './upload/albums');
    },
    filename(req, file={}, cb) {
        const{original} = file;
        const fileExtension = (original.match(/\.+[\S]+$/) || [])[0];

        crypto.pseudoRandomBytes(16, (err, raw) => {
            cb(null, raw.toString('hex') + Date.now() + fileExtension);
        });
    }
})
const md_upload = multer({dest: './uploads/albums', storage});

// rutas de prueba
router.get('/probando', UserController.probando);
router.post('/testeando', UserController.testeando);

// Rutas de usuario
router.post('/register', UserController.save);
router.post('/login', UserController.login);
router.put('/update', md_auth.auth, UserController.update);
router.post('/upload-avatar/:id', [md_auth.ensure.Auth, mul_upload.single('image')], UserController.uploadAvatar);

module.exports = router;
