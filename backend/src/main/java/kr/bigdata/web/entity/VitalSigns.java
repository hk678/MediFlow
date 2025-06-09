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
@Table(name = "vital_signs") 
public class VitalSigns {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RECORD_ID")
    private Long recordId;

    @Column(name = "VISIT_ID")
    private String visitId;

    @Column(name = "RECORD_TIME")
    private LocalDateTime recordTime;

    @Column(name = "HR")
    private Integer hr;

    @Column(name = "RR")
    private Integer rr;

    @Column(name = "SPO2")
    private Double spo2;

    @Column(name = "SBP")
    private Integer sbp;

    @Column(name = "DBP")
    private Integer dbp;

    @Column(name = "BT")
    private Double bt;

    // (Lombok이 getter/setter 자동 생성)
}
