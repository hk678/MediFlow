package kr.bigdata.web.controller;

import java.util.Map;

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
import kr.bigdata.web.dto.LoginRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	
	private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
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
            
            // 세션/쿠키, JWT 발급 등 필요하면 추가
            return ResponseEntity.ok().body(Map.of("message", "로그인 성공!"));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "로그인 실패!"));
        }
    }

}
