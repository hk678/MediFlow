package kr.bigdata.web.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.bigdata.web.entity.EmergencyVisit;
import kr.bigdata.web.entity.MedicalHistory;
import kr.bigdata.web.repository.EmergencyVisitRepository;
import kr.bigdata.web.repository.MedicalHistoryRepository;

@Service
public class EmergencyVisitService {
	
	@Autowired
    private EmergencyVisitRepository emergencyVisitRepository;

    @Autowired
    private MedicalHistoryRepository medicalHistoryRepository;

    // 최종 배치 확정/수정/퇴실 처리 로직
    public void finalizeDisposition(String visitId, Integer disposition, String reason) {
        // 1. EMERGENCY_VISIT 테이블에서 방문 정보 찾기
        Optional<EmergencyVisit> optVisit = emergencyVisitRepository.findById(visitId);
        if (!optVisit.isPresent()) {
            throw new IllegalArgumentException("방문 정보를 찾을 수 없습니다: " + visitId);
        }
        EmergencyVisit visit = optVisit.get();

        // 2. FINAL_DISPOSITION(최종 배치) 업데이트
        visit.setFinalDisposition(disposition);

        // 3. disposition이 0(퇴원)이면 퇴실 처리
        if (disposition != null && disposition == 0) {
            visit.setStatus("DISCHARGED");            // 퇴실 상태로 변경
            visit.setDischargeTime(LocalDateTime.now()); // 퇴실 시간 기록
        }

        // 4. DB에 저장
        emergencyVisitRepository.save(visit);

        // 5. reason(사유)이 있으면 MedicalHistory에 이력 남기기
        if (reason != null && !reason.trim().isEmpty()) {
            MedicalHistory history = new MedicalHistory();
            history.setVisitId(visitId);
            history.setContent("[최종 배치 사유] " + reason);
            // 필요하면 작성자(userId)도 추가!
            medicalHistoryRepository.save(history);
        }
    }

}
