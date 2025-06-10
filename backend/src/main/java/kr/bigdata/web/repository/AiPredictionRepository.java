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

    // 1. 특정 방문 전체 예측 결과 조회 (EmergencyVisit FK 기준)
    List<AiPrediction> findByEmergencyVisit(EmergencyVisit emergencyVisit);

    // 2. visitId(문자열) 기준 최신 예측 결과 (Optional)
    Optional<AiPrediction> findTopByEmergencyVisit_VisitIdOrderByPreTimeDesc(String visitId);

    // 3. (선택) visitId, preType 조건으로 예측 결과
    List<AiPrediction> findByEmergencyVisit_VisitIdAndPreType(String visitId, String preType);

    // 가장 최신 퇴실 예측 1건만 조회
    Optional<AiPrediction> findTopByEmergencyVisit_VisitIdAndPreTypeOrderByPreTimeDesc(String visitId, String preType);
    
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
