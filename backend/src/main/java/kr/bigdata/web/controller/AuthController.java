package kr.bigdata.web.controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.bigdata.web.dto.LoginRequest;
import kr.bigdata.web.entity.User;
import kr.bigdata.web.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	
	private final AuthenticationManager authenticationManager;
	private final UserRepository userRepository;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager,
    		UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        try {
            UsernamePasswordAuthenticationToken token =
                new UsernamePasswordAuthenticationToken(loginRequest.getUserId(), loginRequest.getPassword());
            Authentication authentication = authenticationManager.authenticate(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // **여기서 세션 강제 생성**
            request.getSession(true); // 세션이 없으면 새로 만든다
            
           // 1. 유저 객체 조회 (★반환 타입이 Optional★)
            Optional<User> userOpt = userRepository.findByUserId(loginRequest.getUserId());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                // 2. 현재 시각으로 lastLogin 업데이트
                user.setLastLogin(LocalDateTime.now());
                userRepository.save(user);
            }

            
            return ResponseEntity.ok().body(Map.of("message", "로그인 성공!"));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "로그인 실패!"));
        }
    }



}
