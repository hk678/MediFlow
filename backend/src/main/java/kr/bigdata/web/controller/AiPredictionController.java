package kr.bigdata.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.bigdata.web.dto.AiPredictionResponseDto;
import kr.bigdata.web.entity.AiPrediction;
import kr.bigdata.web.entity.AvailableBeds;
import kr.bigdata.web.repository.AvailableBedsRepository;
import kr.bigdata.web.service.AiPredictionService;
import kr.bigdata.web.service.BedInfoService;

@CrossOrigin(origins = "http://localhost:3000")
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
        return aiPredictionService.toDtoWithBeds(prediction); // 한 번에 DTO 완성!
    }
    
    // 상세페이지에서 1차 예측만 조회
    @GetMapping("/{visitId}/predictions/admission")
    public AiPredictionResponseDto getAdmissionPrediction(@PathVariable String visitId) {
        AiPrediction prediction = aiPredictionService.getPredictionByVisitIdAndPreType(visitId, "admission");
        return aiPredictionService.toDtoWithBeds(prediction);
    }
    
    // 2차 예측
    @PostMapping("/{visitId}/predict/discharge")
    public AiPredictionResponseDto predictDischarge(@PathVariable String visitId) {
        AiPrediction prediction = aiPredictionService.predictDischarge(visitId);
        return aiPredictionService.toDtoWithBeds(prediction);
    }

    // 예측 결과 조회
    @GetMapping("/{visitId}/predictions")
    public AiPredictionResponseDto getDischargePrediction(@PathVariable String visitId) {
        AiPrediction prediction = aiPredictionService.getPredictionByVisitIdAndPreType(visitId, "discharge");
        return aiPredictionService.toDtoWithBeds(prediction);
    }
}