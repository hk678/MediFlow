package kr.bigdata.web.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PatientDetailDto {
	
	private String patientId;        // 환자 고유 ID
    private String patientName;      // 이름
    private int gender;          // 성별 (0:남, 1:여)
    private int age;             // 나이   
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt; // 등록일시
    // 최근 방문(ADM) 정보
    private String visitId;            // 방문 고유 ID
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
    private int finalDisposition;  // 귀가, 일반, ICU 구분값
    private String diagnosis;

   
}

