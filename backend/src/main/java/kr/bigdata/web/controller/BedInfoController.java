package kr.bigdata.web.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.bigdata.web.entity.BedInfo;
import kr.bigdata.web.entity.EmergencyVisit;
import kr.bigdata.web.repository.BedInfoRepository;
import kr.bigdata.web.repository.EmergencyVisitRepository;
import kr.bigdata.web.service.BedInfoService;

@RestController
@RequestMapping("/api/beds")
public class BedInfoController {

	@Autowired
	private BedInfoService bedInfoService;
	@Autowired
	private BedInfoRepository bedInfoRepository;
	@Autowired
	private EmergencyVisitRepository emergencyVisitRepository;

	// 응급실 병상 확인
	// GET /api/beds/er-count
	@GetMapping("/er-count")
	public Map<String, Long> getERBedCount() {
		long available = bedInfoService.getAvailableCount();
		long total = bedInfoService.getTotalCount();
		Map<String, Long> map = new HashMap<>();
		map.put("available", available);
		map.put("total", total);
		return map;
	}

	// 특정 환자 응급실 침대 배정
	@PutMapping("/assign")
	public ResponseEntity<Map<String, Object>> assignBedToPatient(@RequestBody Map<String, String> request) {

		Map<String, Object> response = new HashMap<>();

		try {
			String visitId = request.get("visitId");
			String bedNumber = request.get("bedNumber");

			// 입력값 검증
			if (visitId == null || bedNumber == null) {
				response.put("success", false);
				response.put("message", "방문 ID와 병상 번호가 필요합니다.");
				return ResponseEntity.badRequest().body(response);
			}

			// 환자 방문 정보 조회
			Optional<EmergencyVisit> visitOptional = emergencyVisitRepository.findById(visitId);
			if (!visitOptional.isPresent()) {
				response.put("success", false);
				response.put("message", "해당 방문 정보를 찾을 수 없습니다.");
				return ResponseEntity.notFound().build();
			}

			// 병상 정보 조회
			Optional<BedInfo> bedOptional = bedInfoRepository.findById(bedNumber);
			if (!bedOptional.isPresent()) {
				response.put("success", false);
				response.put("message", "해당 병상을 찾을 수 없습니다.");
				return ResponseEntity.notFound().build();
			}

			BedInfo bed = bedOptional.get();

			// 병상이 이미 사용 중인지 확인
			if ("OCCUPIED".equals(bed.getStatus())) {
				response.put("success", false);
				response.put("message", "해당 병상은 이미 사용 중입니다.");
				return ResponseEntity.badRequest().body(response);
			}

			// 환자가 이미 다른 병상에 배정되어 있는지 확인
			EmergencyVisit visit = visitOptional.get();
			if (visit.getBedNumber() != null && !visit.getBedNumber().isEmpty()) {
				// 기존 병상을 사용 가능으로 변경
				Optional<BedInfo> oldBedOptional = bedInfoRepository.findById(visit.getBedNumber());
				if (oldBedOptional.isPresent()) {
					BedInfo oldBed = oldBedOptional.get();
					oldBed.setStatus("AVAILABLE");
					bedInfoRepository.save(oldBed);
				}
			}

			// 병상 배정 처리
			visit.setBedNumber(bedNumber);
			emergencyVisitRepository.save(visit);

			// 병상 상태를 사용 중으로 변경
			bed.setStatus("OCCUPIED");
			bedInfoRepository.save(bed);

			response.put("success", true);
			response.put("message", "병상이 성공적으로 배정되었습니다.");
			response.put("visitId", visitId);
			response.put("bedNumber", bedNumber);

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "병상 배정 중 오류가 발생했습니다: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	// 병상 배정 해제
	@PutMapping("/unassign")
	public ResponseEntity<Map<String, Object>> unassignBedFromPatient(@RequestBody Map<String, String> request) {

		Map<String, Object> response = new HashMap<>();

		try {
			String visitId = request.get("visitId");

			// 입력값 검증
			if (visitId == null) {
				response.put("success", false);
				response.put("message", "방문 ID가 필요합니다.");
				return ResponseEntity.badRequest().body(response);
			}

			// 환자 방문 정보 조회
			Optional<EmergencyVisit> visitOptional = emergencyVisitRepository.findById(visitId);
			if (!visitOptional.isPresent()) {
				response.put("success", false);
				response.put("message", "해당 방문 정보를 찾을 수 없습니다.");
				return ResponseEntity.notFound().build();
			}

			EmergencyVisit visit = visitOptional.get();
			String currentBedNumber = visit.getBedNumber();

			// 병상이 배정되어 있는지 확인
			if (currentBedNumber == null || currentBedNumber.isEmpty()) {
				response.put("success", false);
				response.put("message", "해당 환자는 병상이 배정되어 있지 않습니다.");
				return ResponseEntity.badRequest().body(response);
			}

			// 최종 배치 상태 확인 (FINAL_DISPOSITION이 null이면 아직 최종 배치가 안된 상태)
			if (visit.getFinalDisposition() == null) {
				response.put("success", false);
				response.put("needsDisposition", true);
				response.put("message", "최종 배치가 결정되지 않았습니다.");
				response.put("patientName", visit.getPatient().getPatientName());
				return ResponseEntity.ok(response);
			}

			// 병상 배정 해제 처리
			visit.setBedNumber(null);
			emergencyVisitRepository.save(visit);

			// 병상 상태를 사용 가능으로 변경
			Optional<BedInfo> bedOptional = bedInfoRepository.findById(currentBedNumber);
			if (bedOptional.isPresent()) {
				BedInfo bed = bedOptional.get();
				bed.setStatus("AVAILABLE");
				bedInfoRepository.save(bed);
			}

			response.put("success", true);
			response.put("message", "병상 배정이 성공적으로 해제되었습니다.");
			response.put("visitId", visitId);
			response.put("bedNumber", currentBedNumber);

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "병상 배정 해제 중 오류가 발생했습니다: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	// 강제 병상 배정 해제 (최종 배치 없이)
	@PutMapping("/force-unassign")
	public ResponseEntity<Map<String, Object>> forceUnassignBedFromPatient(@RequestBody Map<String, String> request) {

		Map<String, Object> response = new HashMap<>();

		try {
			String visitId = request.get("visitId");

			// 환자 방문 정보 조회
			Optional<EmergencyVisit> visitOptional = emergencyVisitRepository.findById(visitId);
			if (!visitOptional.isPresent()) {
				response.put("success", false);
				response.put("message", "해당 방문 정보를 찾을 수 없습니다.");
				return ResponseEntity.notFound().build();
			}

			EmergencyVisit visit = visitOptional.get();
			String currentBedNumber = visit.getBedNumber();

			// 병상 배정 해제 처리
			visit.setBedNumber(null);
			emergencyVisitRepository.save(visit);

			// 병상 상태를 사용 가능으로 변경
			if (currentBedNumber != null && !currentBedNumber.isEmpty()) {
				Optional<BedInfo> bedOptional = bedInfoRepository.findById(currentBedNumber);
				if (bedOptional.isPresent()) {
					BedInfo bed = bedOptional.get();
					bed.setStatus("AVAILABLE");
					bedInfoRepository.save(bed);
				}
			}

			response.put("success", true);
			response.put("message", "병상 배정이 강제로 해제되었습니다.");

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "강제 병상 해제 중 오류가 발생했습니다: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

}