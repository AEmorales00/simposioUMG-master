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

module.exports = { generateParticipantPDF };
