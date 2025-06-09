package kr.bigdata.web.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import kr.bigdata.web.entity.AiPrediction;
import kr.bigdata.web.entity.EmergencyVisit;

public interface AiPredictionRepository extends JpaRepository<AiPrediction, Long> {

    // 1. 특정 방문 전체 예측 결과 조회 (EmergencyVisit FK 기준)
    List<AiPrediction> findByEmergencyVisit(EmergencyVisit emergencyVisit);

    // 2. visitId(문자열) 기준 최신 예측 결과 (Optional)
    Optional<AiPrediction> findTopByEmergencyVisit_VisitIdOrderByPreTimeDesc(String visitId);

    // 3. (선택) visitId, preType 조건으로 예측 결과
    List<AiPrediction> findByEmergencyVisit_VisitIdAndPreType(String visitId, String preType);

    // 4. (선택) 데일리 평균 점수 통계 (Raw Object[] 반환)
    @Query("""
        SELECT 
            FUNCTION('DATE_FORMAT', p.preTime, '%Y-%m-%d') as date,
            AVG(CAST(p.preScore AS double)) as averageScore
        FROM AiPrediction p
        WHERE p.preScore IS NOT NULL
        GROUP BY FUNCTION('DATE_FORMAT', p.preTime, '%Y-%m-%d')
        ORDER BY FUNCTION('DATE_FORMAT', p.preTime, '%Y-%m-%d')
        """)
    List<Object[]> getDailyAveragePreScoreRaw();
}
