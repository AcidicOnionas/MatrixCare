-- Insert test users for MatrixCare authentication
-- Password for all users is 'password123'

INSERT INTO users (first_name, last_name, email, password, hospital, specialty, license_number, role) VALUES
('Admin', 'User', 'admin@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'General Hospital', 'Administration', 'ADM001', 'ADMIN'),
('John', 'Smith', 'john.smith@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'General Hospital', 'Internal Medicine', 'MD12345', 'DOCTOR'),
('Sarah', 'Johnson', 'sarah.johnson@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'General Hospital', 'Registered Nurse', 'RN67890', 'NURSE'),
('Mary', 'Wilson', 'mary.wilson@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'General Hospital', 'Cardiology', 'MD54321', 'DOCTOR'),
('Lisa', 'Brown', 'lisa.brown@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'General Hospital', 'Pediatric Nurse', 'RN11111', 'NURSE'); 