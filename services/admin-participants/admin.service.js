const pool = require('../../db/pool');

const createParticipantInternal = async (data, fileUrl, userId) => {
  const {
    name,
    carnet,
    email,
    phone,
    birth_date,
    shirt_size,
    institution,
    participant_type,
    payment_method
  } = data;

  if (!['boleta', 'efectivo'].includes(payment_method)) {
    throw new Error('Método de pago inválido');
  }

  const participantRes = await pool.query(
    `INSERT INTO participants (
      name, carnet, email, phone, birth_date, shirt_size,
      institution, participant_type, registered_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
    [
      name,
      carnet || null,
      email,
      phone,
      birth_date,
      shirt_size,
      institution || null,
      participant_type,
      userId
    ]
  );

  const participantId = participantRes.rows[0].id;

  await pool.query(
    `INSERT INTO payments (
      participant_id, payment_method, comprobante_url, received_by
    ) VALUES ($1, $2, $3, $4)`,
    [participantId, payment_method, fileUrl, userId]
  );

  return participantId;
};

module.exports = { createParticipantInternal };
