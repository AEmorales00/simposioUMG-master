const pool = require('../../db/pool');

const getSummary = async () => {
  const result = {};

  // 1. 👥 Total de participantes registrados
  const totalParticipants = await pool.query('SELECT COUNT(*) FROM participants');
  result.total_participants = parseInt(totalParticipants.rows[0].count);

  // 2. 🎓 Participantes por tipo
  const participantsByType = await pool.query(`
    SELECT participant_type, COUNT(*)::int AS total
    FROM participants
    GROUP BY participant_type
  `);
  result.participants_by_type = participantsByType.rows;

  // 3. 💳 Participantes que han pagado
  const participantsPaid = await pool.query(`
    SELECT COUNT(DISTINCT participant_id) AS total
    FROM payments
  `);
  result.participants_paid = parseInt(participantsPaid.rows[0].total);

  // 4. ⏱ Pagos sin verificar
  const unverifiedPayments = await pool.query(`
    SELECT COUNT(*) AS total
    FROM payments p
    LEFT JOIN payment_verifications pv ON p.participant_id = pv.participant_id
    WHERE pv.participant_id IS NULL
  `);
  result.unverified_payments = parseInt(unverifiedPayments.rows[0].total);

  // 5. 📍 Participantes con check-in realizado
  const participantsCheckedIn = await pool.query(`
    SELECT COUNT(*) AS total
    FROM participants
    WHERE checked_in = true
  `);
  result.participants_checked_in = parseInt(participantsCheckedIn.rows[0].total);

  // 6. ❌ Pagaron pero no asistieron
  const paidButNotCheckedIn = await pool.query(`
    SELECT COUNT(*) AS total
    FROM participants p
    INNER JOIN payments pay ON p.id = pay.participant_id
    WHERE p.checked_in = false
  `);
  result.paid_but_not_checked_in = parseInt(paidButNotCheckedIn.rows[0].total);

  // 7. 👤 Participantes registrados por usuario
  const participantsByUser = await pool.query(`
    SELECT u.username, COUNT(p.id)::int AS total
    FROM participants p
    INNER JOIN users u ON p.registered_by = u.id
    GROUP BY u.username
  `);
  result.participants_by_user = participantsByUser.rows;

  // 8. 💵 Pagos por método
  const paymentsByMethod = await pool.query(`
    SELECT payment_method, COUNT(*)::int AS total
    FROM payments
    GROUP BY payment_method
  `);
  result.payments_by_method = paymentsByMethod.rows;

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