const express = require('express');
const router = express.Router();
const { confirmVerification } = require('./verify.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.put('/:participant_id', authMiddleware, confirmVerification);

module.exports = router;
