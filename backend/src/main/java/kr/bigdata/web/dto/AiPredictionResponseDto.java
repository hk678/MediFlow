package kr.bigdata.web.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class AiPredictionResponseDto {
	
		private Long preId; // AiPrediction PK
		private String preType;
	 	private Integer preDisposition;
	    private Integer preScore;
	    private String reason;
	    private String visitId;   // emergencyVisit.visitId
	    private LocalDateTime preTime;

}

