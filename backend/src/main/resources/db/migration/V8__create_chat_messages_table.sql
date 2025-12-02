CREATE TABLE chat_messages (
    id BIGSERIAL PRIMARY KEY,

    room_id VARCHAR(255) NOT NULL,

    sender_id VARCHAR(255) NOT NULL,

    sender_name VARCHAR(255),

    recipient_id VARCHAR(255) NOT NULL,

    text TEXT,

    timestamp TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_chat_messages_room_timestamp
    ON chat_messages (room_id, timestamp);