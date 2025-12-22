ALTER TABLE admin_notifications
    ADD COLUMN programmed_time INT NOT NULL DEFAULT 60,
    ADD COLUMN defined_time TIMESTAMP(0) NOT NULL DEFAULT (NOW() + interval '60 minutes');