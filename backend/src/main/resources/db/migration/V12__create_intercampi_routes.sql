create table horarios_onibus(
    id SERIAL PRIMARY KEY,
    origem TEXT NOT NULL,
    horario TIME NOT NULL UNIQUE,
    ativo BOOLEAN
);