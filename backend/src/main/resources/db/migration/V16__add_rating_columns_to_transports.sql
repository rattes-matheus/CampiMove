ALTER TABLE transports
    ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0.0,
    ADD COLUMN total_ratings INTEGER DEFAULT 0;