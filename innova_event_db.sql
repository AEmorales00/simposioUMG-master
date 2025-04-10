
-- Crear base de datos
-- CREATE DATABASE innova_event;

-- Conectarse a la base de datos (si estás en psql usa: \c innova_event)

-- Tabla de usuarios
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Participantes registrados
CREATE TABLE participants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  carnet VARCHAR(30),
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  birth_date DATE,
  shirt_size VARCHAR(5) CHECK (shirt_size IN ('S', 'M', 'L', 'XL')),
  institution VARCHAR(100),
  participant_type VARCHAR(20) NOT NULL CHECK (participant_type IN ('estudiante_umg', 'catedratico_umg', 'externo')),
  registered_by INT REFERENCES users(id),
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'Confirmado')),
  checkin_qr TEXT,
  checked_in BOOLEAN DEFAULT FALSE
);

-- Pagos y comprobantes
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  participant_id INT REFERENCES participants(id),
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('boleta', 'efectivo')),
  comprobante_url TEXT NOT NULL,
  received_by INT REFERENCES users(id),
  received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Historial de verificaciones
CREATE TABLE payment_verifications (
  id SERIAL PRIMARY KEY,
  participant_id INT REFERENCES participants(id),
  previous_status VARCHAR(20),
  new_status VARCHAR(20),
  changed_by INT REFERENCES users(id),
  comment TEXT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
