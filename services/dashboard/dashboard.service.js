const pool = require('../../db/pool');

const getSummary = async () => {
  const result = {};

  // Total de participantes
  const total = await pool.query('SELECT COUNT(*) FROM participants');
  result.total_participants = parseInt(total.rows[0].count);

  // Confirmados
  const confirmados = await pool.query(`SELECT COUNT(*) FROM participants WHERE status = 'Confirmado'`);
  result.confirmed = parseInt(confirmados.rows[0].count);

  // Pendientes
  const pendientes = await pool.query(`SELECT COUNT(*) FROM participants WHERE status = 'Pendiente'`);
  result.pending = parseInt(pendientes.rows[0].count);

  // Check-in hechos
  const checkins = await pool.query(`SELECT COUNT(*) FROM participants WHERE checked_in = true`);
  result.checked_in = parseInt(checkins.rows[0].count);

  // Total recaudado (simulado: supón que cada inscripción = Q50)
  const pagos = await pool.query(`SELECT COUNT(*) FROM payments`);
  result.total_collected = parseInt(pagos.rows[0].count) * 50;

  // Pagos por tipo
  const por_tipo = await pool.query(`
    SELECT payment_method, COUNT(*)::int AS total
    FROM payments
    GROUP BY payment_method
  `);
  result.payments_breakdown = por_tipo.rows;

  // Participantes con comprobantes
  const participantes = await pool.query(`
    SELECT id, name, email, comprobante
    FROM participants
  `);
  result.participants = participantes.rows;

  // Porcentaje de asistencia
  result.attendance_percent = result.confirmed > 0
    ? ((result.checked_in / result.confirmed) * 100).toFixed(1)
    : '0.0';

  return result;
};

const searchParticipants = async (query) => {
  try {
    const results = await pool.query(
      `
      SELECT id, name, carnet, email, phone, participant_type
      FROM participants
      WHERE LOWER(name) LIKE LOWER($1)
         OR LOWER(carnet) LIKE LOWER($1)
         OR LOWER(email) LIKE LOWER($1)
      `,
      [`%${query}%`] // Busca coincidencias parciales
    );

    return results.rows; // Devuelve los resultados como un array
  } catch (error) {
    console.error('Error al realizar la búsqueda:', error);
    throw new Error('Error al realizar la búsqueda');
  }
};

module.exports = { getSummary, searchParticipants };

const express = require('express');
const path = require('path');
const router = express.Router();

// Endpoint para obtener el comprobante de pago
router.get('/comprobante/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../../uploads', filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error al enviar el archivo:', err);
      res.status(404).send('Archivo no encontrado');
    }
  });
});

module.exports = { getSummary, searchParticipants };