package kr.bigdata.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class VisitSummaryDto {
	private LocalDateTime admissionTime;
    private String bedNumber;
    private int acuity;
    private Integer pain;
    private String chiefComplaint;
    private String arrivalTransport;
    private String status;
}
