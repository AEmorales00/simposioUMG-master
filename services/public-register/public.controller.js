const { createParticipant } = require('./public.service');

const registerPublic = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'Comprobante requerido' });

    const id = await createParticipant(req.body, file);
    res.json({ message: 'Registro exitoso', participant_id: id });
  } catch (error) {
    console.error('Error en registerPublic:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerPublic };
