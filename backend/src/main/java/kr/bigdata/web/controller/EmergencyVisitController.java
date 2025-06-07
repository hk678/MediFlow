package kr.bigdata.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import kr.bigdata.web.dto.FinalizeDispositionRequest;
import kr.bigdata.web.dto.VisitDetailDto;
import kr.bigdata.web.entity.EmergencyVisit;
import kr.bigdata.web.repository.EmergencyVisitRepository;
import kr.bigdata.web.service.EmergencyVisitService;

@RestController // ⬅️ 꼭 추가!
@RequestMapping("/api/visits") // 
public class EmergencyVisitController {
	
	// 객체 주입! 이 부분이 반드시 있어야 함!
    private final EmergencyVisitRepository emergencyVisitRepository;
    private final EmergencyVisitService emergencyVisitService; // ⭐ 추가

    
    @Autowired
    public EmergencyVisitController(EmergencyVisitRepository emergencyVisitRepository,
            EmergencyVisitService emergencyVisitService // ⭐ 생성자 파라미터로 추가!
            ) {
        this.emergencyVisitRepository = emergencyVisitRepository;
        this.emergencyVisitService = emergencyVisitService; // ⭐ 추가

    }
	
	@GetMapping("/{visitId}")
	public ResponseEntity<VisitDetailDto> getVisitDetail(@PathVariable String visitId) {
	    EmergencyVisit visit = emergencyVisitRepository.findById(visitId)
	            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "방문(ADM) 정보 없음"));

	    VisitDetailDto dto = new VisitDetailDto();
	    dto.setVisitId(visit.getVisitId());
	    dto.setPatientId(visit.getPatient().getPatientId()); // FK 맞게!
	    dto.setAdmissionTime(visit.getAdmissionTime());
	    dto.setDischargeTime(visit.getDischargeTime());
	    dto.setAcuity(visit.getAcuity());
	    dto.setPain(visit.getPain());
	    dto.setChiefComplaint(visit.getChiefComplaint());
	    dto.setArrivalTransport(visit.getArrivalTransport());
	    dto.setDiagnosis(visit.getDiagnosis());
	    dto.setFinalDisposition(visit.getFinalDisposition());
	    dto.setBedNumber(visit.getBedNumber());
	    dto.setStatus(visit.getStatus());
	    return ResponseEntity.ok(dto);
	}


	// 최종 배치 확정 api
	@PostMapping("/{visitId}/disposition")
	public ResponseEntity<?> finalizeDisposition(
	    @PathVariable String visitId,
	    @RequestBody FinalizeDispositionRequest request) {

	    emergencyVisitService.finalizeDisposition(
	        visitId,
	        request.getDisposition(),
	        request.getReason()
	    );
	    return ResponseEntity.ok().build();
	}


}
