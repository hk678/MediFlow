package kr.bigdata.web.controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import kr.bigdata.web.dto.LLMResult;
import kr.bigdata.web.dto.PatientRequest;

@RestController
public class LLMController {

    private static final String FLASK_URL = "http://127.0.0.1:5000/predict"; // Flask 서버 주소
    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/predictLLM")
    public String predictLLM(@RequestBody PatientRequest patient) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<PatientRequest> requestEntity = new HttpEntity<>(patient, headers);

        // Flask 서버로 POST 요청, 응답 결과 받기
        ResponseEntity<LLMResult> response = restTemplate.postForEntity(FLASK_URL, requestEntity, LLMResult.class);

        LLMResult body = response.getBody();
        if (body == null ||
            body.getRiskScore() == null ||
            body.getDisposition() == null ||
            body.getClinicalReason() == null) {
            return "No result";
        }

        // 콘솔에 결과값 출력 (여기서 getResult()를 쓰면 안 됨!!)
        System.out.println("LLM 결과: riskScore=" + body.getRiskScore()
            + ", disposition=" + body.getDisposition()
            + ", clinicalReason=" + body.getClinicalReason());

        // 원하는 형식으로 반환 (아래는 예시)
        return "riskScore: " + body.getRiskScore()
            + ", disposition: " + body.getDisposition()
            + ", clinicalReason: " + body.getClinicalReason();

    }
}
