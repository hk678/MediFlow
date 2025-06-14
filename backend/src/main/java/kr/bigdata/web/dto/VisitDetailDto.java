package kr.bigdata.web.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VisitDetailDto {
	
	private String visitId;           // VISIT_ID
    private String patientId;         // PATIENT_ID (FK)
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime admissionTime;    // ADMISSION_TIME
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
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
