package kr.bigdata.web.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import kr.bigdata.web.entity.MedicalHistory;

@Repository
public interface MedicalHistoryRepository extends JpaRepository<MedicalHistory, Long> {
    // 필요하다면 여기에 커스텀 쿼리 메소드 추가 가능
}