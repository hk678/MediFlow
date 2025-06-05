package kr.bigdata.web.entity;

import jakarta.persistence.Id;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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

	    // VISIT_ID (String)로 FK 설정
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

	    // Getter/Setter/기본 생성자 전부 추가!

}
