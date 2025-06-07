package kr.bigdata.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.bigdata.web.dto.PatientSummaryDto;
import kr.bigdata.web.repository.PatientRepository;

@CrossOrigin(origins = "http://localhost:3000") 
@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientRepository patientRepository;

    @Autowired
    public PatientController(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    // 환자 목록 조회
    // GET /api/patients
    @GetMapping
    public List<PatientSummaryDto> getAllCurrentPatients() {
        return patientRepository.findCurrentlyAdmittedPatients();
    }
    
    // 환자 검색 (이름, PID)
    // GET /api/patients/search?keyword=10001401
    @GetMapping("/search")
    public List<PatientSummaryDto> searchPatients(
            @RequestParam(name = "keyword") String keyword) {
        return patientRepository.searchByPatientIdOrName(keyword.toLowerCase());
    }
}
