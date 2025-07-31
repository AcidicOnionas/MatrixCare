-- ===================================
-- MATRIXCARE DATABASE SCHEMA
-- Complete database structure for nursing care management
-- ===================================

-- ===================================
-- USER MANAGEMENT TABLES
-- ===================================

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    hospital VARCHAR(255),
    specialty VARCHAR(100),
    license_number VARCHAR(50),
    role ENUM('ADMIN', 'DOCTOR', 'NURSE', 'STAFF') NOT NULL DEFAULT 'NURSE',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Nurses table (extended user information for nurses)
CREATE TABLE nurses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'Nurse ID',
    employee_id VARCHAR(20) UNIQUE NOT NULL COMMENT 'Employee/Badge ID',
    username VARCHAR(50) NOT NULL COMMENT 'Login username',
    password VARCHAR(255) NOT NULL COMMENT 'Encrypted password', 
    email VARCHAR(255) NOT NULL COMMENT 'Email address',
    first_name VARCHAR(100) NOT NULL COMMENT 'First name',
    last_name VARCHAR(100) NOT NULL COMMENT 'Last name',
    license_number VARCHAR(50) COMMENT 'Nursing license number',
    specialty VARCHAR(100) COMMENT 'Nursing specialty (e.g., ICU, Med-Surg, etc.)',
    shift ENUM('day', 'night', 'swing') COMMENT 'Primary shift',
    phone VARCHAR(20) COMMENT 'Phone number',
    hire_date DATE COMMENT 'Date of hire',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Active status',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Created timestamp',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated timestamp',
    UNIQUE KEY uk_nurse_email (email),
    UNIQUE KEY uk_nurse_employee_id (employee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Nurses table';

-- ===================================
-- PATIENT MANAGEMENT TABLES
-- ===================================

CREATE TABLE patients (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'Patient ID',
    medical_record_number VARCHAR(20) UNIQUE NOT NULL COMMENT 'MRN',
    first_name VARCHAR(100) NOT NULL COMMENT 'First name',
    last_name VARCHAR(100) NOT NULL COMMENT 'Last name',
    date_of_birth DATE NOT NULL COMMENT 'Date of birth',
    gender VARCHAR(20) NOT NULL COMMENT 'Gender (flexible text input)',
    room_number VARCHAR(10) COMMENT 'Current room number',
    bed_number VARCHAR(5) COMMENT 'Bed identifier (A, B, etc.)',
    admission_date DATETIME COMMENT 'Admission date and time',
    discharge_date DATETIME NULL COMMENT 'Discharge date and time',
    primary_physician VARCHAR(100) COMMENT 'Primary attending physician',
    emergency_contact_name VARCHAR(100) COMMENT 'Emergency contact name',
    emergency_contact_phone VARCHAR(20) COMMENT 'Emergency contact phone',
    insurance_info TEXT COMMENT 'Insurance information',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Active patient status',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Created timestamp',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated timestamp',
    INDEX idx_patient_room (room_number),
    INDEX idx_patient_mrn (medical_record_number),
    INDEX idx_patient_gender (gender)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Patients table';

-- ===================================
-- MEDICAL INFORMATION TABLES
-- ===================================

CREATE TABLE patient_allergies (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'Allergy ID',
    patient_id BIGINT NOT NULL COMMENT 'Patient ID',
    allergen VARCHAR(100) NOT NULL COMMENT 'Allergen name',
    reaction TEXT COMMENT 'Type of reaction',
    severity ENUM('mild', 'moderate', 'severe', 'life-threatening') COMMENT 'Severity level',
    notes TEXT COMMENT 'Additional notes',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Created timestamp',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated timestamp',
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    INDEX idx_allergy_patient (patient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Patient allergies';

CREATE TABLE patient_diagnoses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'Diagnosis ID',
    patient_id BIGINT NOT NULL COMMENT 'Patient ID',
    diagnosis_code VARCHAR(20) COMMENT 'ICD-10 code',
    diagnosis_description TEXT NOT NULL COMMENT 'Diagnosis description',
    diagnosis_type ENUM('primary', 'secondary', 'working') DEFAULT 'secondary' COMMENT 'Type of diagnosis',
    diagnosed_date DATE COMMENT 'Date of diagnosis',
    resolved_date DATE NULL COMMENT 'Date resolved (if applicable)',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Active diagnosis',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Created timestamp',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated timestamp',
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    INDEX idx_diagnosis_patient (patient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Patient diagnoses';

CREATE TABLE medications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'Medication ID',
    patient_id BIGINT NOT NULL COMMENT 'Patient ID',
    medication_name VARCHAR(200) NOT NULL COMMENT 'Medication name',
    dosage VARCHAR(50) NOT NULL COMMENT 'Dosage amount',
    route ENUM('PO', 'IV', 'IM', 'SQ', 'topical', 'inhaled', 'rectal', 'other') NOT NULL COMMENT 'Route of administration',
    frequency VARCHAR(50) NOT NULL COMMENT 'Frequency (e.g., BID, TID, QID, PRN)',
    start_date DATETIME NOT NULL COMMENT 'Start date and time',
    end_date DATETIME NULL COMMENT 'End date and time',
    prescribing_physician VARCHAR(100) COMMENT 'Prescribing physician',
    special_instructions TEXT COMMENT 'Special administration instructions',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Active medication',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Created timestamp',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated timestamp',
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    INDEX idx_medication_patient (patient_id),
    INDEX idx_medication_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Patient medications';

-- ===================================
-- NURSING DOCUMENTATION TABLES
-- ===================================

CREATE TABLE nursing_assessments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'Assessment ID',
    patient_id BIGINT NOT NULL COMMENT 'Patient ID',
    nurse_id BIGINT NOT NULL COMMENT 'Nurse ID',
    assessment_date DATETIME NOT NULL COMMENT 'Assessment date and time',
    shift ENUM('day', 'night', 'swing') NOT NULL COMMENT 'Shift during assessment',
    general_condition ENUM('stable', 'improving', 'declining', 'critical') COMMENT 'General condition',
    pain_level TINYINT COMMENT 'Pain level (0-10 scale)',
    mobility_status ENUM('independent', 'assistance', 'bedbound', 'wheelchair') COMMENT 'Mobility status',
    mental_status ENUM('alert', 'confused', 'lethargic', 'unresponsive') COMMENT 'Mental status',
    skin_integrity TEXT COMMENT 'Skin assessment notes',
    respiratory_notes TEXT COMMENT 'Respiratory assessment',
    cardiovascular_notes TEXT COMMENT 'Cardiovascular assessment',
    gastrointestinal_notes TEXT COMMENT 'GI assessment',
    genitourinary_notes TEXT COMMENT 'GU assessment',
    neurological_notes TEXT COMMENT 'Neurological assessment',
    additional_notes TEXT COMMENT 'Additional assessment notes',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Created timestamp',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated timestamp',
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (nurse_id) REFERENCES nurses(id),
    INDEX idx_assessment_patient (patient_id),
    INDEX idx_assessment_date (assessment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Nursing assessments';

-- Vital signs table (updated structure for the application)
CREATE TABLE IF NOT EXISTS vital_signs_entries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    user_id BIGINT,
    user_name VARCHAR(255),
    blood_pressure_systolic INT,
    blood_pressure_diastolic INT,
    temperature DECIMAL(4,1),
    temperature_unit VARCHAR(1) DEFAULT 'F',
    pulse INT,
    respiration INT,
    oxygen_saturation INT,
    pain_level INT,
    notes TEXT,
    recorded_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for vital signs
CREATE INDEX idx_vital_signs_patient_id ON vital_signs_entries(patient_id);
CREATE INDEX idx_vital_signs_recorded_at ON vital_signs_entries(patient_id, recorded_at DESC);
CREATE INDEX idx_vital_signs_user_id ON vital_signs_entries(user_id);

-- Legacy vital signs table (for compatibility)
CREATE TABLE vital_signs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'Vital signs ID',
    patient_id BIGINT NOT NULL COMMENT 'Patient ID',
    nurse_id BIGINT NOT NULL COMMENT 'Nurse ID',
    recorded_at DATETIME NOT NULL COMMENT 'Time recorded',
    temperature DECIMAL(4,1) COMMENT 'Temperature in Fahrenheit',
    systolic_bp INT COMMENT 'Systolic blood pressure',
    diastolic_bp INT COMMENT 'Diastolic blood pressure',
    heart_rate INT COMMENT 'Heart rate (BPM)',
    respiratory_rate INT COMMENT 'Respiratory rate',
    oxygen_saturation INT COMMENT 'O2 saturation percentage',
    blood_glucose INT COMMENT 'Blood glucose level',
    weight DECIMAL(5,2) COMMENT 'Weight in pounds',
    height DECIMAL(5,2) COMMENT 'Height in inches',
    bmi DECIMAL(4,1) COMMENT 'Body Mass Index',
    notes TEXT COMMENT 'Additional notes',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Created timestamp',
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (nurse_id) REFERENCES nurses(id),
    INDEX idx_vitals_patient (patient_id),
    INDEX idx_vitals_recorded (recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Vital signs records';

CREATE TABLE medication_administration (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'Administration record ID',
    medication_id BIGINT NOT NULL COMMENT 'Medication ID',
    patient_id BIGINT NOT NULL COMMENT 'Patient ID',
    nurse_id BIGINT NOT NULL COMMENT 'Administering nurse ID',
    scheduled_time DATETIME NOT NULL COMMENT 'Scheduled administration time',
    actual_time DATETIME COMMENT 'Actual administration time',
    status ENUM('given', 'refused', 'held', 'missed', 'not_available') NOT NULL COMMENT 'Administration status',
    dosage_given VARCHAR(50) COMMENT 'Actual dosage given',
    route_used VARCHAR(20) COMMENT 'Route used',
    reason_not_given TEXT COMMENT 'Reason if not given',
    patient_response TEXT COMMENT 'Patient response to medication',
    side_effects TEXT COMMENT 'Any side effects noted',
    notes TEXT COMMENT 'Additional notes',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Created timestamp',
    FOREIGN KEY (medication_id) REFERENCES medications(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (nurse_id) REFERENCES nurses(id),
    INDEX idx_med_admin_patient (patient_id),
    INDEX idx_med_admin_scheduled (scheduled_time),
    INDEX idx_med_admin_nurse (nurse_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Medication administration records';

-- ===================================
-- CHARTING DATA TABLE
-- ===================================

CREATE TABLE IF NOT EXISTS patient_charting_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    category_title VARCHAR(255) NOT NULL,
    category_icon VARCHAR(50),
    category_color VARCHAR(50),
    item_data TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Create indexes for charting data
CREATE INDEX idx_patient_charting_patient_id ON patient_charting_data(patient_id);
CREATE INDEX idx_patient_charting_display_order ON patient_charting_data(patient_id, display_order);

-- ===================================
-- CARE PLANNING TABLES
-- ===================================

CREATE TABLE nursing_care_plans (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'Care plan ID',
    patient_id BIGINT NOT NULL COMMENT 'Patient ID',
    nurse_id BIGINT NOT NULL COMMENT 'Creating nurse ID',
    nursing_diagnosis TEXT NOT NULL COMMENT 'Nursing diagnosis',
    goals TEXT NOT NULL COMMENT 'Patient goals',
    interventions TEXT NOT NULL COMMENT 'Nursing interventions',
    expected_outcomes TEXT COMMENT 'Expected outcomes',
    priority_level ENUM('high', 'medium', 'low') DEFAULT 'medium' COMMENT 'Priority level',
    start_date DATE NOT NULL COMMENT 'Start date',
    target_date DATE COMMENT 'Target completion date',
    status ENUM('active', 'met', 'partially_met', 'not_met', 'discontinued') DEFAULT 'active' COMMENT 'Status',
    evaluation_notes TEXT COMMENT 'Evaluation notes',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Created timestamp',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated timestamp',
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (nurse_id) REFERENCES nurses(id),
    INDEX idx_care_plan_patient (patient_id),
    INDEX idx_care_plan_priority (priority_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Nursing care plans';

-- ===================================
-- INCIDENT REPORTING TABLES
-- ===================================

CREATE TABLE incident_reports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'Incident ID',
    patient_id BIGINT COMMENT 'Patient ID (if patient-related)',
    reporting_nurse_id BIGINT NOT NULL COMMENT 'Reporting nurse ID',
    incident_date DATETIME NOT NULL COMMENT 'Date and time of incident',
    incident_type ENUM('fall', 'medication_error', 'equipment_failure', 'patient_injury', 'near_miss', 'other') NOT NULL COMMENT 'Type of incident',
    severity ENUM('minor', 'moderate', 'major', 'critical') NOT NULL COMMENT 'Severity level',
    location VARCHAR(100) COMMENT 'Location where incident occurred',
    description TEXT NOT NULL COMMENT 'Detailed description',
    immediate_actions TEXT COMMENT 'Immediate actions taken',
    physician_notified BOOLEAN DEFAULT FALSE COMMENT 'Was physician notified',
    family_notified BOOLEAN DEFAULT FALSE COMMENT 'Was family notified',
    follow_up_required BOOLEAN DEFAULT FALSE COMMENT 'Follow-up required',
    status ENUM('open', 'under_review', 'closed') DEFAULT 'open' COMMENT 'Report status',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Created timestamp',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated timestamp',
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL,
    FOREIGN KEY (reporting_nurse_id) REFERENCES nurses(id),
    INDEX idx_incident_patient (patient_id),
    INDEX idx_incident_date (incident_date),
    INDEX idx_incident_type (incident_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Incident reports';

-- ===================================
-- SHIFT MANAGEMENT TABLES
-- ===================================

CREATE TABLE nurse_assignments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'Assignment ID',
    nurse_id BIGINT NOT NULL COMMENT 'Nurse ID',
    patient_id BIGINT NOT NULL COMMENT 'Patient ID',
    assignment_date DATE NOT NULL COMMENT 'Assignment date',
    shift ENUM('day', 'night', 'swing') NOT NULL COMMENT 'Shift',
    is_primary_nurse BOOLEAN DEFAULT FALSE COMMENT 'Is primary nurse for patient',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Created timestamp',
    FOREIGN KEY (nurse_id) REFERENCES nurses(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    UNIQUE KEY uk_assignment (nurse_id, patient_id, assignment_date, shift),
    INDEX idx_assignment_date (assignment_date),
    INDEX idx_assignment_shift (shift)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Nurse patient assignments';

CREATE TABLE shift_reports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'Shift report ID',
    patient_id BIGINT NOT NULL COMMENT 'Patient ID',
    outgoing_nurse_id BIGINT NOT NULL COMMENT 'Outgoing nurse ID',
    incoming_nurse_id BIGINT COMMENT 'Incoming nurse ID',
    shift_date DATE NOT NULL COMMENT 'Shift date',
    shift_type ENUM('day_to_night', 'night_to_day', 'day_to_swing', 'swing_to_night') NOT NULL COMMENT 'Shift transition',
    patient_condition TEXT COMMENT 'Patient condition summary',
    significant_events TEXT COMMENT 'Significant events during shift',
    pending_tasks TEXT COMMENT 'Tasks pending for next shift',
    medication_notes TEXT COMMENT 'Medication-related notes',
    family_communication TEXT COMMENT 'Family communication notes',
    physician_orders TEXT COMMENT 'New physician orders',
    priority_concerns TEXT COMMENT 'Priority concerns for next shift',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Created timestamp',
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (outgoing_nurse_id) REFERENCES nurses(id),
    FOREIGN KEY (incoming_nurse_id) REFERENCES nurses(id),
    INDEX idx_shift_report_patient (patient_id),
    INDEX idx_shift_report_date (shift_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Shift handoff reports';

-- ===================================
-- SAMPLE DATA
-- ===================================

-- Insert test users (password for all users is 'password123')
INSERT INTO users (first_name, last_name, email, password, hospital, specialty, license_number, role) VALUES
('Admin', 'User', 'admin@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'General Hospital', 'Administration', 'ADM001', 'ADMIN'),
('John', 'Smith', 'john.smith@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'General Hospital', 'Internal Medicine', 'MD12345', 'DOCTOR'),
('Sarah', 'Johnson', 'sarah.johnson@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'General Hospital', 'Registered Nurse', 'RN67890', 'NURSE'),
('Mary', 'Wilson', 'mary.wilson@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'General Hospital', 'Cardiology', 'MD54321', 'DOCTOR'),
('Lisa', 'Brown', 'lisa.brown@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'General Hospital', 'Pediatric Nurse', 'RN11111', 'NURSE');

-- Insert sample patients
INSERT INTO patients (
    medical_record_number, first_name, last_name, date_of_birth, gender, 
    room_number, bed_number, admission_date, primary_physician, 
    emergency_contact_name, emergency_contact_phone, is_active
) VALUES 
(
    'MRN001234', 'Catherine', 'Albertson', '1939-07-09', 'F',
    '12A', 'A', '2024-01-15 08:30:00', 'Dr. Heartache',
    'John Albertson', '555-0123', true
),
(
    'MRN001235', 'Robert', 'Johnson', '1956-03-15', 'M',
    '8B', 'B', '2024-01-10 14:20:00', 'Dr. Smith',
    'Mary Johnson', '555-0124', true
),
(
    'MRN001236', 'Maria', 'Rodriguez', '1969-11-22', 'F',
    '15C', 'A', '2024-01-18 09:45:00', 'Dr. Wilson',
    'Carlos Rodriguez', '555-0125', true
),
(
    'MRN001237', 'James', 'Thompson', '1951-08-30', 'M',
    '22A', 'A', '2024-01-12 16:10:00', 'Dr. Brown',
    'Linda Thompson', '555-0126', true
),
(
    'MRN001238', 'Linda', 'Davis', '1934-01-12', 'F',
    '5D', 'B', '2024-01-08 11:30:00', 'Dr. Garcia',
    'Michael Davis', '555-0127', true
),
(
    'MRN001239', 'Michael', 'Chen', '1978-06-18', 'M',
    '18B', 'A', '2024-01-20 13:15:00', 'Dr. Lee',
    'Susan Chen', '555-0128', true
);

-- Insert sample allergies
INSERT INTO patient_allergies (patient_id, allergen, reaction, severity, notes) VALUES 
(1, 'Penicillin', 'Rash and hives', 'moderate', 'Developed reaction in 2020'),
(2, 'Shellfish', 'Anaphylaxis', 'life_threatening', 'Carry EpiPen at all times'),
(3, 'Latex', 'Contact dermatitis', 'mild', 'Use latex-free gloves'),
(4, 'Morphine', 'Respiratory depression', 'severe', 'Use alternative pain management'),
(6, 'Aspirin', 'GI bleeding', 'moderate', 'Avoid NSAIDs');

-- Insert sample diagnoses
INSERT INTO patient_diagnoses (patient_id, diagnosis_code, diagnosis_description, diagnosis_type, diagnosed_date, is_active) VALUES 
(1, 'I50.9', 'Congestive Heart Failure', 'primary', '2023-12-15', true),
(1, 'M79.3', 'Arthritis', 'secondary', '2023-08-20', true),
(2, 'E11.9', 'Type 2 Diabetes Mellitus', 'primary', '2022-05-10', true),
(2, 'I10', 'Essential Hypertension', 'secondary', '2021-03-15', true),
(3, 'Z98.89', 'Post-surgical recovery', 'primary', '2024-01-18', true),
(4, 'J44.1', 'COPD with acute exacerbation', 'primary', '2023-11-20', true),
(4, 'M80.9', 'Osteoporosis', 'secondary', '2023-06-12', true),
(5, 'F03.90', 'Dementia, unspecified', 'primary', '2022-09-08', true),
(5, 'M15.9', 'Osteoarthritis', 'secondary', '2021-12-03', true),
(6, 'I63.9', 'Stroke recovery', 'primary', '2024-01-15', true);

-- Insert sample medications
INSERT INTO medications (
    patient_id, medication_name, dosage, route, frequency, start_date, 
    prescribing_physician, special_instructions, is_active
) VALUES 
(1, 'Lisinopril', '10mg', 'PO', 'Daily', '2024-01-15 08:00:00', 'Dr. Heartache', 'Take with food', true),
(1, 'Furosemide', '20mg', 'PO', 'BID', '2024-01-15 08:00:00', 'Dr. Heartache', 'Monitor I&O', true),
(2, 'Metformin', '500mg', 'PO', 'BID', '2024-01-10 08:00:00', 'Dr. Smith', 'Take with meals', true),
(2, 'Amlodipine', '5mg', 'PO', 'Daily', '2024-01-10 08:00:00', 'Dr. Smith', 'Monitor BP', true),
(3, 'Acetaminophen', '650mg', 'PO', 'Q6H PRN', '2024-01-18 08:00:00', 'Dr. Wilson', 'For pain', true),
(4, 'Albuterol', '2 puffs', 'inhaled', 'Q4H PRN', '2024-01-12 08:00:00', 'Dr. Brown', 'For shortness of breath', true),
(4, 'Prednisone', '20mg', 'PO', 'Daily', '2024-01-12 08:00:00', 'Dr. Brown', 'Taper as directed', true),
(5, 'Donepezil', '5mg', 'PO', 'Daily', '2024-01-08 08:00:00', 'Dr. Garcia', 'Give in evening', true),
(6, 'Clopidogrel', '75mg', 'PO', 'Daily', '2024-01-20 08:00:00', 'Dr. Lee', 'Monitor for bleeding', true);

-- Update timestamps for sample data
UPDATE patients SET created_at = NOW(), updated_at = NOW();
UPDATE patient_allergies SET created_at = NOW(), updated_at = NOW();
UPDATE patient_diagnoses SET created_at = NOW(), updated_at = NOW();
UPDATE medications SET created_at = NOW(), updated_at = NOW();

-- ===================================
-- END OF SCHEMA
-- ===================================

-- Note: All sample users have the password 'password123' 
-- In production, users should set their own secure passwords 