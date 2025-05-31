package kr.bigdata.web.controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import kr.bigdata.web.DTO.LLMResult;
import kr.bigdata.web.DTO.PatientRequest;

@RestController
public class LLMController {
	
	private final String FLASK_URL = "http://127.0.0.1:5000/predict"; // Flask 서버 주소
    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/predictLLM")
    public String predictLLM(@RequestBody PatientRequest patient) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<PatientRequest> requestEntity = new HttpEntity<>(patient, headers);

        // Flask 서버로 POST 요청, 응답 결과 받기
        ResponseEntity<LLMResult> response = restTemplate.postForEntity(
                FLASK_URL, requestEntity, LLMResult.class);
        
     // 콘솔에 결과값 출력!
        System.out.println("LLM 결과: " + response.getBody().result);

        // result만 추출해서 반환 (원하면 가공 가능)
        return response.getBody().result;
    }
    
  

}
