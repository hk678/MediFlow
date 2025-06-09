package kr.bigdata.web.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.bigdata.web.dto.LLMResult;
import kr.bigdata.web.dto.PatientRequest;
import kr.bigdata.web.entity.AiPrediction;
import kr.bigdata.web.entity.EmergencyVisit;
import kr.bigdata.web.entity.LabResults;
import kr.bigdata.web.entity.Patient;
import kr.bigdata.web.repository.AiPredictionRepository;
import kr.bigdata.web.repository.EmergencyVisitRepository;
import kr.bigdata.web.repository.LabResultsRepository;

@Service
public class AiPredictionService {

    @Autowired
    private EmergencyVisitRepository emergencyVisitRepository;
    @Autowired
    private AiPredictionRepository aiPredictionRepository;
    @Autowired
    private LLMService llmService;
    @Autowired
    private LabResultsRepository labResultsRepository; // 혹시 선언 안 했으면 추가

    // 1차 예측: 입실 시
    public AiPrediction predictAdmission(String visitId) {
        EmergencyVisit visit = emergencyVisitRepository.findById(visitId)
                .orElseThrow(() -> new IllegalArgumentException("방문 정보 없음"));

        Patient patient = visit.getPatient();

        // PatientRequest에 모든 정보 세팅!
        PatientRequest req = new PatientRequest();
        req.setGender(patient.getGender());
        req.setAge(patient.getAge());
        req.setAcuity(visit.getAcuity());
        req.setPain(visit.getPain());
        req.setChiefComplaint(visit.getChiefComplaint());
        req.setArrivalTransport(visit.getArrivalTransport());

        LLMResult llmResult = llmService.predict(req);

        AiPrediction prediction = new AiPrediction();
        prediction.setEmergencyVisit(visit);
        prediction.setPreType("admission");
        prediction.setPreDisposition(Integer.valueOf(llmResult.getDisposition())); // 반드시 int!
        prediction.setPreScore(llmResult.getRiskScore()); // Integer라면 바로 할당!
        prediction.setReason(llmResult.getClinicalReason());
        prediction.setPreTime(java.time.LocalDateTime.now());

        aiPredictionRepository.save(prediction);
        return prediction;
    }

    // 2차 예측: 퇴실/최종
    public AiPrediction predictDischarge(String visitId) {
        EmergencyVisit visit = emergencyVisitRepository.findById(visitId)
                .orElseThrow(() -> new IllegalArgumentException("방문 정보 없음"));
        Patient patient = visit.getPatient();
       
        // 여러 행을 받아옴! ->lab_result 테이블 자체가 여러 row을 갖고 있어서
        List<LabResults> labList = labResultsRepository.findAllByVisitId(visitId);

        // *** PatientRequest에 Lab 값 포함해서 세팅 ***
        PatientRequest req = new PatientRequest();
        req.setGender(patient.getGender());
        req.setAge(patient.getAge());
        req.setAcuity(visit.getAcuity());
        req.setPain(visit.getPain());
        req.setChiefComplaint(visit.getChiefComplaint());
        req.setArrivalTransport(visit.getArrivalTransport());
      
        // 여러 행(labList) 중에서 원하는 행(보통 가장 최근 검사)을 1개만 뽑아 사용 (예시: 최신 행)
        LabResults lab = null;
        if (labList != null && !labList.isEmpty()) {
            lab = labList.stream()
                    .max(java.util.Comparator.comparing(LabResults::getLabTime)) // 검사 시각이 최신인 행
                    .orElse(null);
        }

        if (lab != null) {
            req.setHemoglobin(lab.getHemoglobin());
            req.setWbc(lab.getWbc());
            req.setPlateletCount(lab.getPlateletCount());
            req.setRedBloodCells(lab.getRedBloodCells());
            req.setSedimentationRate(lab.getSedimentationRate());
            req.setNa(lab.getNa());
            req.setK(lab.getK());
            req.setChloride(lab.getChloride());
            req.setCa(lab.getCa());
            req.setMg(lab.getMg());
            req.setUreaNitrogen(lab.getUreaNitrogen());
            req.setCreatinine(lab.getCreatinine());
            req.setAst(lab.getAst());
            req.setAlt(lab.getAlt());
            req.setBilirubin(lab.getBilirubin());
            req.setAlbumin(lab.getAlbumin());
            req.setAp(lab.getAp());
            req.setGgt(lab.getGgt());
            req.setLd(lab.getLd());
            req.setAmmonia(lab.getAmmonia());
            req.setGlucose(lab.getGlucose());
            req.setLactate(lab.getLactate());
            req.setAcetone(lab.getAcetone());
            req.setBhb(lab.getBhb());
            req.setCrp(lab.getCrp());
            req.setPt(lab.getPt());
            req.setInrPt(lab.getInrPt());
            req.setPtt(lab.getPtt());
            req.setDDimer(lab.getDDimer());
            req.setTroponinT(lab.getTroponinT());
            req.setCk(lab.getCk());
            req.setCkmb(lab.getCkmb());
            req.setNtprobnp(lab.getNtprobnp());
            req.setAmylase(lab.getAmylase());
            req.setLipase(lab.getLipase());
            req.setPh(lab.getPh());
            req.setPco2(lab.getPco2());
            req.setPo2(lab.getPo2());
            req.setCtco2(lab.getCtco2());
            req.setBcb(lab.getBcb());
        }

        LLMResult llmResult = llmService.predictDischarge(req);

        AiPrediction prediction = new AiPrediction();
        prediction.setEmergencyVisit(visit);
        prediction.setPreType("discharge");
        prediction.setPreDisposition(Integer.valueOf(llmResult.getDisposition())); // int로!
        prediction.setPreScore(llmResult.getRiskScore()); // Integer라면 바로 할당!
        prediction.setReason(llmResult.getClinicalReason());
        prediction.setPreTime(java.time.LocalDateTime.now());

        aiPredictionRepository.save(prediction);
        return prediction;
    }
    
    public AiPrediction getPredictionByVisitId(String visitId) {
        return aiPredictionRepository.findTopByEmergencyVisit_VisitIdOrderByPreTimeDesc(visitId)
                .orElseThrow(() -> new IllegalArgumentException("예측 결과 없음"));
    }

}
