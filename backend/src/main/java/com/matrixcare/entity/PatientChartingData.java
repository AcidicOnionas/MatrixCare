package com.matrixcare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "patient_charting_data")
public class PatientChartingData {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "patient_id", nullable = false)
    private Long patientId;
    
    @NotBlank
    @Column(name = "category_title", nullable = false)
    private String categoryTitle;
    
    @Column(name = "category_icon")
    private String categoryIcon;
    
    @Column(name = "category_color")
    private String categoryColor;
    
    @Column(name = "item_data", columnDefinition = "TEXT")
    private String itemData; // JSON string of items array
    
    @Column(name = "display_order")
    private Integer displayOrder;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public PatientChartingData() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public PatientChartingData(Long patientId, String categoryTitle, String categoryIcon, 
                              String categoryColor, String itemData, Integer displayOrder) {
        this();
        this.patientId = patientId;
        this.categoryTitle = categoryTitle;
        this.categoryIcon = categoryIcon;
        this.categoryColor = categoryColor;
        this.itemData = itemData;
        this.displayOrder = displayOrder;
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
    
    public String getCategoryTitle() {
        return categoryTitle;
    }
    
    public void setCategoryTitle(String categoryTitle) {
        this.categoryTitle = categoryTitle;
    }
    
    public String getCategoryIcon() {
        return categoryIcon;
    }
    
    public void setCategoryIcon(String categoryIcon) {
        this.categoryIcon = categoryIcon;
    }
    
    public String getCategoryColor() {
        return categoryColor;
    }
    
    public void setCategoryColor(String categoryColor) {
        this.categoryColor = categoryColor;
    }
    
    public String getItemData() {
        return itemData;
    }
    
    public void setItemData(String itemData) {
        this.itemData = itemData;
    }
    
    public Integer getDisplayOrder() {
        return displayOrder;
    }
    
    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
} 