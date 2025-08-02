-- Fix gender column constraint
-- Change from ENUM to VARCHAR to allow flexible gender input

-- Step 1: Add a temporary column with VARCHAR type
ALTER TABLE patients ADD COLUMN gender_temp VARCHAR(20);

-- Step 2: Copy existing data to the temporary column
UPDATE patients SET gender_temp = gender;

-- Step 3: Drop the original ENUM column
ALTER TABLE patients DROP COLUMN gender;

-- Step 4: Rename the temporary column to the original name
ALTER TABLE patients CHANGE COLUMN gender_temp gender VARCHAR(20) NOT NULL COMMENT 'Gender (flexible text input)';

-- Step 5: Add an index for better performance (optional)
ALTER TABLE patients ADD INDEX idx_patient_gender (gender);

-- Verification: Check the change worked
-- DESCRIBE patients;
-- SELECT DISTINCT gender FROM patients; 