const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'luismiguelchox@gmail.com', // ← Reemplaza con tu cuenta
    pass: 'zmeu rasl vyvg dqyl'       // ← Generada en Google
  }
});

/**
 * Envía un correo genérico.
 * @param {Object} options - Configuración del correo.
 * @param {string} options.to - Correo destinatario.
 * @param {string} options.subject - Asunto del correo.
 * @param {string} options.text - Cuerpo del correo en texto plano.
 * @param {string} options.html - Cuerpo del correo en formato HTML.
 * @param {Array} [options.attachments] - Adjuntos (opcional).
 * @returns {Promise<void>}
 */
const sendEmail = async ({ to, subject, text, html, attachments = [] }) => {
  if (!to || typeof to !== 'string' || !to.includes('@')) {
    throw new Error('Correo destinatario inválido');
  }

  const mailOptions = {
    from: '"Innova Simposio 2025" <luismiguelchox@gmail.com>',
    to,
    subject,
    text,
    html, // Asegúrate de pasar el campo `html` aquí
    attachments
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Correo enviado a ${to}`);
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
    throw error;
  }
};

module.exports = { sendEmail };
