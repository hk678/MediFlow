package kr.bigdata.web.repository;

import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import kr.bigdata.web.entity.User;

public interface UserRepository extends JpaRepository<User, String> {

	Optional<User> findByUserId(String userId);	
}
