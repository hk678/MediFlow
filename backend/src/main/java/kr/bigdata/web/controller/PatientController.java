package kr.bigdata.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.bigdata.web.dto.PatientSummaryDto;
import kr.bigdata.web.repository.PatientRepository;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientRepository patientRepository;

    @Autowired
    public PatientController(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    // GET /api/patients
    @GetMapping
    public List<PatientSummaryDto> getAllCurrentPatients() {
        return patientRepository.findCurrentlyAdmittedPatients();
    }
}
