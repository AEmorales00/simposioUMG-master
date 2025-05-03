const fs = require('fs');
const path = require('path');
const pool = require('../../db/pool');

const createParticipant = async (data, file) => {
  const {
    name,
    carnet,
    email,
    phone,
    birth_date,
    shirt_size,
    institution,
    participant_type,
  } = data;

  // 1. Insertar participante en la base de datos
  const participantRes = await pool.query(
    `INSERT INTO participants (
      name, carnet, email, phone, birth_date, shirt_size, institution, participant_type
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
    [name, carnet || null, email, phone, birth_date, shirt_size, institution || null, participant_type]
  );

  const participantId = participantRes.rows[0].id;

  // 2. Renombrar el archivo de comprobante
  const ext = path.extname(file.originalname); // Obtener la extensión del archivo
  const finalName = `comprobante_${participantId}${ext}`;
  const finalPath = path.join('uploads', finalName);

  fs.renameSync(file.path, finalPath); // Renombrar el archivo

  // 3. Insertar el pago en la base de datos con la nueva ruta del comprobante
  await pool.query(
    'INSERT INTO payments (participant_id, payment_method, comprobante_url) VALUES ($1, $2, $3)',
    [participantId, 'boleta', finalPath]
  );

  return participantId;
};

module.exports = { createParticipant };
