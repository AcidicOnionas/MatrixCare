package com.matrixcare.service;

import com.matrixcare.entity.VitalSignsEntry;
import com.matrixcare.repository.VitalSignsEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class VitalSignsService {
    
    @Autowired
    private VitalSignsEntryRepository vitalSignsRepository;
    
    public List<Map<String, Object>> getVitalSignsHistory(Long patientId, int limit) {
        List<VitalSignsEntry> entries;
        if (limit > 0) {
            entries = vitalSignsRepository.findByPatientIdOrderByRecordedAtDesc(patientId)
                    .stream().limit(limit).collect(Collectors.toList());
        } else {
            entries = vitalSignsRepository.findByPatientIdOrderByRecordedAtDesc(patientId);
        }
        
        return entries.stream().map(this::convertToMap).collect(Collectors.toList());
    }
    
    public Map<String, Object> getLatestVitalSigns(Long patientId) {
        VitalSignsEntry latest = vitalSignsRepository.findLatestByPatientId(patientId);
        return latest != null ? convertToMap(latest) : new HashMap<>();
    }
    
    public VitalSignsEntry saveVitalSigns(Long patientId, Long userId, String userName, 
                                         Map<String, Object> vitalSignsData) {
        VitalSignsEntry entry = new VitalSignsEntry(patientId, userId, userName);
        
        // Set vital signs data
        if (vitalSignsData.get("bloodPressureSystolic") != null) {
            entry.setBloodPressureSystolic(Integer.valueOf(vitalSignsData.get("bloodPressureSystolic").toString()));
        }
        if (vitalSignsData.get("bloodPressureDiastolic") != null) {
            entry.setBloodPressureDiastolic(Integer.valueOf(vitalSignsData.get("bloodPressureDiastolic").toString()));
        }
        if (vitalSignsData.get("temperature") != null) {
            entry.setTemperature(Double.valueOf(vitalSignsData.get("temperature").toString()));
        }
        if (vitalSignsData.get("temperatureUnit") != null) {
            entry.setTemperatureUnit(vitalSignsData.get("temperatureUnit").toString());
        }
        if (vitalSignsData.get("pulse") != null) {
            entry.setPulse(Integer.valueOf(vitalSignsData.get("pulse").toString()));
        }
        if (vitalSignsData.get("respiration") != null) {
            entry.setRespiration(Integer.valueOf(vitalSignsData.get("respiration").toString()));
        }
        if (vitalSignsData.get("oxygenSaturation") != null) {
            entry.setOxygenSaturation(Integer.valueOf(vitalSignsData.get("oxygenSaturation").toString()));
        }
        if (vitalSignsData.get("painLevel") != null) {
            entry.setPainLevel(Integer.valueOf(vitalSignsData.get("painLevel").toString()));
        }
        if (vitalSignsData.get("notes") != null) {
            entry.setNotes(vitalSignsData.get("notes").toString());
        }
        if (vitalSignsData.get("recordedAt") != null) {
            // Parse custom timestamp if provided
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
                entry.setRecordedAt(LocalDateTime.parse(vitalSignsData.get("recordedAt").toString(), formatter));
            } catch (Exception e) {
                // Use current time if parsing fails
                entry.setRecordedAt(LocalDateTime.now());
            }
        }
        
        return vitalSignsRepository.save(entry);
    }
    
    public long getVitalSignsCount(Long patientId) {
        return vitalSignsRepository.countByPatientId(patientId);
    }
    
    public List<Map<String, Object>> getVitalSignsSince(Long patientId, LocalDateTime since) {
        List<VitalSignsEntry> entries = vitalSignsRepository.findByPatientIdSince(patientId, since);
        return entries.stream().map(this::convertToMap).collect(Collectors.toList());
    }
    
    private Map<String, Object> convertToMap(VitalSignsEntry entry) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", entry.getId());
        map.put("patientId", entry.getPatientId());
        map.put("userId", entry.getUserId());
        map.put("userName", entry.getUserName());
        map.put("bloodPressureSystolic", entry.getBloodPressureSystolic());
        map.put("bloodPressureDiastolic", entry.getBloodPressureDiastolic());
        map.put("bloodPressureString", entry.getBloodPressureString());
        map.put("temperature", entry.getTemperature());
        map.put("temperatureUnit", entry.getTemperatureUnit());
        map.put("temperatureString", entry.getTemperatureString());
        map.put("pulse", entry.getPulse());
        map.put("respiration", entry.getRespiration());
        map.put("oxygenSaturation", entry.getOxygenSaturation());
        map.put("painLevel", entry.getPainLevel());
        map.put("notes", entry.getNotes());
        map.put("recordedAt", entry.getRecordedAt());
        map.put("createdAt", entry.getCreatedAt());
        
        // Format timestamps for display
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");
        map.put("recordedAtFormatted", entry.getRecordedAt().format(formatter));
        map.put("createdAtFormatted", entry.getCreatedAt().format(formatter));
        
        return map;
    }
} 