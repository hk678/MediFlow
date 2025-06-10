package kr.bigdata.web.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import kr.bigdata.web.entity.AvailableBeds;

@Repository
public interface AvailableBedsRepository extends JpaRepository<AvailableBeds, Long> {
    AvailableBeds findTopByWardTypeOrderByUpdatedTimeDesc(String wardType);
}
