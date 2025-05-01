const express = require('express');
const path = require('path');
const router = express.Router();

const { getDashboardSummary, downloadDashboardExcel, exportParticipantsExcel, getParticipantsList } = require('./dashboard.controller');
const { searchParticipants } = require('./dashboard.service');
const { authMiddleware } = require('../../middleware/auth.middleware');
const pool = require('../../db/pool'); // Assuming pool is defined in db.js


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

router.get('/search', authMiddleware, async (req, res) => {
  const { query } = req.query; // Obtén el parámetro de búsqueda de la URL

  if (!query) {
    return res.status(400).send('El parámetro de búsqueda es obligatorio');
  }

  try {
    const results = await searchParticipants(query); // Llama al método de búsqueda
    res.json(results); // Devuelve los resultados como JSON
  } catch (error) {
    console.error('Error en el endpoint de búsqueda:', error);
    res.status(500).send('Error al realizar la búsqueda');
  }
});

module.exports = router;
