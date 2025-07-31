package com.matrixcare.service;

import com.matrixcare.entity.PatientChartingData;
import com.matrixcare.repository.PatientChartingDataRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PatientChartingService {
    
    @Autowired
    private PatientChartingDataRepository chartingDataRepository;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public List<Map<String, Object>> getChartingDataForPatient(Long patientId) {
        List<PatientChartingData> chartingData = chartingDataRepository.findByPatientIdOrdered(patientId);
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (PatientChartingData data : chartingData) {
            Map<String, Object> category = new HashMap<>();
            category.put("id", data.getId());
            category.put("title", data.getCategoryTitle());
            category.put("icon", data.getCategoryIcon());
            category.put("color", data.getCategoryColor());
            category.put("displayOrder", data.getDisplayOrder());
            
            // Parse JSON items
            try {
                List<String> items = objectMapper.readValue(data.getItemData(), List.class);
                category.put("items", items);
            } catch (JsonProcessingException e) {
                // Fallback to empty list if JSON parsing fails
                category.put("items", new ArrayList<>());
            }
            
            result.add(category);
        }
        
        return result;
    }
    
    public PatientChartingData saveChartingData(Long patientId, String title, String icon, 
                                               String color, List<String> items, Integer displayOrder, Long id) {
        try {
            String itemsJson = objectMapper.writeValueAsString(items);
            
            PatientChartingData data;
            if (id != null) {
                // Update existing
                data = chartingDataRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Charting data not found"));
                data.setCategoryTitle(title);
                data.setItemData(itemsJson);
            } else {
                // Create new
                data = new PatientChartingData(patientId, title, icon, color, itemsJson, displayOrder);
            }
            
            return chartingDataRepository.save(data);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error processing charting data", e);
        }
    }
    
    public void initializeDefaultChartingData(Long patientId) {
        // Check if patient already has charting data
        List<PatientChartingData> existing = chartingDataRepository.findByPatientIdOrdered(patientId);
        if (!existing.isEmpty()) {
            return; // Already has data
        }
        
        // Create default charting categories
        List<Map<String, Object>> defaultCategories = getDefaultCategories();
        
        for (int i = 0; i < defaultCategories.size(); i++) {
            Map<String, Object> category = defaultCategories.get(i);
            try {
                String itemsJson = objectMapper.writeValueAsString(category.get("items"));
                PatientChartingData data = new PatientChartingData(
                    patientId,
                    (String) category.get("title"),
                    (String) category.get("icon"),
                    (String) category.get("color"),
                    itemsJson,
                    i
                );
                chartingDataRepository.save(data);
            } catch (JsonProcessingException e) {
                // Skip this category if JSON processing fails
                continue;
            }
        }
    }
    
    private List<Map<String, Object>> getDefaultCategories() {
        List<Map<String, Object>> categories = new ArrayList<>();
        
        // Activities of Daily Living
        Map<String, Object> adl = new HashMap<>();
        adl.put("title", "Activities of Daily Living");
        adl.put("icon", "👤");
        adl.put("color", "blue");
        adl.put("items", Arrays.asList("Bathing", "Dressing", "Grooming", "Mobility"));
        categories.add(adl);
        
        // Cognitive, Psychosocial
        Map<String, Object> cognitive = new HashMap<>();
        cognitive.put("title", "Cognitive, Psychosocial");
        cognitive.put("icon", "⚠️");
        cognitive.put("color", "yellow");
        cognitive.put("items", Arrays.asList("Memory", "Orientation", "Behavior", "Social interaction"));
        categories.add(cognitive);
        
        // Health related services
        Map<String, Object> health = new HashMap<>();
        health.put("title", "Health related services");
        health.put("icon", "❤️");
        health.put("color", "red");
        health.put("items", Arrays.asList("Vital signs", "Medications", "Treatments", "Assessments"));
        categories.add(health);
        
        // Vital Signs
        Map<String, Object> vitals = new HashMap<>();
        vitals.put("title", "Vital Signs");
        vitals.put("icon", "🩺");
        vitals.put("color", "pink");
        vitals.put("items", Arrays.asList("Blood pressure", "Temperature", "Pulse", "Respiration"));
        categories.add(vitals);
        
        // Nutrition
        Map<String, Object> nutrition = new HashMap<>();
        nutrition.put("title", "Nutrition, dining services");
        nutrition.put("icon", "🍽️");
        nutrition.put("color", "orange");
        nutrition.put("items", Arrays.asList("Meal assistance", "Hydration", "Special diets", "Feeding"));
        categories.add(nutrition);
        
        return categories;
    }
    
    public void deleteChartingData(Long patientId, Long id) {
        chartingDataRepository.deleteByPatientIdAndId(patientId, id);
    }
} 