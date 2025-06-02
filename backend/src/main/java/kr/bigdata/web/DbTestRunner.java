package kr.bigdata.web;

import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import kr.bigdata.web.entity.User;
import kr.bigdata.web.repository.UserRepository;

@Component
public class DbTestRunner implements CommandLineRunner {

    private final UserRepository userRepository;

    public DbTestRunner(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // 기존 USER 테이블에 맞춰서 사용자 생성
        User user = new User();
        user.setUserId("admin02");
        user.setPassword("1234");
        user.setUserName("관리자2");
        user.setUserRole("ADMIN2"); // USER 또는 ADMIN만 가능
        user.setCreatedAt(LocalDateTime.now());
        user.setLastLogin(null);

        userRepository.save(user);

        // 저장한 사용자 조회
        User findUser = userRepository.findById("admin01").orElse(null);
        if (findUser != null) {
            System.out.println("조회된 유저 이름: " + findUser.getUserName());
            System.out.println("역할: " + findUser.getUserRole());
            System.out.println("생성일: " + findUser.getCreatedAt());
        } else {
            System.out.println("유저를 찾을 수 없습니다.");
        }
    }
}
