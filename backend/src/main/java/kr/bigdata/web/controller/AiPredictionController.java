package kr.bigdata.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.bigdata.web.dto.PatientRequest;
import kr.bigdata.web.entity.AiPrediction;
import kr.bigdata.web.entity.EmergencyVisit;
import kr.bigdata.web.service.AiPredictionService;

@RestController
@RequestMapping("/api/visits")
public class AiPredictionController {
	
	private final AiPredictionService aiPredictionService;

    @Autowired
    public AiPredictionController(AiPredictionService aiPredictionService) {
        this.aiPredictionService = aiPredictionService;
    }

    // 1차 예측 (입실 시 자동)
    @PostMapping("/{visitId}/predict/admission")
    public AiPrediction predictAdmission(@PathVariable String visitId) {
        // 입실 예측은 DB의 visitId로 바로 처리 (PatientRequest는 Service에서 내부 생성)
        return aiPredictionService.predictAdmission(visitId);
    }

    // 2차 예측 (퇴실/최종)
    @PostMapping("/{visitId}/predict/discharge")
    public AiPrediction predictDischarge(@PathVariable String visitId) {
        // 퇴실 예측도 visitId로만 처리 (Service에서 LabResults 등 내부 처리)
        return aiPredictionService.predictDischarge(visitId);
    }

    // 예측 결과 조회
    @GetMapping("/{visitId}/predictions")
    public AiPrediction getPrediction(@PathVariable String visitId) {
        return aiPredictionService.getPredictionByVisitId(visitId);
    }
}
