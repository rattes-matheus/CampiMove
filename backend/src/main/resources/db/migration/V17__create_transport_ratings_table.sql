CREATE TABLE transport_ratings (
                                   id BIGSERIAL PRIMARY KEY,
                                   transport_id BIGINT NOT NULL,
                                   user_id BIGINT NOT NULL,
                                   rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
                                   review TEXT,
                                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                   UNIQUE(transport_id, user_id),
                                   FOREIGN KEY (transport_id) REFERENCES transports(id) ON DELETE CASCADE,
                                   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);