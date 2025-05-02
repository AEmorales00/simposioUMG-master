const fs = require('fs');
const path = require('path');
const {
  insertParticipantOnly,
  insertPaymentWithUrl,
  insertPaymentVerification,
  deleteParticipantById
} = require('./admin.service');

const registerPrivate = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Comprobante requerido' });

    const { id: userId, username } = req.user;
    const ext = path.extname(req.file.originalname);
    const tempPath = req.file.path;

    // 1. Insertar participante
    const participantId = await insertParticipantOnly(req.body, userId);

    // 2. Renombrar archivo con ID del participante
    const finalName = `comprobante_${participantId}${ext}`;
    const finalPath = path.join('uploads', finalName);
    fs.renameSync(tempPath, finalPath);

    // 3. Insertar pago con ruta final
    await insertPaymentWithUrl(participantId, req.body.payment_method, finalPath, userId);

    // 4. Insertar verificación de pago
    await insertPaymentVerification(participantId, userId, username);

    res.json({ message: 'Registro privado exitoso', participant_id: participantId });
  } catch (err) {
    console.error('❌ ERROR en registerPrivate:', err);
    res.status(500).json({ error: err.message });
  }
};

const deleteParticipant = async (req, res) => {
  try {
    const participantId = parseInt(req.params.id, 10);
    if (isNaN(participantId)) return res.status(400).json({ error: 'ID inválido' });

    await deleteParticipantById(participantId);
    res.json({ message: 'Participante eliminado correctamente' });
  } catch (err) {
    console.error('❌ ERROR al eliminar participante:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  registerPrivate,
  deleteParticipant
};
