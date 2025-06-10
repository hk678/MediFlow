package kr.bigdata.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientSummaryDto {
    private String pid;
    private String name;
    private int age;
    private int gender;
    private String bed;
    private int acuity;
    private String chiefComplaint;
    private int label;  // ✅ int 타입 (원시 타입)
    private String visitId;  // ✅ Repository 쿼리에서 전달하는 visitId 필드 추가
    
    // ✅ 새로 추가된 필드들
    private LocalDateTime admissionTime;
    private String diagnosis;
    private int pain;   // ✅ int 타입 (원시 타입)
    
    // ✅ Repository 쿼리와 정확히 일치하는 생성자 (9개 매개변수)
    public PatientSummaryDto(String pid, String name, int age, int gender,
                           String bed, int acuity, String chiefComplaint, int label, String visitId) {
        this.pid = pid;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.bed = bed;
        this.acuity = acuity;
        this.chiefComplaint = chiefComplaint;
        this.label = label;
        this.visitId = visitId;  // ✅ visitId 필드 설정
        
        // ✅ 새 필드들은 안전한 기본값으로 초기화
        this.admissionTime = LocalDateTime.now(); // 현재 시간으로 기본값 설정
        this.diagnosis = "진단 대기";               // 기본 진단명
        this.pain = 0;                            // 통증 점수 기본값 0
    }
}