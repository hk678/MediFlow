package kr.bigdata.web.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AbnormalLabResultDto {
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime labTime;   // 검사시각
    private String testName;         // 검사 항목명 (ex: WBC)
    private Double result;           // 측정값
    private Double minNormal;        // 정상 최소값
    private Double maxNormal;        // 정상 최대값
}
