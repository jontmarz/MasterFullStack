'use strict'

const express = require('express');
const commentController = require('../controllers/comment');

const router = express.Router();
const md_auth = require('../middlewares/auth');

router.post('/comment/topic/:topicId', md_auth.auth, commentController.add);
router.put('/comment/:commentId', md_auth.auth, commentController.update);
router.delete('/comment/:topicId/:commentId', md_auth.auth, commentController.delete);

module.exports = router;