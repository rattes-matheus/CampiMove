CREATE TABLE forgot_passwords (
    id serial primary key,
    email varchar(255) not null,
    token varchar(255) not null unique,
    expires_at timestamp not null
);
