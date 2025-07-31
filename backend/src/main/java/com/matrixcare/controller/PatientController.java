package com.matrixcare.controller;

import com.matrixcare.entity.Patient;
import com.matrixcare.service.PatientService;
import com.matrixcare.service.PatientChartingService;
import com.matrixcare.service.VitalSignsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/patients")
@CrossOrigin(origins = "http://localhost:3000")
public class PatientController {
    
    @Autowired
    private PatientService patientService;
    
    @Autowired
    private PatientChartingService chartingService;
    
    @Autowired
    private VitalSignsService vitalSignsService;
    
    // Test endpoint for debugging
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("API is working! Current time: " + java.time.LocalDateTime.now());
    }
    
    // Get all active patients
    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        try {
            List<Patient> patients = patientService.getAllActivePatients();
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get patient by ID
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        try {
            Optional<Patient> patient = patientService.getPatientById(id);
            if (patient.isPresent()) {
                return ResponseEntity.ok(patient.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get patient by Medical Record Number
    @GetMapping("/mrn/{mrn}")
    public ResponseEntity<Patient> getPatientByMRN(@PathVariable String mrn) {
        try {
            Optional<Patient> patient = patientService.getPatientByMRN(mrn);
            if (patient.isPresent()) {
                return ResponseEntity.ok(patient.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Create new patient
    @PostMapping
    public ResponseEntity<?> createPatient(@RequestBody Patient patient) {
        try {
            System.out.println("Received patient data: " + patient.toString());
            
            // Validate required fields
            if (patient.getFirstName() == null || patient.getFirstName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("First name is required");
            }
            if (patient.getLastName() == null || patient.getLastName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Last name is required");
            }
            if (patient.getDateOfBirth() == null) {
                return ResponseEntity.badRequest().body("Date of birth is required");
            }
            if (patient.getGender() == null) {
                return ResponseEntity.badRequest().body("Gender is required");
            }
            
            Patient createdPatient = patientService.createPatient(patient);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPatient);
        } catch (Exception e) {
            System.err.println("Error creating patient: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating patient: " + e.getMessage());
        }
    }
    
    // Update existing patient
    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patientDetails) {
        try {
            Patient updatedPatient = patientService.updatePatient(id, patientDetails);
            return ResponseEntity.ok(updatedPatient);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    // Delete patient (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        try {
            patientService.deletePatient(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Search patients by name
    @GetMapping("/search")
    public ResponseEntity<List<Patient>> searchPatients(@RequestParam String name) {
        try {
            List<Patient> patients = patientService.searchPatientsByName(name);
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get patients by room
    @GetMapping("/room/{roomNumber}")
    public ResponseEntity<List<Patient>> getPatientsByRoom(@PathVariable String roomNumber) {
        try {
            List<Patient> patients = patientService.getPatientsByRoom(roomNumber);
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get patients by physician
    @GetMapping("/physician/{physician}")
    public ResponseEntity<List<Patient>> getPatientsByPhysician(@PathVariable String physician) {
        try {
            List<Patient> patients = patientService.getPatientsByPhysician(physician);
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get patient count
    @GetMapping("/count")
    public ResponseEntity<Long> getPatientCount() {
        try {
            long count = patientService.getActivePatientCount();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get patients with allergies
    @GetMapping("/allergies")
    public ResponseEntity<List<Patient>> getPatientsWithAllergies() {
        try {
            List<Patient> patients = patientService.getPatientsWithAllergies();
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get patients by specific allergen
    @GetMapping("/allergen/{allergen}")
    public ResponseEntity<List<Patient>> getPatientsByAllergen(@PathVariable String allergen) {
        try {
            List<Patient> patients = patientService.getPatientsByAllergen(allergen);
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get patients admitted in date range
    @GetMapping("/admitted")
    public ResponseEntity<List<Patient>> getPatientsAdmittedBetween(
            @RequestParam String startDate, 
            @RequestParam String endDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            LocalDateTime start = LocalDateTime.parse(startDate, formatter);
            LocalDateTime end = LocalDateTime.parse(endDate, formatter);
            
            List<Patient> patients = patientService.getPatientsAdmittedBetween(start, end);
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    // Charting Data Endpoints
    
    @GetMapping("/{id}/charting")
    public ResponseEntity<List<Map<String, Object>>> getPatientChartingData(@PathVariable Long id) {
        try {
            // Initialize default data if none exists
            chartingService.initializeDefaultChartingData(id);
            
            List<Map<String, Object>> chartingData = chartingService.getChartingDataForPatient(id);
            return ResponseEntity.ok(chartingData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/{id}/charting")
    public ResponseEntity<?> savePatientChartingData(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            String title = (String) request.get("title");
            String icon = (String) request.get("icon");
            String color = (String) request.get("color");
            List<String> items = (List<String>) request.get("items");
            Integer displayOrder = (Integer) request.get("displayOrder");
            Long chartingId = request.get("id") != null ? Long.valueOf(request.get("id").toString()) : null;
            
            chartingService.saveChartingData(id, title, icon, color, items, displayOrder, chartingId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @DeleteMapping("/{id}/charting/{chartingId}")
    public ResponseEntity<?> deletePatientChartingData(@PathVariable Long id, @PathVariable Long chartingId) {
        try {
            chartingService.deleteChartingData(id, chartingId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Vital Signs Endpoints
    
    @GetMapping("/{id}/vitals")
    public ResponseEntity<List<Map<String, Object>>> getVitalSignsHistory(
            @PathVariable Long id,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<Map<String, Object>> vitals = vitalSignsService.getVitalSignsHistory(id, limit);
            return ResponseEntity.ok(vitals);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}/vitals/latest")
    public ResponseEntity<Map<String, Object>> getLatestVitalSigns(@PathVariable Long id) {
        try {
            Map<String, Object> vitals = vitalSignsService.getLatestVitalSigns(id);
            return ResponseEntity.ok(vitals);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/{id}/vitals")
    public ResponseEntity<?> saveVitalSigns(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            // Extract user info from request (in real app, get from JWT token)
            Long userId = request.get("userId") != null ? 
                Long.valueOf(request.get("userId").toString()) : 1L;
            String userName = request.get("userName") != null ? 
                request.get("userName").toString() : "Unknown User";
            
            vitalSignsService.saveVitalSigns(id, userId, userName, request);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}/vitals/count")
    public ResponseEntity<Map<String, Object>> getVitalSignsCount(@PathVariable Long id) {
        try {
            long count = vitalSignsService.getVitalSignsCount(id);
            Map<String, Object> response = new HashMap<>();
            response.put("count", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 