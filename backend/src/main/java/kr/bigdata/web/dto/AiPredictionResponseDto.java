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
	    
	    // 상세페이지 입,퇴실 예측 옆 가용 병상수 노출
	    // 귀가면 null
	    private Integer availableBeds; 
	    private Integer totalBeds;     

}
