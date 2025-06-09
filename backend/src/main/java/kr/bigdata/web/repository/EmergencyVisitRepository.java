package kr.bigdata.web.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import kr.bigdata.web.dto.VisitSummaryDto;
import kr.bigdata.web.entity.EmergencyVisit;

@Repository
public interface EmergencyVisitRepository extends JpaRepository<EmergencyVisit, String> {

    @Query("SELECT new kr.bigdata.web.dto.VisitSummaryDto(" +
           "e.visitId, e.admissionTime, e.bedNumber, e.acuity, e.pain, e.chiefComplaint, e.arrivalTransport, e.status) " +
           "FROM EmergencyVisit e " +
           "WHERE e.patient.patientId = :patientId " +
           "ORDER BY e.admissionTime DESC")
    List<VisitSummaryDto> findVisitSummariesByPatientId(@Param("patientId") String patientId);
}