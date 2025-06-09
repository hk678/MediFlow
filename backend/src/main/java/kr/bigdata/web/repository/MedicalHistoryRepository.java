package kr.bigdata.web.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import kr.bigdata.web.entity.MedicalHistory;

@Repository
public interface MedicalHistoryRepository extends JpaRepository<MedicalHistory, Long> {

    // 1. 특정 방문(visitId)의 모든 히스토리 최신순 조회
    List<MedicalHistory> findByVisitIdOrderByRecordTimeDesc(String visitId);

    // 2. (Optional) 특정 방문 히스토리 페이징 쿼리 (필요하면 사용)
    @Query("SELECT h FROM MedicalHistory h WHERE h.visitId = :visitId ORDER BY h.recordTime DESC")
    List<MedicalHistory> findByVisitIdWithPaging(@Param("visitId") String visitId);

    // 3. 특정 사용자가 작성한 히스토리 최신순 조회
    List<MedicalHistory> findByUserIdOrderByRecordTimeDesc(String userId);

    // 4. 특정 방문+사용자 기준 히스토리 최신순 조회
    List<MedicalHistory> findByVisitIdAndUserIdOrderByRecordTimeDesc(String visitId, String userId);
}