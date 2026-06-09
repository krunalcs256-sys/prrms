CREATE TABLE referrals (
    id                   BIGSERIAL    PRIMARY KEY,
    source_doctor_id     BIGINT       NOT NULL,
    source_doctor_name   VARCHAR(255) NOT NULL,
    target_doctor_id     BIGINT       NOT NULL,
    target_doctor_name   VARCHAR(255) NOT NULL,
    patient_id           BIGINT       NOT NULL,
    patient_name         VARCHAR(255) NOT NULL,
    patient_uhid         VARCHAR(10)  NOT NULL,
    encounter_id         VARCHAR(100) NOT NULL,
    remarks              TEXT,
    priority             VARCHAR(20)  NOT NULL,
    status               VARCHAR(50)  NOT NULL DEFAULT 'PENDING_REVIEW',
    created_at           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id           BIGSERIAL    PRIMARY KEY,
    recipient_id BIGINT       NOT NULL,
    message      TEXT         NOT NULL,
    referral_id  BIGINT       REFERENCES referrals(id),
    is_read      BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id             BIGSERIAL    PRIMARY KEY,
    action         VARCHAR(100) NOT NULL,
    performed_by   BIGINT       NOT NULL,
    target_entity  VARCHAR(100),
    target_id      BIGINT,
    details        TEXT,
    created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_referrals_source_doctor ON referrals(source_doctor_id);
CREATE INDEX idx_referrals_target_doctor ON referrals(target_doctor_id);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);