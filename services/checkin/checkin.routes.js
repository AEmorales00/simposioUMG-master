const express = require('express');
const router = express.Router();
const { processCheckIn } = require('./checkin.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.post('/', authMiddleware, processCheckIn);

module.exports = router;
