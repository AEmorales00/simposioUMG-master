const pool = require('../../db/pool');

const createParticipantInternal = async (data, fileUrl, userId, username) => {
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

  if (!['estudiante_umg', 'catedratico_umg', 'externo'].includes(participant_type)) {
    throw new Error('Tipo de participante inválido');
  }

  // 1. Registrar participante
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

  // 2. Registrar pago
  await pool.query(
    `INSERT INTO payments (
      participant_id, payment_method, comprobante_url, received_by
    ) VALUES ($1, $2, $3, $4)`,
    [participantId, payment_method, fileUrl, userId]
  );

  // 3. Registrar verificación inicial del estado del pago
  await pool.query(
    `INSERT INTO payment_verifications (
      participant_id, previous_status, new_status, changed_by, comment
    ) VALUES ($1, $2, $3, $4, $5)`,
    [
      participantId,
      null, // porque es un nuevo registro
      'registrado', // o 'pendiente', según el estado inicial
      userId,
      `Participante registrado por ${username}`
    ]
  );

  return participantId;
};

module.exports = { createParticipantInternal };
