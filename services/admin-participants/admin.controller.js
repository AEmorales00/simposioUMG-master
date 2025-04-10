const { createParticipantInternal } = require('./admin.service');

const registerPrivate = async (req, res) => {
  try {
    const userId = req.user.id; // Viene del middleware auth
    const fileUrl = req.file?.path;
    if (!fileUrl) return res.status(400).json({ error: 'Comprobante requerido' });

    const id = await createParticipantInternal(req.body, fileUrl, userId);
    res.json({ message: 'Registro privado exitoso', participant_id: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerPrivate };
