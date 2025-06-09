package kr.bigdata.web.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import kr.bigdata.web.entity.ReferenceRanges;

public interface ReferenceRangesRepository extends JpaRepository<ReferenceRanges, Long> {
    ReferenceRanges findByTestName(String testName);
}

