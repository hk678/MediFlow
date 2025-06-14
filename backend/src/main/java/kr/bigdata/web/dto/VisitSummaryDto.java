package kr.bigdata.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

@Data
@AllArgsConstructor
public class VisitSummaryDto {
	private String visitId; // 새로 추가
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime admissionTime;
    private String bedNumber;
    private int acuity;
    private Integer pain;
    private String chiefComplaint;
    private String arrivalTransport;
    private String status;
}
