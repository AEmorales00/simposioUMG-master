const pool = require('../../db/pool');
const { checkInAndSendCertificate } = require('../certificate/checkin-certificate.service');

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
    console.log('El participante ya hizo check-in, pero se enviará el certificado nuevamente.');
    // Generar y enviar el certificado aunque ya haya hecho check-in
    await checkInAndSendCertificate(participant.id);
    return participant; // Retorna el participante sin actualizar el estado
  }

  // Actualiza el estado del participante a "checked_in"
  const updated = await pool.query(
    `UPDATE participants
     SET checked_in = true
     WHERE id = $1
     RETURNING *`,
    [participant.id]
  );

  // Generar y enviar el certificado
  await checkInAndSendCertificate(participant.id);

  return updated.rows[0];
};

module.exports = { checkInByQR };
