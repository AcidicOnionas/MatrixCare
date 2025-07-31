package com.matrixcare.repository;

import com.matrixcare.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    
    // Find active patients only
    List<Patient> findByIsActiveTrue();
    
    // Find by medical record number
    Optional<Patient> findByMedicalRecordNumber(String medicalRecordNumber);
    
    // Find by room number
    List<Patient> findByRoomNumberAndIsActiveTrue(String roomNumber);
    
    // Find by physician
    List<Patient> findByPrimaryPhysicianAndIsActiveTrue(String primaryPhysician);
    
    // Search patients by name (case-insensitive)
    @Query("SELECT p FROM Patient p WHERE " +
           "(LOWER(p.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "p.isActive = true")
    List<Patient> findByNameContainingIgnoreCase(@Param("searchTerm") String searchTerm);
    
    // Find patients with allergies
    @Query("SELECT DISTINCT p FROM Patient p JOIN p.allergies a WHERE p.isActive = true")
    List<Patient> findPatientsWithAllergies();
    
    // Find patients by specific allergy
    @Query("SELECT DISTINCT p FROM Patient p JOIN p.allergies a WHERE " +
           "LOWER(a.allergen) LIKE LOWER(CONCAT('%', :allergen, '%')) AND p.isActive = true")
    List<Patient> findPatientsByAllergen(@Param("allergen") String allergen);
    
    // Count active patients
    long countByIsActiveTrue();
    
    // Find patients admitted in date range
    @Query("SELECT p FROM Patient p WHERE p.admissionDate BETWEEN :startDate AND :endDate AND p.isActive = true")
    List<Patient> findByAdmissionDateBetween(@Param("startDate") java.time.LocalDateTime startDate, 
                                           @Param("endDate") java.time.LocalDateTime endDate);
} 