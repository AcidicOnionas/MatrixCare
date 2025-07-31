package com.matrixcare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "vital_signs_entries")
public class VitalSignsEntry {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "patient_id", nullable = false)
    private Long patientId;
    
    @Column(name = "user_id")
    private Long userId;
    
    @Column(name = "user_name")
    private String userName;
    
    @Column(name = "blood_pressure_systolic")
    private Integer bloodPressureSystolic;
    
    @Column(name = "blood_pressure_diastolic")
    private Integer bloodPressureDiastolic;
    
    @Column(name = "temperature")
    private Double temperature;
    
    @Column(name = "temperature_unit")
    private String temperatureUnit = "F"; // F or C
    
    @Column(name = "pulse")
    private Integer pulse;
    
    @Column(name = "respiration")
    private Integer respiration;
    
    @Column(name = "oxygen_saturation")
    private Integer oxygenSaturation;
    
    @Column(name = "pain_level")
    private Integer painLevel; // 1-10 scale
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    // Constructors
    public VitalSignsEntry() {
        this.createdAt = LocalDateTime.now();
        this.recordedAt = LocalDateTime.now();
    }
    
    public VitalSignsEntry(Long patientId, Long userId, String userName) {
        this();
        this.patientId = patientId;
        this.userId = userId;
        this.userName = userName;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getPatientId() {
        return patientId;
    }
    
    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public Integer getBloodPressureSystolic() {
        return bloodPressureSystolic;
    }
    
    public void setBloodPressureSystolic(Integer bloodPressureSystolic) {
        this.bloodPressureSystolic = bloodPressureSystolic;
    }
    
    public Integer getBloodPressureDiastolic() {
        return bloodPressureDiastolic;
    }
    
    public void setBloodPressureDiastolic(Integer bloodPressureDiastolic) {
        this.bloodPressureDiastolic = bloodPressureDiastolic;
    }
    
    public Double getTemperature() {
        return temperature;
    }
    
    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }
    
    public String getTemperatureUnit() {
        return temperatureUnit;
    }
    
    public void setTemperatureUnit(String temperatureUnit) {
        this.temperatureUnit = temperatureUnit;
    }
    
    public Integer getPulse() {
        return pulse;
    }
    
    public void setPulse(Integer pulse) {
        this.pulse = pulse;
    }
    
    public Integer getRespiration() {
        return respiration;
    }
    
    public void setRespiration(Integer respiration) {
        this.respiration = respiration;
    }
    
    public Integer getOxygenSaturation() {
        return oxygenSaturation;
    }
    
    public void setOxygenSaturation(Integer oxygenSaturation) {
        this.oxygenSaturation = oxygenSaturation;
    }
    
    public Integer getPainLevel() {
        return painLevel;
    }
    
    public void setPainLevel(Integer painLevel) {
        this.painLevel = painLevel;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }
    
    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    // Helper methods
    public String getBloodPressureString() {
        if (bloodPressureSystolic != null && bloodPressureDiastolic != null) {
            return bloodPressureSystolic + "/" + bloodPressureDiastolic;
        }
        return null;
    }
    
    public String getTemperatureString() {
        if (temperature != null) {
            return String.format("%.1f°%s", temperature, temperatureUnit);
        }
        return null;
    }
} 