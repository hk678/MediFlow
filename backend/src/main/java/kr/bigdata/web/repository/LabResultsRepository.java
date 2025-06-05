package kr.bigdata.web.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import kr.bigdata.web.entity.EmergencyVisit;
import kr.bigdata.web.entity.LabResults;

public interface LabResultsRepository extends JpaRepository<LabResults, Long> {
    List<LabResults> findAllByVisitId(String visitId);
}