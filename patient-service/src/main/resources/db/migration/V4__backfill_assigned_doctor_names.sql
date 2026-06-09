-- Backfill assigned_doctor_name for sample patients seeded in V2.
-- Those rows received DEFAULT 'Unknown' when V3 added the column.
-- IDs 1-3 match the users inserted by auth-service V2__insert_sample_users.sql.
UPDATE patients SET assigned_doctor_name = 'Dr. Anita Sharma' WHERE assigned_doctor_id = 1 AND assigned_doctor_name = 'Unknown';
UPDATE patients SET assigned_doctor_name = 'Dr. Rajesh Kumar'  WHERE assigned_doctor_id = 2 AND assigned_doctor_name = 'Unknown';
UPDATE patients SET assigned_doctor_name = 'Dr. Priya Patel'   WHERE assigned_doctor_id = 3 AND assigned_doctor_name = 'Unknown';