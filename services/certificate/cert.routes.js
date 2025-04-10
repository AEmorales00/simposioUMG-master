const express = require('express');
const router = express.Router();
const { generateParticipantPDF } = require('./cert.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.get('/:id/pdf', authMiddleware, generateParticipantPDF);

module.exports = router;
