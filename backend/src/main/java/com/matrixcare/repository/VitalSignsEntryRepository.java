package com.matrixcare.repository;

import com.matrixcare.entity.VitalSignsEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VitalSignsEntryRepository extends JpaRepository<VitalSignsEntry, Long> {
    
    List<VitalSignsEntry> findByPatientIdOrderByRecordedAtDesc(Long patientId);
    
    List<VitalSignsEntry> findByPatientIdAndRecordedAtBetweenOrderByRecordedAtDesc(
            Long patientId, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT v FROM VitalSignsEntry v WHERE v.patientId = :patientId " +
           "ORDER BY v.recordedAt DESC LIMIT 1")
    VitalSignsEntry findLatestByPatientId(Long patientId);
    
    @Query("SELECT v FROM VitalSignsEntry v WHERE v.patientId = :patientId " +
           "AND v.recordedAt >= :since ORDER BY v.recordedAt DESC")
    List<VitalSignsEntry> findByPatientIdSince(Long patientId, LocalDateTime since);
    
    long countByPatientId(Long patientId);
} 