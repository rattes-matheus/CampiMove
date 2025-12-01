DROP TABLE intercampi_routes;

CREATE TABLE routes (
                        id SERIAL PRIMARY KEY,
                        route VARCHAR(255) NOT NULL,
                        schedule TIME NOT NULL
);
