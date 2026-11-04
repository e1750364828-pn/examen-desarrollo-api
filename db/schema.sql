-- Estructura de la tabla de socios (opcion A: PostgreSQL con pg).
-- Ejecutar en la base de desarrollo y en la de pruebas:
--   psql -U postgres -d library_dev -f db/schema.sql
--   psql -U postgres -d library_test -f db/schema.sql

CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  membership_type TEXT NOT NULL CHECK (membership_type IN ('estudiante', 'docente', 'externo')),
  active BOOLEAN NOT NULL DEFAULT TRUE
);
