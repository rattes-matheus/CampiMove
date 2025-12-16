ALTER TABLE admin_notifications
    ADD COLUMN target TEXT NOT NULL DEFAULT 'ALL';
