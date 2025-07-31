package com.matrixcare.repository;

import com.matrixcare.entity.PatientChartingData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientChartingDataRepository extends JpaRepository<PatientChartingData, Long> {
    
    List<PatientChartingData> findByPatientIdOrderByDisplayOrder(Long patientId);
    
    @Query("SELECT p FROM PatientChartingData p WHERE p.patientId = :patientId ORDER BY p.displayOrder ASC, p.id ASC")
    List<PatientChartingData> findByPatientIdOrdered(Long patientId);
    
    void deleteByPatientIdAndId(Long patientId, Long id);
    
    boolean existsByPatientIdAndCategoryTitle(Long patientId, String categoryTitle);
} 