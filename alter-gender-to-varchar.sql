-- ALTER script to change gender field from ENUM to VARCHAR
-- This allows more flexible gender input for the automation system

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

-- Verification query (run this after the ALTER to check the change)
-- DESCRIBE patients;
-- SELECT DISTINCT gender FROM patients;

-- Note: This change allows any text input for gender while maintaining backward compatibility
-- Common values will still be 'M', 'F', but now supports any text input like 'm', 'f', 'Male', 'Female', etc. 