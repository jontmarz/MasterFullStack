'use strict'

const validator = require('validator');
const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const fs = require('fs');
const path = require('path');

var controller = {
    probando: (req, res) => {
        return res.status(200).send({
            messaje: "Soy el método probando"
        });
    },

    testeando: (req, res) => {
        return res.status(200).send({
            messaje: "Soy el método testeando"
        });
    },

    save: (req, res) => {
        // recoger parametros de la petición
        var params = req.body;
    
        // validar los datos
        try {
            var validate_name       = !validator.isEmpty(params.name);
            var validate_surname    = !validator.isEmpty(params.surname);
            var validate_email      = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password   = !validator.isEmpty(params.password);
            
        } catch (error) {
            return res.status(400).send({
                message: "Faltan datos por enviar o datos incorrectos",
                params
            });
        }

        // console.log(validate_name, validate_surname, validate_email, validate_password);
    
        if (validate_name && validate_surname && validate_email && validate_password) {
            // crear el objeto de usuario
            var user = new User();
        
            // asignar valores al objeto usuario
            user.name       = params.name;
            user.surname    = params.surname;
            user.email      = params.email.toLowerCase();
            user.role       = 'ROLE_USER';
            user.image      = null;

            // comprobar si existe usuario
            User.findOne({email: user.email}, (err, issetUser) => {
                if (err) {
                    return res.status(500).send({
                        message: "Error al comprobar la duplicidad del usuario"
                    });
                }

                if (!issetUser) {
                    // si no existe cifrar contraseña
                    bcrypt.hash(params.password, null, null, (err, hash) => {
                        user.password = hash;

                        // guardarlo
                        user.save((err,userStored) => {
                            if (err) {
                                return res.status(500).send({
                                    message: "error al guardar el usuario",
                                });
                            } 

                            if (!userStored) {
                                return res.status(400).send({
                                    message: "El usuario no se ha guardado",
                                });
                            }

                            // devolver respuesta
                            return res.status(200).send({
                                status: 'success',
                                user: userStored});
                        }); // Close save
                    }); // Close bcrypt
                } else {
                    return res.status(500).send({
                        message: "El usuario ya está registrado"
                    });
                }
            });
        } else {
            return res.status(200).send({
                message: "La validación de datos del usuario son errados"
            });
        }
    },

    login: (req, res) => {
        // Recoger los parámetros de la petición
        var params = req.body;

        // Validar los datos
        try {
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        } catch (error) {
            return res.status(200).send({
                message: "Faltan datos por enviar",
                params
            });
        }

        if (!validate_email || !validate_password) {
            return res.status(200).send({
                message: 'Los datos son incorrectos, vuelve a intentarlo'
            });
        }

        // Buscar usuario que coincidan con el email
        User.findOne({email: params.email.toLowerCase()}, (err, user) => {

            if (err) {
                return res.status(500).send({
                    message: "error al intentar identificarse",
                });
            }

            if (!user) {
                return res.status(404).send({
                    message: "El usuario no existe",
                });
            }

            // Si lo encuentra, comprobar la contraseña (coincidencia de email y password)
            bcrypt.compare(params.password, user.password, (err, check) => {
                // Es correcto
                if (check) {
                    // Generar token de jwt y devolverlo
                    if (params.getToken) {
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    } else {
                        // Limpiar el objeto
                        user.password = undefined;
                        // devolver datos
                        return res.status(200).send({
                            status: "success",
                            user
                        });
                    }

                } else {
                    return res.status(200).send({
                        message: 'El usuario o la contraseña no son correctas',
                    });
                }
            });

        });
    },

    update: (req, res) => {
        // Recoger los datos del usuario
        const params = req.body;

        // Validar datos
        try {
            var validate_name       = !validator.isEmpty(params.name);
            var validate_surname    = !validator.isEmpty(params.surname);
            var validate_email      = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        } catch (err) {
            return res.status(200).send({
                message: "Faltan datos por enviar",
                params
            });
        }
        
        // Eliminar propiedades innecesarias
        delete params.password;

        // Comprobar usuario único
        var userId = req.user.sub;
        var userEmail = req.user.email;

        if (userEmail != params.email) {
            User.findOne({email: params.email.toLowerCase()}, (err, user) => {

                if (err) {
                    return res.status(500).send({
                        message: "error al intentar identificarse",
                    });
                }

                if(user && user.email === params.email) {
                    return res.status(200).send({
                        message: "No se puede modificar el email",
                    });
                } else {
                    // Buscar y actualizar
                    User.findOneAndUpdate({_id: userId}, params, {new: true}, (err, userUpdated) => {
                        if (err) {
                            return res.status(500).send({
                                status: 'error',
                                message: 'Error al actualizar el usuario'
                            });
                        }
                        
                        if (!userUpdated) {
                            return res.status(404).send({
                                status: 'error',
                                message: 'No se ha actualizado el usuario'
                            });
                        }
            
                        // Devolver respuesta
                        return res.status(200).send({
                            status: 'success',
                            user: userUpdated
                        });
                    });
                }
            });
        } else {
            // Buscar y actualizar documento
            User.findOneAndUpdate({_id: userId}, params, {new: true}, (err, userUpdated) => {
    
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar el usuario'
                    });
                }
                
                if (!userUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No se ha actualizado el usuario'
                    });
                }
    
                // Devolver respuesta
                return res.status(200).send({
                    status: 'success',
                    user: userUpdated
                });
            });
        }
    },

    uploadAvatar: (req, res) => {
        // Recoger el fichero de la petición
        var file_name = "avatar no subido...!"
        // console.log(req.files);
        
        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }
        
        if (req.files) {
            //conseguimos el nombre y extensión del archivo
            var file_path = req.files.file0.path; //toma los datos de la petición
            var file_split = file_path.split('\\'); //split convierte la ruta en un array, separando cada elemento desde \\

            /* Warning para linuz o mac
            file_split = file_path.split('/');
            */
            // Nombre del archivo
            var file_name = file_split[2]; //por método split, extrae el elemento 2 del array
            // extensión archivo
            var ext_split = file_name.split('\.'); //ahora vamos a convertir el nombre del archivo como un array, separando la extensión
            var file_ext = ext_split[1]; // Extraemos la extensión del archivo con split

            if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'gif' & file_ext != 'gif') {
                fs.unlink(file_path, (err) => {
                    return res.status(404).send({
                        status: 'error',
                        message: 'La extensión del archivo no es válida'
                    });
                });
            } else {
                // sacar el id del usuario autenticado
                var userId = req.user.sub;

                // buscar y actualizar el documento en la db
                User.findByIdAndUpdate({ _id: UserId }, { image: file_name }, { new: true }, (err, userUpdated) => {
                    if (err || !userUpdated) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al guardar datos en la DB'
                        });
                    }
                    // devolver respuesta
                    return res.status(200).send({
                        status: 'success',
                        message: 'Upload Avatar',
                        user: userUpdated
                    }); 
                });
            }
        }        
        // comprobar la extensión del archivo
        /* if (req.files) {
            var file_path = req.file.path;
            var file_split = file_path.split('\\');
            var file_name = file.split[2];
            var file_ext = ext.split[1];
            
            if (file_ext == 'png' || file_ext =='gif' || file_ext == 'jpg') {
                Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {
                    if (!albumUpdated) {
                        res.status(404).send({message: 'No se ha podido actualizar el album'});
                    } else {
                        res.status(200).send({album: albumUpdated});
                    }
                })
            } else {
                res.status(200).send({message: 'Extension del archivo no valida'});
            }
            console.log(file_path);
        } else {
            res.status(200).send({message: 'No has subido ninguna image..'});
        } */
    },

    avatar: (req, res) => {
        var fileName = req.params.fileName;
        var pathFile = './uploads/users/' + fileName;

        fs.exists(pathFile, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(pathFile));
            } else {
                return res.status(404).send({
                    message: 'La imagen no existe'
                });
            }
        });
    },

    getUsers: (req, res) => {
        User.find().exec((err, users) => {
            if (err || !users) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay usuarios para mostrar',
                });
            }

            return res.status(200).send({
                status: 'success',
                users
            });
        });
    },

    getUser: (req, res) => {
        var userId = req.params.userId;

        User.findById(userId).exec((err, user) => {
            if (err || !user) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el usuario',
                });
            }

            return res.status(200).send({
                status: 'success',
                user
            });
        });
    }
};

module.exports = controller;