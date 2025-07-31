package com.matrixcare.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "patient_diagnoses")
public class PatientDiagnosis {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonBackReference
    private Patient patient;
    
    @Column(name = "diagnosis_code")
    private String diagnosisCode;
    
    @Column(name = "diagnosis_description", columnDefinition = "TEXT", nullable = false)
    private String diagnosisDescription;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "diagnosis_type")
    private DiagnosisType diagnosisType = DiagnosisType.secondary;
    
    @Column(name = "diagnosed_date")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate diagnosedDate;
    
    @Column(name = "resolved_date")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate resolvedDate;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    
    // Constructors
    public PatientDiagnosis() {}
    
    public PatientDiagnosis(Patient patient, String diagnosisDescription, DiagnosisType diagnosisType) {
        this.patient = patient;
        this.diagnosisDescription = diagnosisDescription;
        this.diagnosisType = diagnosisType;
    }
    
    // Lifecycle methods
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    
    public String getDiagnosisCode() { return diagnosisCode; }
    public void setDiagnosisCode(String diagnosisCode) { this.diagnosisCode = diagnosisCode; }
    
    public String getDiagnosisDescription() { return diagnosisDescription; }
    public void setDiagnosisDescription(String diagnosisDescription) { this.diagnosisDescription = diagnosisDescription; }
    
    public DiagnosisType getDiagnosisType() { return diagnosisType; }
    public void setDiagnosisType(DiagnosisType diagnosisType) { this.diagnosisType = diagnosisType; }
    
    public LocalDate getDiagnosedDate() { return diagnosedDate; }
    public void setDiagnosedDate(LocalDate diagnosedDate) { this.diagnosedDate = diagnosedDate; }
    
    public LocalDate getResolvedDate() { return resolvedDate; }
    public void setResolvedDate(LocalDate resolvedDate) { this.resolvedDate = resolvedDate; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // DiagnosisType enum
    public enum DiagnosisType {
        primary, secondary, working
    }
} 