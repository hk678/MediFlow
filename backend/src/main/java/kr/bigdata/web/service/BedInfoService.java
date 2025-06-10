package kr.bigdata.web.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.bigdata.web.repository.BedInfoRepository;

@Service
public class BedInfoService {
    @Autowired
    private BedInfoRepository bedInfoRepository;

    // 가용 병상 수 반환
    public long getAvailableCount() {
        return bedInfoRepository.countByStatus("AVAILABLE");
    }
    // 전체 병상 수 반환
    public long getTotalCount() {
        return bedInfoRepository.count();
    }
}