-- Adicionar coluna phone se não existir
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Atualizar dados existentes se necessário
UPDATE users
SET phone = '(11) 99999-9999'
WHERE role = 'DRIVER' AND phone IS NULL;