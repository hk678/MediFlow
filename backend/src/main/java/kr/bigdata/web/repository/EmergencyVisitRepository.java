package kr.bigdata.web.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import kr.bigdata.web.entity.EmergencyVisit;

public interface EmergencyVisitRepository extends JpaRepository<EmergencyVisit, String> {

	 // 변경 전 (오류남)
    // Optional<EmergencyVisit> findTopByPatientIdOrderByAdmissionTimeDesc(String patientId);

    // 변경 후 (정상 동작)
    Optional<EmergencyVisit> findTopByPatient_PatientIdOrderByAdmissionTimeDesc(String patientId);

    List<EmergencyVisit> findByPatient_PatientIdOrderByAdmissionTimeDesc(String patientId);
}
