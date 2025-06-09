package kr.bigdata.web.controller;

import kr.bigdata.web.dto.MedicalHistoryDto;
import kr.bigdata.web.service.MedicalHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class MedicalHistoryController {
	
    private final MedicalHistoryService medicalHistoryService;
    
    // 특정 방문의 히스토리 조회
    // GET /api/visits/{visitId}/history
    @GetMapping("/visits/{visitId}/history")
    public ResponseEntity<List<MedicalHistoryDto.Response>> getHistory(@PathVariable String visitId) {
        log.info("GET /api/visits/{}/history", visitId);
        
        try {
            List<MedicalHistoryDto.Response> histories = medicalHistoryService.getHistoryByVisitId(visitId);
            return ResponseEntity.ok(histories);
        } catch (Exception e) {
            log.error("에러: {}", visitId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 히스토리 추가
    // POST /api/visits/{visitId}/history
    @PostMapping("/visits/{visitId}/history")
    public ResponseEntity<MedicalHistoryDto.Response> addHistory(
            @PathVariable String visitId,
            @RequestBody MedicalHistoryDto.CreateRequest request,
            HttpSession session) {
        
        log.info("POST /api/visits/{}/history", visitId);
        
        try {
        	
            // 세션에서 사용자 ID 가져오기
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(401).build();
            }
        	// String userId = "doctor01";
            
            // 요청 내용 검증
            if (request.getContent() == null || request.getContent().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            MedicalHistoryDto.Response response = medicalHistoryService.addHistory(visitId, userId, request);
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            log.error("에러: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("에러: {}", visitId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 히스토리 수정
    // PUT /api/history/{historyId}
    @PutMapping("/history/{historyId}")
    public ResponseEntity<MedicalHistoryDto.Response> updateHistory(
            @PathVariable Long historyId,
            @RequestBody MedicalHistoryDto.UpdateRequest request,
            HttpSession session) {
        
        log.info("PUT /api/history/{}", historyId);
        
        try {
            // 세션에서 사용자 ID 가져오기
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(401).build();
            }
        	// String userId = "doctor01";
            
            // 요청 내용 검증
            if (request.getContent() == null || request.getContent().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            MedicalHistoryDto.Response response = medicalHistoryService.updateHistory(historyId, userId, request);
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            log.error("에러: {}", e.getMessage());
            if (e.getMessage().contains("본인이 작성한")) {
                return ResponseEntity.status(403).build();
            }
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("에러: {}", historyId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 히스토리 삭제
    // DELETE /api/history/{historyId}
    @DeleteMapping("/history/{historyId}")
    public ResponseEntity<Void> deleteHistory(
            @PathVariable Long historyId,
            HttpSession session) {
        
        log.info("DELETE /api/history/{}", historyId);
        
        try {
            // 세션에서 사용자 ID 가져오기
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(401).build();
            }
        	// String userId = "doctor01";
            
            medicalHistoryService.deleteHistory(historyId, userId);
            return ResponseEntity.ok().build();
            
        } catch (RuntimeException e) {
            log.error("에러: {}", e.getMessage());
            if (e.getMessage().contains("본인이 작성한")) {
                return ResponseEntity.status(403).build();
            }
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("에러: {}", historyId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
