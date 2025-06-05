package kr.bigdata.web.repository;

import kr.bigdata.web.entity.MedicalHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalHistoryRepository extends JpaRepository<MedicalHistory, Long> {
    
    // 특정 방문의 모든 히스토리를 최신순으로 조회
    List<MedicalHistory> findByVisitIdOrderByRecordTimeDesc(String visitId);
    
    // 특정 방문의 히스토리를 페이징하여 조회
    @Query("SELECT h FROM MedicalHistory h WHERE h.visitId = :visitId ORDER BY h.recordTime DESC")
    List<MedicalHistory> findByVisitIdWithPaging(@Param("visitId") String visitId);
    
    // 특정 사용자가 작성한 히스토리 조회
    List<MedicalHistory> findByUserIdOrderByRecordTimeDesc(String userId);

    // 특정 방문과 사용자의 히스토리 조회
    List<MedicalHistory> findByVisitIdAndUserIdOrderByRecordTimeDesc(String visitId, String userId);
}