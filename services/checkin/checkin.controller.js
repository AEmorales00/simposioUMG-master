const { checkInByQR } = require('./checkin.service');

const processCheckIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { qr_code } = req.body;

    const participant = await checkInByQR(qr_code, userId);
    res.json({
      message: 'Check-in exitoso',
      participant
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { processCheckIn };
