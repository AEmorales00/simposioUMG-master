const pool = require('../../db/pool');
const { generateFancyCertificate } = require('./htmlCertificate.service');
const { generatePDF } = require('./cert.service');

const generateParticipantPDF = async (req, res) => {
  try {
    const id = req.params.id;

    const pdfStream = await generatePDF(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=credencial_innova_${id}.pdf`);
    pdfStream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar la credencial PDF' });
  }
};

const generateHTMLCertificate = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT name FROM participants WHERE id = $1', [id]);
  const participant = result.rows[0];

  if (!participant) return res.status(404).json({ error: 'Participante no encontrado' });

  const pdfPath = await generateFancyCertificate(participant.name, id);
  res.download(pdfPath);
};

module.exports = {
  generateHTMLCertificate,
  generateParticipantPDF
};
