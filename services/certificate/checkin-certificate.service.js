
const pool = require('../../db/pool');
const { generateFancyCertificate } = require('./htmlCertificate.service');
const { sendEmail } = require('../../utils/email.service');

/**
 * Marca el check-in de un participante y envía automáticamente su certificado por correo.
 * @param {number} participantId - ID del participante.
 * @returns {Promise<void>}
 */
const checkInAndSendCertificate = async (participantId) => {
  // 1. Verificar si existe y está confirmado
  const res = await pool.query('SELECT * FROM participants WHERE id = $1', [participantId]);
  const participant = res.rows[0];

  if (!participant) throw new Error('Participante no encontrado');
  if (participant.status !== 'Confirmado') throw new Error('El participante no ha sido confirmado');
  if (participant.checked_in === true) throw new Error('El participante ya fue registrado como presente');

  // 2. Marcar asistencia (check-in)
  await pool.query('UPDATE participants SET checked_in = true WHERE id = $1', [participantId]);

  // 3. Generar el certificado PDF
  const pdfPath = await generateFancyCertificate(participant.name, participant.id);

  // 4. Enviar por correo
  const emailContent = `
    <p>Hola ${participant.name},</p>
    <p>¡Gracias por asistir al evento INNOVA!</p>
    <p>Adjunto encontrarás tu certificado de participación.</p>
  `;

  await sendEmail({
    to: participant.email,
    subject: 'Certificado de Participación - INNOVA',
    html: emailContent,
    attachments: [
      {
        filename: `Certificado-${participant.id}.pdf`,
        path: pdfPath,
        contentType: 'application/pdf'
      }
    ]
  });

  console.log('✅ Certificado enviado a:', participant.email);
};

module.exports = { checkInAndSendCertificate };
