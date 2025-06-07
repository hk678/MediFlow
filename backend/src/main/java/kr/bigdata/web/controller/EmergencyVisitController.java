package kr.bigdata.web.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.bigdata.web.dto.VisitSummaryDto;
import kr.bigdata.web.repository.EmergencyVisitRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EmergencyVisitController {
	
	private final EmergencyVisitRepository emergencyVisitRepository;

	@GetMapping("/visits/{patientId}")
    public ResponseEntity<List<VisitSummaryDto>> getPatientVisitSummaries(@PathVariable String patientId) {
        List<VisitSummaryDto> summaries = emergencyVisitRepository.findVisitSummariesByPatientId(patientId);
        return ResponseEntity.ok(summaries);
    }
}
