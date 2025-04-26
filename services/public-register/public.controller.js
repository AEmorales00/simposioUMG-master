const { createParticipant } = require('./public.service');

const registerPublic = async (req, res) => {
  try {
    const fileUrl = req.file?.path;
    if (!fileUrl) return res.status(400).json({ error: 'Comprobante requerido' });

    const id = await createParticipant(req.body, fileUrl);
    res.json({ message: 'Registro exitoso', participant_id: id });
  } catch (error) {
    console.error('Error en registerPublic:', error); // 🔥 Agrega este log
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerPublic };
