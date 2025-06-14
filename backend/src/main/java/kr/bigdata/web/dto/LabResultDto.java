package kr.bigdata.web.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LabResultDto {
	
	private Long labId;
    private String visitId;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime labTime;
    private Double wbc;
    private Double hemoglobin;
    private Double plateletCount;
    private Double redBloodCells;
    private Double sedimentationRate;
    private Double na;
    private Double k;
    private Double chloride;
    private Double ca;
    private Double mg;
    private Double ureaNitrogen;
    private Double creatinine;
    private Double ast;
    private Double alt;
    private Double bilirubin;
    private Double albumin;
    private Double ap;
    private Double ggt;
    private Double ld;
    private Double ammonia;
    private Double glucose;
    private Double lactate;
    private Double acetone;
    private Double bhb;
    private Double crp;
    private Double pt;
    private Double inrPt;
    private Double ptt;
    private Double dDimer;

}
