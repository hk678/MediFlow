package kr.bigdata.web.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "ai_prediction")
public class AiPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PRE_ID")
    private Long preId;

    // EmergencyVisit FK (방문기록)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VISIT_ID", referencedColumnName = "VISIT_ID")
    private EmergencyVisit emergencyVisit;

    @Column(name = "PRE_TYPE", nullable = false)
    private String preType;

    @Column(name = "PRE_TIME", nullable = false)
    private LocalDateTime preTime;

    @Column(name = "PRE_DISPOSITION", nullable = false)
    private Integer preDisposition;

    @Column(name = "PRE_SCORE")
    private Integer preScore;

    @Column(name = "REASON")
    private String reason;
}
