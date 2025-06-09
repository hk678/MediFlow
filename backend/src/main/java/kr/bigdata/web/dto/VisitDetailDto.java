package kr.bigdata.web.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VisitDetailDto {
	
	private String visitId;           // VISIT_ID
    private String patientId;         // PATIENT_ID (FK)
    private LocalDateTime admissionTime;    // ADMISSION_TIME
    private LocalDateTime dischargeTime;    // DISCHARGE_TIME
    private int acuity;               // ACUITY
    private int pain;                 // PAIN
    private String chiefComplaint;    // CHIEF_COMPLAINT
    private String arrivalTransport;  // ARRIVAL_TRANSPORT
    private String diagnosis;         // DIAGNOSIS
    private Integer finalDisposition; // FINAL_DISPOSITION
    private String bedNumber;         // BED_NUMBER
    private String status;            // STATUS

}
