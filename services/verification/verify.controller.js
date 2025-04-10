const { verifyParticipant } = require('./verify.service');

const confirmVerification = async (req, res) => {
  try {
    const participantId = req.params.participant_id;
    const userId = req.user.id;
    const { comment } = req.body;

    const qrCode = await verifyParticipant(participantId, userId, comment || null);
    res.json({
      message: 'Participante confirmado',
      qr_code: qrCode
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { confirmVerification };
