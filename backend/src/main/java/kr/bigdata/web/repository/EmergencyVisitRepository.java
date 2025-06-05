package kr.bigdata.web.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import kr.bigdata.web.entity.EmergencyVisit;

@Repository
public interface EmergencyVisitRepository extends JpaRepository<EmergencyVisit, String> {
}