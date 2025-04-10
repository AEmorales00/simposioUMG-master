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

  // Porcentaje de asistencia
  result.attendance_percent = result.confirmed > 0
    ? ((result.checked_in / result.confirmed) * 100).toFixed(1)
    : '0.0';

  return result;
};

module.exports = { getSummary };
