create table routes(
    id SERIAL PRIMARY KEY,
    route TEXT NOT NULL,
    schedule TIME NOT NULL UNIQUE
);