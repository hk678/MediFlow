package kr.bigdata.web.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import kr.bigdata.web.entity.AvailableBeds;

@Repository
public interface AvailableBedsRepository extends JpaRepository<AvailableBeds, Long> {
    // wardType ("WARD" 또는 "ICU")별 최신 가용병상 데이터 한 건만!
    AvailableBeds findTopByWardTypeOrderByUpdatedTimeDesc(String wardType);
}

