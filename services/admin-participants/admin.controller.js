const { createParticipantInternal } = require('./admin.service');

const registerPrivate = async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);
    console.log('USER:', req.user);

    const userId = req.user.id;
    const username = req.user.username;
    const fileUrl = req.file?.path;

    if (!fileUrl) return res.status(400).json({ error: 'Comprobante requerido' });

    const id = await createParticipantInternal(req.body, fileUrl, userId, username);

    res.json({ message: 'Registro privado exitoso', participant_id: id });
  } catch (err) {
    console.error('❌ ERROR en registerPrivate:', err); 
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerPrivate };
