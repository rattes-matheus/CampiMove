-- Adiciona campos de motorista de volta na tabela users
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
    ADD COLUMN IF NOT EXISTS license_number VARCHAR(20),
    ADD COLUMN IF NOT EXISTS license_category VARCHAR(5),
    ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.0,
    ADD COLUMN IF NOT EXISTS age INTEGER;

-- Atualiza constraint check para incluir DRIVER
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('STUDENT', 'TEACHER', 'DRIVER', 'ADMIN'));

-- Adiciona coluna driver_id de volta na tabela buses
ALTER TABLE buses
    ADD COLUMN IF NOT EXISTS driver_id BIGINT,
    ADD CONSTRAINT fk_bus_driver FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE SET NULL;

-- Recria índice para driver
CREATE INDEX IF NOT EXISTS idx_buses_driver ON buses(driver_id);