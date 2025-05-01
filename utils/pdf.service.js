const PDFDocument = require('pdfkit');
const fs = require('fs');

/**
 * Genera un PDF con los datos del participante y el QR.
 * @param {string} filePath - Ruta donde se guardará el PDF.
 * @param {Object} participant - Datos del participante.
 * @param {string} qrCode - QR en formato base64.
 * @returns {Promise<void>}
 */
const generatePDF = async (filePath, participant, qrCode) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // Título del certificado
    doc.fontSize(20).text('Certificado de Participación', { align: 'center' });
    doc.moveDown();

    // Información del participante
    doc.fontSize(16).text(`Nombre: ${participant.name}`);
    doc.text(`Correo: ${participant.email}`);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    // Incluir el QR en el PDF
    doc.text('Código QR:', { align: 'left' });
    doc.image(qrCode, {
      fit: [150, 150],
      align: 'center',
      valign: 'center'
    });

    doc.end();

    stream.on('finish', () => resolve());
    stream.on('error', (err) => reject(err));
  });
};

module.exports = { generatePDF };