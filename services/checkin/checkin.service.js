const pool = require('../../db/pool');

const checkInByQR = async (qrCode, userId) => {
  // Busca al participante por el código QR
  const res = await pool.query(
    'SELECT * FROM participants WHERE qr_code_text = $1',
    [qrCode]
  );

  const participant = res.rows[0];

  // Validaciones
  if (!participant) throw new Error('QR no válido');
  if (participant.status !== 'Confirmado') throw new Error('Participante no confirmado');
  console.log('Estado de checked_in:', participant.checked_in);

  if (participant.checked_in) {
    console.log('El participante ya hizo check-in.');
    return participant; // Retorna el participante sin intentar generar el certificado
  }

  // Actualiza el estado del participante a "checked_in"
  const updated = await pool.query(
    `UPDATE participants
     SET checked_in = true
     WHERE id = $1
     RETURNING *`,
    [participant.id]
  );

  console.log('Check-in registrado para el participante:', updated.rows[0]);
  return updated.rows[0]; // Retorna el participante actualizado
};

module.exports = { checkInByQR };
