const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado. Token no enviado.' });
  }

  const token = authHeader.split(' ')[1]; // Extrae el token después de "Bearer"
  console.log('Token recibido:', token); // Depuración

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica el token
    req.user = decoded; // Asigna el usuario decodificado a req.user
    console.log('Usuario decodificado:', req.user); // Depuración
    next();
  } catch (err) {
    console.error('Error al verificar el token:', err);
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

const processCheckIn = async (req, res) => {
  try {
    console.log('Usuario recibido en controlador:', req.user);
    console.log('Cuerpo de la solicitud:', req.body);

    const userId = req.user?.id; // Usa el operador opcional para evitar errores si req.user es undefined
    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autorizado' });
    }

    const { qr_code } = req.body;
    if (!qr_code) {
      return res.status(400).json({ error: 'El código QR es obligatorio' });
    }

    const participant = await checkInByQR(qr_code, userId);
    res.json({ message: 'Check-in exitoso', participant });
  } catch (err) {
    console.error('Error en el proceso de check-in:', err);
    res.status(400).json({ error: err.message });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Solo administradores.' });
  }
  next();
};

module.exports = {
  authMiddleware,
  requireAdmin,
  processCheckIn
};
