package kr.bigdata.web.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "ai_prediction")
@Getter @Setter
public class AiPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PRE_ID")
    private Long preId;

    @Column(name = "visit_id")
    private String visitId;

    @Column(name = "pre_type")
    private String preType;

    @Column(name = "PRE_TIME")
    private LocalDateTime preTime;

    @Column(name = "pre_disposition")
    private int preDisposition;

    @Column(name = "PRE_SCORE")
    private Integer preScore;

    @Column(name = "reason")
    private String reason;
}
