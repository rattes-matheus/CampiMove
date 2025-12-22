CREATE TABLE incidents (
    id BIGSERIAL PRIMARY KEY,

    title VARCHAR(255) NOT NULL,

    full_description TEXT NOT NULL,

    category VARCHAR(50),

    reporter_id BIGINT NOT NULL,

    created_at TIMESTAMP NOT NULL
);