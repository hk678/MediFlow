package kr.bigdata.web.service;

import kr.bigdata.web.dto.MedicalHistoryDto;
import kr.bigdata.web.entity.MedicalHistory;
import kr.bigdata.web.entity.User;
import kr.bigdata.web.repository.MedicalHistoryRepository;
import kr.bigdata.web.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class MedicalHistoryService {
    
    private final MedicalHistoryRepository medicalHistoryRepository;
    private final UserRepository userRepository;
    
    // 특정 방문의 히스토리 목록 조회
    public List<MedicalHistoryDto.Response> getHistoryByVisitId(String visitId) {
        log.info("Getting medical history for visit: {}", visitId);
        
        List<MedicalHistory> histories = medicalHistoryRepository.findByVisitIdOrderByRecordTimeDesc(visitId);
        
        return histories.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }
    
    // 히스토리 추가
    @Transactional
    public MedicalHistoryDto.Response addHistory(String visitId, String userId, MedicalHistoryDto.CreateRequest request) {
        log.info("Adding medical history for visit: {}, user: {}", visitId, userId);
        
        // 사용자 존재 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + userId));
        
        MedicalHistory history = MedicalHistory.builder()
                .visitId(visitId)
                .userId(userId)
                .content(request.getContent())
                .recordTime(LocalDateTime.now())
                .build();
        
        MedicalHistory savedHistory = medicalHistoryRepository.save(history);
        
        return convertToResponseDto(savedHistory, user);
    }
    
    // 히스토리 수정
    @Transactional
    public MedicalHistoryDto.Response updateHistory(Long historyId, String userId, MedicalHistoryDto.UpdateRequest request) {
        log.info("Updating medical history: {}, user: {}", historyId, userId);
        
        MedicalHistory history = medicalHistoryRepository.findById(historyId)
                .orElseThrow(() -> new RuntimeException("히스토리를 찾을 수 없습니다: " + historyId));
        
        // 프론트 연결을 위해 잠시 주석처리
        // 작성자 본인만 수정 가능하도록 체크
//        if (!history.getUserId().equals(userId)) {
//            throw new RuntimeException("본인이 작성한 히스토리만 수정할 수 있습니다.");
//        }
        
        history.setContent(request.getContent());
        MedicalHistory updatedHistory = medicalHistoryRepository.save(history);
        
        return convertToResponseDto(updatedHistory);
    }
    
    // 히스토리 삭제
    @Transactional
    public void deleteHistory(Long historyId, String userId) {
        log.info("Deleting medical history: {}, user: {}", historyId, userId);
        
        MedicalHistory history = medicalHistoryRepository.findById(historyId)
                .orElseThrow(() -> new RuntimeException("히스토리를 찾을 수 없습니다: " + historyId));
        
        //프론트 연결을 위해 잠시 주석처리
        // 작성자 본인만 삭제 가능하도록 체크
//        if (!history.getUserId().equals(userId)) {
//            throw new RuntimeException("본인이 작성한 히스토리만 삭제할 수 있습니다.");
//        }
        
        medicalHistoryRepository.deleteById(historyId);
    }
    
    // MedicalHistory Entity를 Response DTO로 변환
    private MedicalHistoryDto.Response convertToResponseDto(MedicalHistory history) {
        // User 정보를 별도로 조회
        User user = userRepository.findById(history.getUserId()).orElse(null);
        return convertToResponseDto(history, user);
    }
    
    // MedicalHistory Entity를 Response DTO로 변환 (User 정보 포함)
    private MedicalHistoryDto.Response convertToResponseDto(MedicalHistory history, User user) {
        return MedicalHistoryDto.Response.builder()
                .historyId(history.getHistoryId())
                .visitId(history.getVisitId())
                .userId(history.getUserId())
                .userName(user != null ? user.getUserName() : "Unknown")
                .userRole(user != null ? user.getUserRole() : "Unknown")
                .recordTime(history.getRecordTime())
                .content(history.getContent())
                .build();
    }
}