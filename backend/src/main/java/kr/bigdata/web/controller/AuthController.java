package kr.bigdata.web.controller;

import java.time.LocalDateTime;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
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

	// 로그인
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
		try {
			System.out.println("로그인 시도: " + loginRequest.getUserId());

			// 인증 토큰 생성
			UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
					loginRequest.getUserId(), loginRequest.getPassword());

			// 요청 세부정보 설정 (IP, 세션 ID 등)
			token.setDetails(new WebAuthenticationDetails(request));

			// 인증 수행
			Authentication authentication = authenticationManager.authenticate(token);

			System.out.println("인증 성공: " + authentication.getName());
			System.out.println("권한: " + authentication.getAuthorities());

			// SecurityContext에 인증 정보 설정
			SecurityContextHolder.getContext().setAuthentication(authentication);

			// 세션 생성 및 SecurityContext 저장
			HttpSession session = request.getSession(true);
			session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

			// 추가적으로 사용자 정보도 세션에 저장
			session.setAttribute("USER_ID", authentication.getName());
			session.setAttribute("USER_AUTHORITIES", authentication.getAuthorities());

			System.out.println("세션 ID: " + session.getId());
			System.out.println("세션에 저장됨 - USER_ID: " + session.getAttribute("USER_ID"));

			return ResponseEntity.ok().body(Map.of("message", "로그인 성공!", "username", authentication.getName(),
					"authorities", authentication.getAuthorities(), "sessionId", session.getId()));
		} catch (Exception e) {
			System.out.println("로그인 실패: " + e.getMessage());
			e.printStackTrace();
			return ResponseEntity.status(401).body(Map.of("message", "로그인 실패: " + e.getMessage()));
		}
	}

	// 로그아웃
	@PostMapping("/logout")
	public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
		try {
			System.out.println("로그아웃 요청 시작");

			// 현재 인증 정보 확인
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (auth != null) {
				System.out.println("현재 인증된 사용자: " + auth.getName());
			}

			// 세션 정보 확인 및 무효화
			HttpSession session = request.getSession(false);
			if (session != null) {
				System.out.println("로그아웃 - 세션 무효화: " + session.getId());

				// 세션에서 사용자 정보 제거
				session.removeAttribute("USER_ID");
				session.removeAttribute("USER_AUTHORITIES");
				session.removeAttribute("SPRING_SECURITY_CONTEXT");

				// 세션 무효화
				session.invalidate();
			} else {
				System.out.println("세션이 존재하지 않음");
			}

			// SecurityContext 클리어
			SecurityContextHolder.clearContext();
			System.out.println("SecurityContext 클리어됨");

			// JSESSIONID 쿠키 삭제 (여러 경로에 대해)
			jakarta.servlet.http.Cookie[] cookies = { new jakarta.servlet.http.Cookie("JSESSIONID", null),
					new jakarta.servlet.http.Cookie("JSESSIONID", null) };

			// 루트 경로 쿠키 삭제
			cookies[0].setPath("/");
			cookies[0].setHttpOnly(true);
			cookies[0].setMaxAge(0);
			response.addCookie(cookies[0]);

			// API 경로 쿠키 삭제
			cookies[1].setPath("/api");
			cookies[1].setHttpOnly(true);
			cookies[1].setMaxAge(0);
			response.addCookie(cookies[1]);

			System.out.println("로그아웃 완료");

			return ResponseEntity.ok().body(Map.of("message", "로그아웃 성공!", "timestamp", System.currentTimeMillis()));

		} catch (Exception e) {
			System.out.println("로그아웃 오류: " + e.getMessage());
			e.printStackTrace();
			return ResponseEntity.status(500).body(Map.of("message", "로그아웃 처리 중 오류가 발생했습니다.", "error", e.getMessage()));
		}
	}

	// 세션 상태 확인
	@GetMapping("/status")
	public ResponseEntity<?> getAuthStatus(HttpServletRequest request) {
		try {
			HttpSession session = request.getSession(false);
			System.out.println("현재 세션 ID: " + (session != null ? session.getId() : "null"));

			if (session != null) {
				// 세션에서 사용자 정보 직접 확인
				String userId = (String) session.getAttribute("USER_ID");
				Object authorities = session.getAttribute("USER_AUTHORITIES");

				System.out.println("세션의 USER_ID: " + userId);
				System.out.println("세션의 권한: " + authorities);

				if (userId != null && !userId.equals("anonymousUser")) {
					// SecurityContext도 복원
					Object contextFromSession = session.getAttribute("SPRING_SECURITY_CONTEXT");
					if (contextFromSession != null) {
						SecurityContextHolder.setContext(
								(org.springframework.security.core.context.SecurityContext) contextFromSession);
						System.out.println("SecurityContext 복원됨");
					}

					return ResponseEntity.ok().body(Map.of("authenticated", true, "username", userId, "authorities",
							authorities, "sessionId", session.getId()));
				}
			}

			// 인증되지 않은 경우
			System.out.println("인증되지 않은 상태");
			return ResponseEntity.ok().body(Map.of("authenticated", false));

		} catch (Exception e) {
			System.out.println("상태 확인 오류: " + e.getMessage());
			e.printStackTrace();
			return ResponseEntity.status(500).body(Map.of("authenticated", false, "message", "인증 상태 확인 중 오류가 발생했습니다."));
		}
	}
}