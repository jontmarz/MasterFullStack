'use strict'

const express = require('express');
const UserController = require('../controllers/user');

const router = express.Router();
const md_auth = require('../middlewares/auth');

const multipart = require('connect-multiparty');
// var md_upload = multipart({ uploadDir: './uploads/users' });
var crypto = require('crypto');
var multer = require('multer');
const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './uploads/albums');
    },
    filename(req, file = {}, cb) {
      const { originalname } = file;
      const fileExtension = (originalname.match(/\.+[\S]+$/) || [])[0];
      crypto.pseudoRandomBytes(16, function (err, raw) {
        cb(null, raw.toString('hex') + Date.now() + fileExtension);
      });
    },
  });
  var md_upload = multer({dest: './uploads/albums',storage});

// rutas de prueba
router.get('/probando', UserController.probando);
router.post('/testeando', UserController.testeando);

// Rutas de usuario
router.post('/register', UserController.save);
router.post('/login', UserController.login);
router.put('/update', md_auth.auth, UserController.update);
router.post('/upload-avatar', [md_auth.auth, md_upload.single('image')],  UserController.uploadAvatar);
router.get('/avatar/:fileName', UserController.avatar);
router.get('/users', UserController.getUsers);
router.get('/user/:userId', UserController.getUser);

module.exports = router;
