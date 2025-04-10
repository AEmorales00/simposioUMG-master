const pool = require('../../db/pool');

const createParticipant = async (data, fileUrl) => {
  const {
    name,
    carnet,
    email,
    phone,
    birth_date,
    shirt_size,
    institution,
    participant_type,
  } = data;

  const participantRes = await pool.query(
    `INSERT INTO participants (
      name, carnet, email, phone, birth_date, shirt_size, institution, participant_type
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
    [name, carnet || null, email, phone, birth_date, shirt_size, institution || null, participant_type]
  );

  const participantId = participantRes.rows[0].id;

  await pool.query(
    'INSERT INTO payments (participant_id, payment_method, comprobante_url) VALUES ($1, $2, $3)',
    [participantId, 'boleta', fileUrl]
  );

  return participantId;
};

module.exports = { createParticipant };
