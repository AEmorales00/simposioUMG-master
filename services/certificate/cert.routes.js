const express = require('express');
const router = express.Router();
const { generateHTMLCertificate, generateParticipantPDF } = require('./cert.controller');
const { authMiddleware } = require('../../middleware/auth.middleware');


router.get('/:id/pdf', authMiddleware, generateParticipantPDF);
router.post('/certificado-html/:id', generateHTMLCertificate);

module.exports = router;
