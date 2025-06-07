package kr.bigdata.web.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import kr.bigdata.web.entity.LabResults;

public interface LabResultsRepository extends JpaRepository<LabResults, Long> {
    List<LabResults> findAllByVisitId(String visitId); // AiPredictionService 메서드
    List<LabResults> findByVisitIdOrderByLabTimeDesc(String visitId); // LabResultsController 메서드



}