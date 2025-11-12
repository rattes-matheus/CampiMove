create table reports
(
    id SERIAL PRIMARY KEY,
    userid BIGINT NOT NULL,
    report_text TEXT NOT NULL
)