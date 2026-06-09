-- Sample patients — assigned_doctor_id matches user IDs from auth_db
INSERT INTO patients (uhid, name, age, gender, encounter_id, department, assigned_doctor_id, appointment_date, status) VALUES
  ('1000000001', 'Meena Verma',     34, 'FEMALE', 'ENC-2024-001', 'GENERAL',    1, '2024-06-01', 'ACTIVE'),
  ('1000000002', 'Suresh Gupta',    52, 'MALE',   'ENC-2024-002', 'GENERAL',    1, '2024-06-02', 'ACTIVE'),
  ('1000000003', 'Lalita Devi',     28, 'FEMALE', 'ENC-2024-003', 'GYNECOLOGY', 1, '2024-06-03', 'ACTIVE'),
  ('1000000004', 'Arjun Singh',     45, 'MALE',   'ENC-2024-004', 'GENERAL',    1, '2024-06-04', 'ACTIVE'),
  ('1000000005', 'Kavya Reddy',     31, 'FEMALE', 'ENC-2024-005', 'GYNECOLOGY', 1, '2024-06-05', 'ACTIVE'),
  ('1000000006', 'Ravi Teja',       60, 'MALE',   'ENC-2024-006', 'GENERAL',    1, '2024-06-06', 'ACTIVE'),
  ('1000000007', 'Sneha Iyer',      25, 'FEMALE', 'ENC-2024-007', 'GYNECOLOGY', 1, '2024-06-07', 'ACTIVE'),
  ('1000000008', 'Mohan Das',       48, 'MALE',   'ENC-2024-008', 'GENERAL',    1, '2024-06-08', 'ACTIVE'),
  ('1000000009', 'Pooja Nair',      38, 'FEMALE', 'ENC-2024-009', 'GYNECOLOGY', 1, '2024-06-09', 'ACTIVE'),
  ('1000000010', 'Vikram Rao',      55, 'MALE',   'ENC-2024-010', 'GENERAL',    1, '2024-06-10', 'ACTIVE'),
  ('1000000011', 'Ananya Bose',     22, 'FEMALE', 'ENC-2024-011', 'GYNECOLOGY', 2, '2024-06-11', 'ACTIVE'),
  ('1000000012', 'Deepak Joshi',    40, 'MALE',   'ENC-2024-012', 'GENERAL',    2, '2024-06-12', 'ACTIVE'),
  ('1000000013', 'Hema Malini',     35, 'FEMALE', 'ENC-2024-013', 'GYNECOLOGY', 3, '2024-06-13', 'ACTIVE'),
  ('1000000014', 'Ganesh Pillai',   50, 'MALE',   'ENC-2024-014', 'GENERAL',    3, '2024-06-14', 'ACTIVE'),
  ('1000000015', 'Saritha Menon',   29, 'FEMALE', 'ENC-2024-015', 'GYNECOLOGY', 3, '2024-06-15', 'ACTIVE');