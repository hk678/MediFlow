package kr.bigdata.web.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import kr.bigdata.web.entity.EmergencyVisit;

public interface EmergencyVisitRepository extends JpaRepository<EmergencyVisit, String>{

}
