package kr.bigdata.web.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import kr.bigdata.web.entity.VitalSigns;

public interface VitalSignsRepository extends JpaRepository<VitalSigns, Long> {
    // VISIT_ID 기준으로 내림차순 정렬
    List<VitalSigns> findByVisitIdOrderByRecordTimeDesc(String visitId);
}