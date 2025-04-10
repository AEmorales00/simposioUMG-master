const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado. Token no enviado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Esto te da acceso al ID y rol del usuario
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;
