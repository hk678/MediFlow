package kr.bigdata.web.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import kr.bigdata.web.dto.BedStatusDto;
import kr.bigdata.web.entity.AiPrediction;
import kr.bigdata.web.entity.AvailableBeds;
import kr.bigdata.web.entity.EmergencyVisit;
import kr.bigdata.web.entity.MedicalHistory;
import kr.bigdata.web.repository.AiPredictionRepository;
import kr.bigdata.web.repository.AvailableBedsRepository;
import kr.bigdata.web.repository.EmergencyVisitRepository;
import kr.bigdata.web.repository.MedicalHistoryRepository;

@Service
public class EmergencyVisitService {

	@Autowired
	private EmergencyVisitRepository emergencyVisitRepository;

	@Autowired
	private MedicalHistoryRepository medicalHistoryRepository;

	// 가용 병상 정보
	@Autowired
	private AiPredictionRepository aiPredictionRepository;

	// 가용 병상 정보
	@Autowired
	private AvailableBedsRepository availableBedsRepository;

	// 병상 관리 로직도 포함한 최종 배치 확정/수정/퇴실 처리 로직
	@Transactional // 트랜잭션 처리로 동시성 문제 예방
	public void finalizeDisposition(String visitId, Integer disposition, String reason) {
		// 1. EMERGENCY_VISIT 테이블에서 방문 정보 찾기
		Optional<EmergencyVisit> optVisit = emergencyVisitRepository.findById(visitId);
		if (!optVisit.isPresent()) {
			throw new IllegalArgumentException("방문 정보를 찾을 수 없습니다: " + visitId);
		}
		EmergencyVisit visit = optVisit.get();

		// ▶️ 입실(배정): disposition이 1(일반병동) 또는 2(ICU)이면 해당 병동의 가용병상 -1
		if (disposition != null && (disposition == 1 || disposition == 2)) {
			String wardType = (disposition == 1) ? "WARD" : "ICU";
			AvailableBeds beds = availableBedsRepository.findTopByWardTypeOrderByUpdatedTimeDesc(wardType);
			// 음수 방지, available_count가 1 이상일 때만 감소
			if (beds != null && beds.getAvailableCount() > 0) {
				beds.setAvailableCount(beds.getAvailableCount() - 1); // 자동 -1
				beds.setUpdatedTime(LocalDateTime.now());
				availableBedsRepository.save(beds);
			}
		}

		// ▶️ 퇴실(퇴원): disposition이 0이면, 기존에 입실했던 병동의 가용병상 +1
		if (disposition != null && disposition == 0) {
			// 기존에 배정됐던 병동(최종 배치값) 추적
			Integer lastDisposition = visit.getFinalDisposition();
			String lastWardType = (lastDisposition != null && lastDisposition == 1) ? "WARD"
					: (lastDisposition != null && lastDisposition == 2) ? "ICU" : null;
			if (lastWardType != null) {
				AvailableBeds lastBeds = availableBedsRepository.findTopByWardTypeOrderByUpdatedTimeDesc(lastWardType);
				if (lastBeds != null) {
					lastBeds.setAvailableCount(lastBeds.getAvailableCount() + 1); // 자동 +1
					lastBeds.setUpdatedTime(LocalDateTime.now());
					availableBedsRepository.save(lastBeds);
				}
			}
			visit.setStatus("DISCHARGED"); // 퇴실 상태로 변경
			visit.setDischargeTime(LocalDateTime.now()); // 퇴실 시간 기록
		}

		// 2. FINAL_DISPOSITION(최종 배치) 업데이트
		visit.setFinalDisposition(disposition);

		// 3. DB에 저장
		emergencyVisitRepository.save(visit);

		// 4. reason(사유)이 있으면 MedicalHistory에 이력 남기기
		if (reason != null && !reason.trim().isEmpty()) {
			MedicalHistory history = new MedicalHistory();
			history.setVisitId(visitId);
			history.setContent("[최종 배치 사유] " + reason);
			// ★ 로그인 사용자 아이디 기록
			String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
			history.setUserId(currentUserId);
			medicalHistoryRepository.save(history);
		}
	}

