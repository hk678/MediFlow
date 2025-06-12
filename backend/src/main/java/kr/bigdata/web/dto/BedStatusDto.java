package kr.bigdata.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BedStatusDto {
    private String wardType; // "일반병동" 또는 "중환자실"
    private Integer availableCount; // 가용 병상 수
    private Integer totalBeds;      // 전체 병상 수
}
