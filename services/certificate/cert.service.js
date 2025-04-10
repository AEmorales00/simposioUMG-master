const pool = require('../../db/pool');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const { Readable } = require('stream');
const path = require('path');

const generatePDF = async (participantId) => {
  const result = await pool.query(`
    SELECT name, participant_type, qr_code_text
    FROM participants
    WHERE id = $1
  `, [participantId]);

  const participant = result.rows[0];
  if (!participant) throw new Error('Participante no encontrado');

  const { name, participant_type, qr_code_text } = participant;
  const qrData = qr_code_text || `INNOVA-${participantId}`;
  const qrImage = await QRCode.toDataURL(qrData);

  const doc = new PDFDocument({ size: 'A6', layout: 'landscape', margin: 20 });

  // 🎨 Estilo de borde
  doc.rect(10, 10, doc.page.width - 20, doc.page.height - 20).stroke('#0077B6');

  // Logo INNOVA (centrado arriba)
  const logoPath = path.join(__dirname, '../../assets/logo.png');
  doc.image(logoPath, doc.page.width / 2 - 50, 15, { width: 100 });

  // Título principal
  doc.moveDown(2);
  doc.fontSize(14).fillColor('#0077B6').text('', { align: 'center' });

  // Texto de datos
  doc.moveDown(4);
  doc.fontSize(12).fillColor('black');
  doc.text(`Nombre: ${name}`, { align: 'center' });
  doc.text(`Tipo: ${participant_type.replace(/_/g, ' ').toUpperCase()}`, { align: 'center' });
  doc.moveDown();

  // QR centrado
//  Dibuja el QR en una posición fija (centrado)
const qrX = doc.page.width / 2 - 40;
const qrY = doc.y;
doc.image(qrImage, qrX, qrY, { fit: [80, 80] });

// ⬇Espacio después del QR
const codeY = qrY + 90; // deja espacio exacto
doc.fontSize(10).text(`Código: ${qrData}`, doc.page.width / 2 - 50, codeY, {
  align: 'center',
  width: 100
});

  doc.end();
  return Readable.from(doc);
};

module.exports = { generatePDF };
