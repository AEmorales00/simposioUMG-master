const express = require('express');
const path = require('path');
const router = express.Router();

const { getDashboardSummary, downloadDashboardExcel, exportParticipantsExcel, getParticipantsList } = require('./dashboard.controller');
const { authMiddleware } = require('../../middleware/auth.middleware');

router.get('/export', authMiddleware, downloadDashboardExcel);
router.get('/summary', authMiddleware, getDashboardSummary);
router.get('/participants/export', authMiddleware, exportParticipantsExcel);
router.get('/participants', authMiddleware, getParticipantsList);

router.get('/comprobante/:filename', authMiddleware, (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../../uploads', filename);

  console.log('Buscando archivo en:', filePath); // Depuración

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error al enviar el archivo:', err);
      res.status(404).send('Archivo no encontrado');
    }
  });
});

module.exports = router;