	public BedStatusDto getAvailableBedInfoForVisit(String visitId) {
		// 1. 해당 visitId의 최신 퇴실 예측 결과 찾기
		Optional<AiPrediction> predOpt = aiPredictionRepository
				.findTopByEmergencyVisit_VisitIdAndPreTypeOrderByPreTimeDesc(visitId, "DISCHARGE");

		// 2. 예측 결과가 없으면 "NONE", 0, 0 반환 (프론트에서 '정보 없음'으로 처리)
		if (!predOpt.isPresent()) {
			return new BedStatusDto("NONE", 0, 0);
		}

		AiPrediction pred = predOpt.get();
		int dispo = pred.getPreDisposition();

		// 병동 종류
		// dispo == 1이면 일반병동, dispo == 2면 중환자실
		String wardType;
		if (dispo == 1) {
			wardType = "WARD";
		} else if (dispo == 2) {
			wardType = "ICU";
		} else {
			// 퇴원이거나 알 수 없는 값이면 "NONE" 반환
			return new BedStatusDto("NONE", 0, 0);
		}

		// 해당 wardType의 available_beds 조회
		AvailableBeds bed = availableBedsRepository.findTopByWardTypeOrderByUpdatedTimeDesc(wardType);

		// available_beds 데이터가 없으면 0/0 반환
		if (bed == null)
			return new BedStatusDto(wardType, 0, 0);

		// 정상 데이터면 그대로 반환
		return new BedStatusDto(wardType, bed.getAvailableCount(), bed.getTotalBeds());
	}

	// 최종 배치 수정
	@Transactional
	 public void updateDisposition(String visitId, Integer disposition, String reason) {
        Optional<EmergencyVisit> optVisit = emergencyVisitRepository.findById(visitId);
        if (!optVisit.isPresent()) {
            throw new IllegalArgumentException("방문 정보를 찾을 수 없습니다: " + visitId);
        }
        EmergencyVisit visit = optVisit.get();
        Integer prevDisposition = visit.getFinalDisposition();

        // 이전 병상 반납/회수 (입실/퇴실 로직과 유사, 필요에 따라 상세 구현)
        // 예: 변경 전 병동 반납, 변경 후 병동 배정 등 추가로 구현 가능
        
        visit.setFinalDisposition(disposition);
        emergencyVisitRepository.save(visit);
        
        // MedicalHistory 이력
        String log = String.format("[최종 배치 수정] 이전:%s → 변경:%s. 사유:%s",
                prevDisposition, disposition, reason);
        MedicalHistory history = new MedicalHistory();
        history.setVisitId(visitId);
        history.setContent(log);
        
        // 임시 강제 세팅
        String currentUserId = "doctor01";
        
        // 테스트일 때만 주석 
        //프론트 연동 시 주석 해제
       // String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        
        history.setUserId(currentUserId);
        medicalHistoryRepository.save(history);
    }

	// 최종 배치 삭제
	@Transactional
	 public void deleteDisposition(String visitId) {
        Optional<EmergencyVisit> optVisit = emergencyVisitRepository.findById(visitId);
        if (!optVisit.isPresent()) {
            throw new IllegalArgumentException("방문 정보를 찾을 수 없습니다: " + visitId);
        }
        EmergencyVisit visit = optVisit.get();
        Integer prevDisposition = visit.getFinalDisposition();

        // 필요시: 이전 배정 병상 회수 등 구현
        visit.setFinalDisposition(null); // 초기화
        emergencyVisitRepository.save(visit);

        // MedicalHistory 이력
        MedicalHistory history = new MedicalHistory();
        history.setVisitId(visitId);
        history.setContent("[최종 배치 삭제] 이전:" + prevDisposition);
        
        // 임시 강제 세팅
        String currentUserId = "doctor01";
        
        // 테스트일 때만 주석 
        //프론트 연동 시 주석 해제
        //String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        
        history.setUserId(currentUserId);
        medicalHistoryRepository.save(history);
    }

}
