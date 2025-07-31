package com.matrixcare.service;

import com.matrixcare.entity.Patient;
import com.matrixcare.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PatientService {
    
    @Autowired
    private PatientRepository patientRepository;
    
    // Get all active patients
    public List<Patient> getAllActivePatients() {
        return patientRepository.findByIsActiveTrue();
    }
    
    // Get patient by ID
    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }
    
    // Get patient by medical record number
    public Optional<Patient> getPatientByMRN(String mrn) {
        return patientRepository.findByMedicalRecordNumber(mrn);
    }
    
    // Create new patient
    public Patient createPatient(Patient patient) {
        // Generate MRN if not provided
        if (patient.getMedicalRecordNumber() == null || patient.getMedicalRecordNumber().isEmpty()) {
            patient.setMedicalRecordNumber(generateMRN());
        }
        
        // Set admission date if not provided
        if (patient.getAdmissionDate() == null) {
            patient.setAdmissionDate(LocalDateTime.now());
        }
        
        return patientRepository.save(patient);
    }
    
    // Update existing patient
    public Patient updatePatient(Long id, Patient patientDetails) {
        Optional<Patient> optionalPatient = patientRepository.findById(id);
        
        if (optionalPatient.isPresent()) {
            Patient patient = optionalPatient.get();
            
            // Update fields
            patient.setFirstName(patientDetails.getFirstName());
            patient.setLastName(patientDetails.getLastName());
            patient.setDateOfBirth(patientDetails.getDateOfBirth());
            patient.setGender(patientDetails.getGender());
            patient.setRoomNumber(patientDetails.getRoomNumber());
            patient.setBedNumber(patientDetails.getBedNumber());
            patient.setPrimaryPhysician(patientDetails.getPrimaryPhysician());
            patient.setEmergencyContactName(patientDetails.getEmergencyContactName());
            patient.setEmergencyContactPhone(patientDetails.getEmergencyContactPhone());
            patient.setInsuranceInfo(patientDetails.getInsuranceInfo());
            
            if (patientDetails.getDischargeDate() != null) {
                patient.setDischargeDate(patientDetails.getDischargeDate());
            }
            
            return patientRepository.save(patient);
        }
        
        throw new RuntimeException("Patient not found with id: " + id);
    }
    
    // Soft delete patient (set inactive)
    public void deletePatient(Long id) {
        Optional<Patient> optionalPatient = patientRepository.findById(id);
        
        if (optionalPatient.isPresent()) {
            Patient patient = optionalPatient.get();
            patient.setIsActive(false);
            patient.setDischargeDate(LocalDateTime.now());
            patientRepository.save(patient);
        } else {
            throw new RuntimeException("Patient not found with id: " + id);
        }
    }
    
    // Search patients by name
    public List<Patient> searchPatientsByName(String searchTerm) {
        return patientRepository.findByNameContainingIgnoreCase(searchTerm);
    }
    
    // Get patients by room
    public List<Patient> getPatientsByRoom(String roomNumber) {
        return patientRepository.findByRoomNumberAndIsActiveTrue(roomNumber);
    }
    
    // Get patients by physician
    public List<Patient> getPatientsByPhysician(String physician) {
        return patientRepository.findByPrimaryPhysicianAndIsActiveTrue(physician);
    }
    
    // Get patient count
    public long getActivePatientCount() {
        return patientRepository.countByIsActiveTrue();
    }
    
    // Get patients with allergies
    public List<Patient> getPatientsWithAllergies() {
        return patientRepository.findPatientsWithAllergies();
    }
    
    // Get patients by specific allergen
    public List<Patient> getPatientsByAllergen(String allergen) {
        return patientRepository.findPatientsByAllergen(allergen);
    }
    
    // Get patients admitted in date range
    public List<Patient> getPatientsAdmittedBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return patientRepository.findByAdmissionDateBetween(startDate, endDate);
    }
    
    // Generate Medical Record Number
    private String generateMRN() {
        // Simple MRN generation - in production, use more sophisticated logic
        long timestamp = System.currentTimeMillis();
        return "MRN" + String.valueOf(timestamp).substring(7);
    }
} 