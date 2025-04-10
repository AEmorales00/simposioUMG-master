const pool = require('../../db/pool');

const checkInByQR = async (qrCode, userId) => {
const res = await pool.query(
    'SELECT * FROM participants WHERE qr_code_text = $1',
    [qrCode]
  );
  
  const participant = res.rows[0];

  const updated = await pool.query(
    `UPDATE participants
     SET checked_in = true
     WHERE id = $1
     RETURNING *`,
    [participant.id]
  );
  
  return updated.rows[0];

  if (!participant) throw new Error('QR no válido');
  if (participant.status !== 'Confirmado') throw new Error('Participante no confirmado');
  if (participant.checked_in) throw new Error('Participante ya hizo check-in');

  await pool.query(
    `UPDATE participants SET checked_in = true WHERE id = $1`,
    [participant.id]
  );

  return participant;
};

module.exports = { checkInByQR };
