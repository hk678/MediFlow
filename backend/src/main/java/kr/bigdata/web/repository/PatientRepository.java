package kr.bigdata.web.repository;

import kr.bigdata.web.dto.PatientSummaryDto;
import kr.bigdata.web.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, String> {

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

}
