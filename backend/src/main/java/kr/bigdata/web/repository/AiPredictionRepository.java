package kr.bigdata.web.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import kr.bigdata.web.entity.AiPrediction;
import kr.bigdata.web.entity.EmergencyVisit;

public interface AiPredictionRepository extends JpaRepository<AiPrediction, Long> {
	    // 예측 결과 조회
	    AiPrediction findByEmergencyVisit(EmergencyVisit emergencyVisit);
	    
	    Optional<AiPrediction> findTopByEmergencyVisit_VisitIdOrderByPreTimeDesc(String visitId);

}
