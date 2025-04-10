const pool = require('../../db/pool');
const QRCode = require('qrcode');

const verifyParticipant = async (participantId, userId, comment) => {
  // 1. Verificar que exista y esté pendiente
  const res = await pool.query('SELECT * FROM participants WHERE id = $1', [participantId]);
  const participant = res.rows[0];
  if (!participant) throw new Error('Participante no encontrado');
  if (participant.status !== 'Pendiente') throw new Error('Ya fue confirmado');

  // 2. Generar QR (base64)
  const qrData = `INNOVA-${participantId}`;
  const qrCode = await QRCode.toDataURL(qrData);

  // 3. Actualizar estado y guardar QR
  await pool.query(`
    UPDATE participants
    SET status = 'Confirmado', checkin_qr = $1, qr_code_text = $2
    WHERE id = $3
  `, [qrCode, qrData, participantId]);

  // 4. Registrar historial de verificación
  await pool.query(`
    INSERT INTO payment_verifications (
      participant_id, previous_status, new_status, changed_by, comment
    ) VALUES ($1, $2, $3, $4, $5)
  `, [participantId, 'Pendiente', 'Confirmado', userId, comment]);

  return qrCode;
};

module.exports = { verifyParticipant };
