const pool = require('../../db/pool');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const { sendEmail } = require('../../utils/email.service');
const { generatePDF } = require('../../services/certificate/cert.service');

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

  // 5. Crear la carpeta `certificates` si no existe
  const certificatesDir = path.join(__dirname, '../../certificates');
  if (!fs.existsSync(certificatesDir)) {
    fs.mkdirSync(certificatesDir, { recursive: true });
  }

  // 6. Generar el PDF del certificado y guardarlo
  const pdfPath = path.join(certificatesDir, `certificate-${participantId}.pdf`);
  const pdfStream = await generatePDF(participantId);
  const writeStream = fs.createWriteStream(pdfPath);

  await new Promise((resolve, reject) => {
    pdfStream.pipe(writeStream);
    pdfStream.on('end', resolve);
    pdfStream.on('error', reject);
  });

  // 7. Enviar correo electrónico con el PDF adjunto
  const emailContent = `
    <p>Hola ${participant.name},</p>
    <p>Tu registro ha sido confirmado exitosamente. Se adjunta tu certificado de participación.</p>
    <p>Por favor, guarda este correo para futuras referencias.</p>
  `;

  await sendEmail({
    to: participant.email,
    subject: 'Confirmación de Registro - INNOVA',
    html: emailContent,
    attachments: [
      {
        filename: `Certificado-${participantId}.pdf`,
        path: pdfPath, // Ruta al archivo PDF generado
        contentType: 'application/pdf'
      }
    ]
  });

  console.log('✅ Correo enviado correctamente con el PDF adjunto');
  return qrCode;
};

module.exports = { verifyParticipant };
