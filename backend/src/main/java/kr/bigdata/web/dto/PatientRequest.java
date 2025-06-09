package kr.bigdata.web.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PatientRequest {
	
	    public int gender;  // 0=남자, 1=여자
	    public int age;
	    public int acuity;
	    public int pain;
	    
	    @JsonProperty("chief_complaint")
	    public String chiefComplaint;
	    
	    @JsonProperty("arrival_transport")
	    public String arrivalTransport;
	    private Double hemoglobin;
	    private Double wbc;
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
	    private Double troponinT;
	    private Double ck;
	    private Double ckmb;
	    private Double ntprobnp;
	    private Double amylase;
	    private Double lipase;
	    private Double ph;
	    private Double pco2;
	    private Double po2;
	    private Double ctco2;
	    private Double bcb;
}
