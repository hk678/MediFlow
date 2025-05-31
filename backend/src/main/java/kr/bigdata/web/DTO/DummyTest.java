package kr.bigdata.web.DTO;

import java.util.List;
import java.util.Map;
import java.io.File;


import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.core.type.TypeReference;


import com.fasterxml.jackson.databind.ObjectMapper;

public class DummyTest {
	public static void main(String[] args) throws Exception {
        // 1. 더미 데이터 읽기 (resources 폴더라면 경로 주의!)
        ObjectMapper mapper = new ObjectMapper();
        List<Map<String, Object>> patients = mapper.readValue(
                new File("src/main/resources/dummy_patients.json"),
                new TypeReference<List<Map<String, Object>>>() {}
        );

        RestTemplate restTemplate = new RestTemplate();

        // 2. 한 명씩 Flask 서버에 POST
        for (int i = 0; i < patients.size(); i++) {
            Map<String, Object> patient = patients.get(i);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(patient, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    "http://localhost:5000/predict", request, String.class);

            System.out.println("[" + (i+1) + "] 입력: " + patient);
            System.out.println("결과: " + response.getBody());
            System.out.println("-----");
        }
    }

}
