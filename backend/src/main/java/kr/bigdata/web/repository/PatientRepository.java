package kr.bigdata.web.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import kr.bigdata.web.dto.PatientSummaryDto;
import kr.bigdata.web.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, String> {

	// 환자 목록 조회
	@Query("""
		    SELECT new kr.bigdata.web.dto.PatientSummaryDto(
		        p.patientId, p.patientName, p.age, p.gender,
		        e.bedNumber, e.acuity, e.chiefComplaint, e.finalDisposition
		    )
		    FROM EmergencyVisit e
		    JOIN e.patient p
		    WHERE e.status = 'ADMITTED'
		""")
		List<PatientSummaryDto> findCurrentlyAdmittedPatients();

	// 환자 검색 (이름, PID)
	@Query("""
		    SELECT new kr.bigdata.web.dto.PatientSummaryDto(
		        p.patientId, p.patientName, p.age, p.gender,
		        e.bedNumber, e.acuity, e.chiefComplaint, e.finalDisposition
		    )
		    FROM EmergencyVisit e
		    JOIN e.patient p
		    WHERE e.status = 'ADMITTED'
		      AND (LOWER(p.patientName) LIKE %:keyword% OR LOWER(p.patientId) LIKE %:keyword%)
		""")
		List<PatientSummaryDto> searchByPatientIdOrName(@Param("keyword") String keyword);

}
