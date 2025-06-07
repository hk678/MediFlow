package kr.bigdata.web.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import kr.bigdata.web.entity.AiPrediction;

public interface AiPredictionRepository extends JpaRepository<AiPrediction, Long> {

	// 데일리 점수 통계
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