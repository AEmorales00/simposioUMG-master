const express = require('express');
const router = express.Router();
const { register, login } = require('./auth.controller');

router.post('/register', register); // Solo para crear admin al inicio
router.post('/login', login);

module.exports = router;
