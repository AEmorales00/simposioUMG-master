const pool = require('../../db/pool');

const insertParticipantOnly = async (data, userId) => {
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

  const result = await pool.query(
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

  return result.rows[0].id;
};

const insertPaymentWithUrl = async (participantId, payment_method, comprobante_url, userId) => {
  await pool.query(
    `INSERT INTO payments (participant_id, payment_method, comprobante_url, received_by)
     VALUES ($1, $2, $3, $4)`,
    [participantId, payment_method, comprobante_url, userId]
  );
};

const insertPaymentVerification = async (participantId, userId, username) => {
  await pool.query(
    `INSERT INTO payment_verifications (
      participant_id, previous_status, new_status, changed_by, comment
    ) VALUES ($1, $2, $3, $4, $5)`,
    [participantId, null, 'registrado', userId, `Participante registrado por ${username}`]
  );
};

module.exports = {
  insertParticipantOnly,
  insertPaymentWithUrl,
  insertPaymentVerification
};
