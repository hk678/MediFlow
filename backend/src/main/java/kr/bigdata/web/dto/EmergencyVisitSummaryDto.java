package kr.bigdata.web.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmergencyVisitSummaryDto {
	
	private String visitId;
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime admissionTime;
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dischargeTime;
    private String bedNumber;
    private int acuity;
    private int pain;
    private String chiefComplaint;
    private String arrivalTransport;
    private String status;
    private int finalDisposition;

}
