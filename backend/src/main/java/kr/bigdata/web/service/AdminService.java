package kr.bigdata.web.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.bigdata.web.dto.UserDto;
import kr.bigdata.web.entity.User;
import kr.bigdata.web.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 전체 사용자 목록 조회
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // 새 사용자 생성
    public UserDto createUser(UserDto userDto) {
        // 사용자 ID 중복 확인
        if (userRepository.existsByUserId(userDto.getUserId())) {
            throw new IllegalArgumentException("이미 존재하는 사용자 ID입니다: " + userDto.getUserId());
        }

        User user = User.builder()
                .userId(userDto.getUserId())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .userName(userDto.getUserName())
                .userRole(userDto.getUserRole())
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);
        log.info("새 사용자 생성 완료: {}", savedUser.getUserId());
        
        return convertToDto(savedUser);
    }

    // 사용자 정보 수정
    public UserDto updateUser(String userId, UserDto userDto) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + userId));

        // 비밀번호가 제공된 경우에만 업데이트
        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }
        
        user.setUserName(userDto.getUserName());
        user.setUserRole(userDto.getUserRole());

        User updatedUser = userRepository.save(user);
        log.info("사용자 정보 수정 완료: {}", updatedUser.getUserId());
        
        return convertToDto(updatedUser);
    }

    // 사용자 삭제 - 관련 데이터 삭제 X (의료 히스토리는 보존)
    public void deleteUser(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + userId));

        try {
            log.info("사용자 삭제 시작: {}", userId);

            // 사용자 삭제
            userRepository.delete(user);
            log.info("사용자 삭제 완료: {}", userId);
            
        } catch (Exception e) {
            log.error("사용자 삭제 중 오류 발생: {}", userId, e);
            throw new RuntimeException("사용자 삭제에 실패했습니다: " + e.getMessage(), e);
        }
    }

    // User 엔티티를 DTO로 변환
    private UserDto convertToDto(User user) {
        return UserDto.builder()
                .userId(user.getUserId())
                .userName(user.getUserName())
                .userRole(user.getUserRole())
                .createdAt(user.getCreatedAt())
                .lastLogin(user.getLastLogin())
                .build();
    }
}