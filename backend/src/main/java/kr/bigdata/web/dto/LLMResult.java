package kr.bigdata.web.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class LLMResult {
	
		@JsonProperty("risk_score")
	    private Integer riskScore;
	    private Integer disposition;
	    @JsonProperty("clinical_reason")
	    private String clinicalReason;
	   
}

