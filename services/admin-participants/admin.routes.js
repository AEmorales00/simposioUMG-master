const express = require('express');
const router = express.Router();
const { registerPrivate } = require('./admin.controller');
const upload = require('../../middleware/multer.config');
const authMiddleware = require('../../middleware/auth.middleware');

router.post('/register', authMiddleware, upload.single('comprobante'), registerPrivate);

module.exports = router;
