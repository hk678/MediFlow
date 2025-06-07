package kr.bigdata.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.bigdata.web.dto.VitalSignDto;
import kr.bigdata.web.entity.VitalSigns;
import kr.bigdata.web.repository.VitalSignsRepository;

@RestController // 이게 있어야 REST API가 동작함!
@RequestMapping("/api/visits") // 이게 있어야 /api/visits 경로로 시작함!
public class VitalSignsController {
	
	private final VitalSignsRepository vitalSignsRepository;

    @Autowired
    public VitalSignsController(VitalSignsRepository vitalSignsRepository) {
        this.vitalSignsRepository = vitalSignsRepository;
    }

	// GET /api/visits/{visitId}/vitals
	@GetMapping("/{visitId}/vitals")
	public ResponseEntity<List<VitalSignDto>> getVitalsByVisitId(@PathVariable String visitId) {
	    List<VitalSigns> vitals = vitalSignsRepository.findByVisitIdOrderByRecordTimeDesc(visitId);

	    List<VitalSignDto> result = vitals.stream().map(v -> {
	        VitalSignDto dto = new VitalSignDto();
	        dto.setRecordId(v.getRecordId());
	        dto.setVisitId(v.getVisitId());
	        dto.setRecordTime(v.getRecordTime());
	        dto.setHr(v.getHr());
	        dto.setRr(v.getRr());
	        dto.setSpo2(v.getSpo2() != null ? v.getSpo2().doubleValue() : null);
	        dto.setSbp(v.getSbp());
	        dto.setDbp(v.getDbp());
	        dto.setBt(v.getBt() != null ? v.getBt().doubleValue() : null);
	        return dto;
	    }).toList();

	    return ResponseEntity.ok(result);
	}


}
