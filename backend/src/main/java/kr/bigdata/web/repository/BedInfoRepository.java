package kr.bigdata.web.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import kr.bigdata.web.entity.BedInfo;

@Repository
public interface BedInfoRepository extends JpaRepository<BedInfo, String> {
    // STATUS 값으로 개수 세기
    long countByStatus(String status);
    // 전체 개수
    long count();
}
