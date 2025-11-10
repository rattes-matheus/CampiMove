create table transports
(
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    model TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    contact TEXT NOT NULL,
    active TEXT NOT NULL
)