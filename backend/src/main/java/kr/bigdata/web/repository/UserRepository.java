package kr.bigdata.web.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import kr.bigdata.web.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    // userId로 사용자 찾기 (로그인, 인증 등에서 주로 사용)
    Optional<User> findByUserId(String userId);
    
    // userId 중복 체크(회원가입 등에서 사용)
    boolean existsByUserId(String userId);
    
    // lastLogin 최신순으로 모든 사용자 조회
    List<User> findAllByOrderByLastLoginDesc();
}