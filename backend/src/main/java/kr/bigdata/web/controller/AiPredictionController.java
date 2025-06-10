package kr.bigdata.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.bigdata.web.dto.AiPredictionResponseDto;
import kr.bigdata.web.entity.AiPrediction;
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
    public AiPredictionResponseDto predictAdmission(@PathVariable String visitId) {
        AiPrediction prediction = aiPredictionService.predictAdmission(visitId);
        return aiPredictionService.toDto(prediction);
    }
    // 2차 예측 (퇴실/최종)
    @PostMapping("/{visitId}/predict/discharge")
    public AiPredictionResponseDto predictDischarge(@PathVariable String visitId) {
        AiPrediction prediction = aiPredictionService.predictDischarge(visitId);
        return aiPredictionService.toDto(prediction);
    }

    // 예측 결과 조회
    @GetMapping("/{visitId}/predictions")
    public AiPredictionResponseDto getPrediction(@PathVariable String visitId) {
        AiPrediction prediction = aiPredictionService.getPredictionByVisitId(visitId);
        return aiPredictionService.toDto(prediction);
    }
}
