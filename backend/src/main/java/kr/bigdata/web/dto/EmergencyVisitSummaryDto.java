package kr.bigdata.web.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmergencyVisitSummaryDto {
	
	private String visitId;
    private LocalDateTime admissionTime;
    private LocalDateTime dischargeTime;
    private String bedNumber;
    private int acuity;
    private int pain;
    private String chiefComplaint;
    private String arrivalTransport;
    private String status;
    private int finalDisposition;

}
