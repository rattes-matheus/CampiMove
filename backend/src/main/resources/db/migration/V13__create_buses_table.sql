CREATE TABLE buses (
                       id SERIAL PRIMARY KEY,
                       plate VARCHAR(20) NOT NULL UNIQUE,
                       company VARCHAR(100) NOT NULL,
                       capacity INTEGER NOT NULL CHECK (capacity > 0),
                       model VARCHAR(100) NOT NULL,
                       year INTEGER NOT NULL CHECK (year >= 1990),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_buses_plate ON buses(plate);
CREATE INDEX idx_buses_active ON buses(active);