CREATE TABLE patients (
    id                 BIGSERIAL    PRIMARY KEY,
    uhid               VARCHAR(10)  NOT NULL UNIQUE,
    name               VARCHAR(255) NOT NULL,
    age                INTEGER      NOT NULL,
    gender             VARCHAR(20)  NOT NULL,
    encounter_id       VARCHAR(100) NOT NULL UNIQUE,
    department         VARCHAR(50)  NOT NULL,
    assigned_doctor_id BIGINT       NOT NULL,
    appointment_date   DATE         NOT NULL,
    status             VARCHAR(50)  NOT NULL DEFAULT 'ACTIVE',
    created_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);