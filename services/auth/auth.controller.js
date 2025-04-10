const { registerUser, loginUser } = require('./auth.service');

const register = async (req, res) => {
  const { username, password } = req.body;
  const user = await registerUser(username, password);
  res.json({ message: 'Usuario creado', user });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const result = await loginUser(username, password);
  if (!result) return res.status(401).json({ error: 'Credenciales inválidas' });
  res.json(result);
};

module.exports = { register, login };
