const express = require('express');
const router = express.Router();
const upload = require('../../middleware/multer.config');
const { registerPublic } = require('./public.controller');

router.post('/register', upload.single('comprobante'), registerPublic);

module.exports = router;
