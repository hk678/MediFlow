package kr.bigdata.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import kr.bigdata.web.dto.EmergencyVisitSummaryDto;
import kr.bigdata.web.dto.PatientDetailDto;
import kr.bigdata.web.dto.PatientSummaryDto;
import kr.bigdata.web.entity.EmergencyVisit;
import kr.bigdata.web.entity.Patient;
import kr.bigdata.web.repository.EmergencyVisitRepository;
import kr.bigdata.web.repository.PatientRepository;

@CrossOrigin(origins = "http://localhost:*")
@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientRepository patientRepository;
    private final EmergencyVisitRepository emergencyVisitRepository;

    @Autowired
    public PatientController(PatientRepository patientRepository, EmergencyVisitRepository emergencyVisitRepository) {
        this.patientRepository = patientRepository;
        this.emergencyVisitRepository = emergencyVisitRepository;
    }

    // 1. 전체 입원 환자 목록 조회 (요약 정보)
    @GetMapping
    public List<PatientSummaryDto> getAllCurrentPatients() {
        return patientRepository.findCurrentlyAdmittedPatients();
    }

    // 2. 환자 상세정보 + 최신 방문(ADM) 정보 반환
    @GetMapping("/{patientId}")
    public ResponseEntity<PatientDetailDto> getPatientDetail(@PathVariable String patientId) {
        // 1. 환자 기본정보 조회
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 환자 없음"));

        // 2. 가장 최근 방문(ADM) 정보 조회 (내림차순 정렬하여 1건만)
        EmergencyVisit latestVisit = emergencyVisitRepository
                .findTopByPatient_PatientIdOrderByAdmissionTimeDesc(patientId)
                .orElse(null);

        // 3. DTO에 데이터 매핑
        PatientDetailDto dto = new PatientDetailDto();
        dto.setPatientId(patient.getPatientId());
        dto.setPatientName(patient.getPatientName());
        dto.setGender(patient.getGender());
        dto.setAge(patient.getAge());
        dto.setCreatedAt(patient.getCreatedAt());

        // 4. 최근 방문(ADM) 정보가 있으면 추가로 매핑
        if (latestVisit != null) {
            dto.setVisitId(latestVisit.getVisitId());
            dto.setAdmissionTime(latestVisit.getAdmissionTime());
            dto.setDischargeTime(latestVisit.getDischargeTime());
            dto.setBedNumber(latestVisit.getBedNumber());
            dto.setAcuity(latestVisit.getAcuity());
            dto.setPain(latestVisit.getPain());
            dto.setChiefComplaint(latestVisit.getChiefComplaint());
            dto.setArrivalTransport(latestVisit.getArrivalTransport());
            dto.setStatus(latestVisit.getStatus());
            dto.setFinalDisposition(latestVisit.getFinalDisposition());
            dto.setDiagnosis(latestVisit.getDiagnosis());
        }

        return ResponseEntity.ok(dto);
    }

    // 3. 환자 ADM(방문) 이력 전체 조회 API
    @GetMapping("/{patientId}/visits")
    public ResponseEntity<List<EmergencyVisitSummaryDto>> getPatientVisitHistory(@PathVariable String patientId) {
        List<EmergencyVisit> visits = emergencyVisitRepository
                .findByPatient_PatientIdOrderByAdmissionTimeDesc(patientId);

        List<EmergencyVisitSummaryDto> result = visits.stream().map(v -> {
            EmergencyVisitSummaryDto dto = new EmergencyVisitSummaryDto();
            dto.setVisitId(v.getVisitId());
            dto.setAdmissionTime(v.getAdmissionTime());
            dto.setDischargeTime(v.getDischargeTime());
            dto.setBedNumber(v.getBedNumber());
            dto.setAcuity(v.getAcuity());
            dto.setPain(v.getPain());
            dto.setChiefComplaint(v.getChiefComplaint());
            dto.setArrivalTransport(v.getArrivalTransport());
            dto.setStatus(v.getStatus());
            dto.setFinalDisposition(v.getFinalDisposition());
            return dto;
        }).toList();

        return ResponseEntity.ok(result);
    }

    // 4. 환자 검색 (이름, PID)
    @GetMapping("/search")
    public List<PatientSummaryDto> searchPatients(@RequestParam(name = "keyword") String keyword) {
        return patientRepository.searchByPatientIdOrName(keyword.toLowerCase());
    }
}
