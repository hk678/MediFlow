package kr.bigdata.web.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import kr.bigdata.web.dto.DailyScoreStatDto;
import kr.bigdata.web.dto.UserDto;
import kr.bigdata.web.repository.AiPredictionRepository;
import kr.bigdata.web.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final AdminService adminService;
    private final AiPredictionRepository aiPredictionRepository;
    
    // 사용자 목록 조회
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getUsers() {
        log.info("사용자 목록 조회 요청");
        List<UserDto> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // 사용자 정보 추가
    @PostMapping("/users")
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto, HttpServletRequest request) {

        // 입력 데이터 검증 로그
        if (userDto != null) {
            log.info("UserId: {}", userDto.getUserId());
            log.info("UserName: {}", userDto.getUserName());
            log.info("UserRole: '{}'", userDto.getUserRole()); // 공백이나 특수문자 확인용
            log.info("Password length: {}", userDto.getPassword() != null ? userDto.getPassword().length() : "null");
        }
        
        try {
            UserDto createdUser = adminService.createUser(userDto);
            return ResponseEntity.ok(createdUser);
        } catch (IllegalArgumentException e) {
            log.error("입력 데이터 유효성 검사 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("사용자 생성 중 오류 발생: ", e);
            throw e;
        }
    }
    
    // 사용자 정보 수정
    @PutMapping("/users/{userId}")
    public ResponseEntity<UserDto> updateUser(@PathVariable String userId, @RequestBody UserDto userDto) {
    	log.info("사용자 정보 수정 요청: {}", userId);
    	try {
    		UserDto updatedUser = adminService.updateUser(userId, userDto);
    		return ResponseEntity.ok(updatedUser);
    	} catch (IllegalArgumentException e) {
    		log.error("사용자 수정 요청 오류: {}", e.getMessage());
    		return ResponseEntity.badRequest().build();
    	}
    }

    // 사용자 정보 삭제
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId, HttpServletRequest request) {

        try {
            adminService.deleteUser(userId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            log.error("사용자 삭제 요청 오류: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("사용자 삭제 중 오류 발생: ", e);
            throw e;
        }
    }
    
    // 데일리 점수 통계
    @GetMapping("/daily")
    public List<DailyScoreStatDto> getDailyStats() {
        List<Object[]> results = aiPredictionRepository.getDailyAveragePreScoreRaw();
        return results.stream()
                .map(row -> new DailyScoreStatDto(
                    (String) row[0], 
                    ((Number) row[1]).doubleValue()
                ))
                .collect(Collectors.toList());
    }

}