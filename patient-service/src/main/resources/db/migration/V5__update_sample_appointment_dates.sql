-- Reseed appointment_date to relative dates so the date filter works regardless of when the app is run.
-- UHIDs 1000000001-1000000015 were inserted in V2 with hardcoded 2024 dates.
-- RIGHT(uhid, 2)::integer gives 01-15, so dates spread from today back 14 days.
UPDATE patients
SET appointment_date = CURRENT_DATE - (RIGHT(uhid, 2)::integer - 1)
WHERE uhid IN (
    '1000000001','1000000002','1000000003','1000000004','1000000005',
    '1000000006','1000000007','1000000008','1000000009','1000000010',
    '1000000011','1000000012','1000000013','1000000014','1000000015'
);