package kr.bigdata.web.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import kr.bigdata.web.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
}
