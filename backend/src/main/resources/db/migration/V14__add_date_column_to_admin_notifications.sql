ALTER TABLE admin_notifications
    ADD COLUMN created_at TIMESTAMP(0) NOT NULL DEFAULT date_trunc('minute', NOW())