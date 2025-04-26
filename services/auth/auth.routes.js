const express = require('express');
const router = express.Router();
const { register, login } = require('./auth.controller');

// ✅ ÚNICA importación correcta del middleware
const { authMiddleware, requireAdmin } = require('../../middleware/auth.middleware');

// Rutas
router.post('/register', authMiddleware, requireAdmin, register);
router.post('/login', login);

module.exports = router;
