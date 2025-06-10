package kr.bigdata.web.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import kr.bigdata.web.dto.LLMResult;
import kr.bigdata.web.dto.PatientRequest;
import kr.bigdata.web.entity.EmergencyVisit;
import kr.bigdata.web.dto.LLMResultWrapper;



@Service
public class LLMService {
	
	private final String FLASK_URL = "http://127.0.0.1:5000/predict/admission";
    private final String FLASK_DISCHARGE_URL = "http://127.0.0.1:5000/predict/discharge";
    private final RestTemplate restTemplate = new RestTemplate();

 // 1차 예측 (입실용)
    public LLMResult predict(PatientRequest req) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<PatientRequest> requestEntity = new HttpEntity<>(req, headers);

        ResponseEntity<LLMResultWrapper> response = restTemplate.postForEntity(
            FLASK_URL, requestEntity, LLMResultWrapper.class
        );
        LLMResult llmResult = response.getBody().getResult();
        System.out.println("1차 예측: " + llmResult.getRiskScore()
            + ", " + llmResult.getDisposition()
            + ", " + llmResult.getClinicalReason());
        return llmResult;
    }

    // 2차 예측 (퇴실/최종 배치용)
    public LLMResult predictDischarge(PatientRequest req) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<PatientRequest> requestEntity = new HttpEntity<>(req, headers);

        ResponseEntity<LLMResultWrapper> response = restTemplate.postForEntity(
            FLASK_DISCHARGE_URL, requestEntity, LLMResultWrapper.class
        );
        LLMResult llmResult = response.getBody().getResult();
        System.out.println("최종 예측: " + llmResult.getRiskScore()
            + ", " + llmResult.getDisposition()
            + ", " + llmResult.getClinicalReason());
        return llmResult;
    }
}
