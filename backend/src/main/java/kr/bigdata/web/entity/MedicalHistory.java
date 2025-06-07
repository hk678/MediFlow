package kr.bigdata.web.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "MEDICAL_HISTORY")
public class MedicalHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "HISTORY_ID")
    private Long historyId;

    @Column(name = "VISIT_ID", nullable = false)
    private String visitId;  // 방문 ID (응급실 방문 테이블 FK)

    @Column(name = "USER_ID", nullable = false)
    private String userId;   // 작성자(의료진) ID

    @Column(name = "RECORD_TIME", nullable = false)
    private LocalDateTime recordTime = LocalDateTime.now(); // 기록 시각

    @Column(name = "CONTENT", nullable = false, columnDefinition = "TEXT")
    private String content;  // 히스토리 내용

    // 기본 생성자(@NoArgsConstructor) 및 Lombok @Getter/@Setter 자동생성
}