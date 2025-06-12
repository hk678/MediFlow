package kr.bigdata.web.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import kr.bigdata.web.entity.AiPrediction;
import kr.bigdata.web.entity.EmergencyVisit;

public interface AiPredictionRepository extends JpaRepository<AiPrediction, Long> {

	// visitId + preType으로 예측 결과 "1개만" 조회 (없으면 Optional.empty)
	Optional<AiPrediction> findByEmergencyVisit_VisitIdAndPreType(String visitId, String preType);

	// 상세페이지에 들어갈 1차 예측 조회  visitId + preType 조건 조회
	Optional<AiPrediction> findTopByEmergencyVisit_VisitIdAndPreTypeOrderByPreTimeDesc(String visitId, String preType);

	// 특정 방문에 대한 모든 예측 기록(이력)이 필요할 때 사용
	List<AiPrediction> findByEmergencyVisit(EmergencyVisit emergencyVisit);

	// visitId로 최신 예측 1건만 보고 싶을 때 사용
	Optional<AiPrediction> findTopByEmergencyVisit_VisitIdOrderByPreTimeDesc(String visitId);
	
	@Query(value = """
			SELECT
			    FLOOR(pre_score / 10) * 10 as score_range,
			    COUNT(*) as count
			FROM ai_prediction
			WHERE pre_time BETWEEN :startDate AND :endDate
			  AND pre_score IS NOT NULL
			GROUP BY FLOOR(pre_score / 10) * 10
			ORDER BY score_range
			""", nativeQuery = true)
	List<Object[]> getWeeklyScoreStats(@Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate);
}
