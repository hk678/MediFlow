package kr.bigdata.web.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VitalSignDto {
	
	private Long recordId;            // RECORD_ID
    private String visitId;           // VISIT_ID
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime recordTime; // RECORD_TIME
    
    private Integer hr;               // HR
    private Integer rr;               // RR
    private Double spo2;              // SPO2
    private Integer sbp;              // SBP
    private Integer dbp;              // DBP
    private Double bt;                // BT

}
