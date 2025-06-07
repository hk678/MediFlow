package kr.bigdata.web.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "medical_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "HISTORY_ID")
    private Long historyId;
    
    @Column(name = "VISIT_ID", nullable = false, length = 20)
    private String visitId;
    
    @Column(name = "USER_ID", nullable = false, length = 20)
    private String userId;
    
    @Column(name = "RECORD_TIME", nullable = false)
    @CreationTimestamp
    private LocalDateTime recordTime;
    
    @Column(name = "CONTENT", nullable = false, columnDefinition = "TEXT")
    private String content;
    
    // 연관관계 매핑
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VISIT_ID", insertable = false, updatable = false)
    private EmergencyVisit emergencyVisit;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", insertable = false, updatable = false)
    private User user;
}
