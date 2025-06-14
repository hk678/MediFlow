package kr.bigdata.web.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "lab_results")
public class LabResults {
	
	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name = "LAB_ID")
	    private Long labId;

	    @Column(name = "VISIT_ID")
	    private String visitId;

	    @Column(name = "LAB_TIME")
	    private LocalDateTime labTime;

	    @Column(name = "WBC")
	    private Double wbc;

	    @Column(name = "HEMOGLOBIN")
	    private Double hemoglobin;

	    @Column(name = "PLATELET_COUNT")
	    private Double plateletCount;

	    @Column(name = "RED_BLOOD_CELLS")
	    private Double redBloodCells;

	    @Column(name = "SEDIMENTATION_RATE")
	    private Double sedimentationRate;

	    @Column(name = "NA")
	    private Double na;

	    @Column(name = "K")
	    private Double k;

	    @Column(name = "CHLORIDE")
	    private Double chloride;

	    @Column(name = "CA")
	    private Double ca;

	    @Column(name = "MG")
	    private Double mg;

	    @Column(name = "UREA_NITROGEN")
	    private Double ureaNitrogen;

	    @Column(name = "CREATININE")
	    private Double creatinine;

	    @Column(name = "AST")
	    private Double ast;

	    @Column(name = "ALT")
	    private Double alt;

	    @Column(name = "BILIRUBIN")
	    private Double bilirubin;

	    @Column(name = "ALBUMIN")
	    private Double albumin;

	    @Column(name = "AP")
	    private Double ap;

	    @Column(name = "GGT")
	    private Double ggt;

	    @Column(name = "LD")
	    private Double ld;

	    @Column(name = "AMMONIA")
	    private Double ammonia;

	    @Column(name = "GLUCOSE")
	    private Double glucose;
	    
	 // 이미 추가한 필드 위에는 건들지 말고, 아래처럼만 붙이면 됨!

	    @Column(name = "LACTATE")
	    private Double lactate;

	    @Column(name = "ACETONE")
	    private Double acetone;

	    @Column(name = "BHB")
	    private Double bhb;

	    @Column(name = "CRP")
	    private Double crp;

	    @Column(name = "PT")
	    private Double pt;

	    @Column(name = "INR_PT")
	    private Double inrPt;

	    @Column(name = "PTT")
	    private Double ptt;

	    @Column(name = "D_DIMER")
	    private Double dDimer;

	    @Column(name = "TROPONIN_T")
	    private Double troponinT;

	    @Column(name = "CK")
	    private Double ck;

	    @Column(name = "CKMB")
	    private Double ckmb;

	    @Column(name = "NTPROBNP")
	    private Double ntprobnp;

	    @Column(name = "AMYLASE")
	    private Double amylase;

	    @Column(name = "LIPASE")
	    private Double lipase;

	    @Column(name = "PH")
	    private Double ph;

	    @Column(name = "PCO2")
	    private Double pco2;

	    @Column(name = "PO2")
	    private Double po2;

	    @Column(name = "CTCO2")
	    private Double ctco2;

	    @Column(name = "BCB")
	    private Double bcb;

	}


