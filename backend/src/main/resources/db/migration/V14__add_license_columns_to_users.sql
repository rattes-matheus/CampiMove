ALTER TABLE users
    ADD COLUMN license_number VARCHAR(20),
    ADD COLUMN license_category VARCHAR(5);

-- Atualiza motoristas existentes com dados fictícios para demonstração
UPDATE users
SET license_number = 'CNH' || id,
    license_category = 'D'
WHERE role = 'DRIVER' AND license_number IS NULL;