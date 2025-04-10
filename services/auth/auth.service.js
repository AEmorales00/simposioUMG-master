const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../db/pool');

const registerUser = async (username, password) => {
  const hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
    [username, hash, 'admin']
  );
  return result.rows[0];
};

const loginUser = async (username, password) => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  const user = result.rows[0];
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) return null;

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '8h'
  });

  return { token, user };
};

module.exports = { registerUser, loginUser };
