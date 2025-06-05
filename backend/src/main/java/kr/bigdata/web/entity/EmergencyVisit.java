package kr.bigdata.web.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "emergency_visit")
public class EmergencyVisit {

    @Id
    @Column(name = "VISIT_ID")
    private String visitId;

    @ManyToOne
    @JoinColumn(name = "PATIENT_ID", referencedColumnName = "PATIENT_ID")
    private Patient patient;

    @Column(name = "BED_NUMBER")
    private String bedNumber;

    @Column(name = "ACUITY")
    private int acuity;

    @Column(name = "CHIEF_COMPLAINT")
    private String chiefComplaint;

    @Column(name = "FINAL_DISPOSITION")
    private Integer finalDisposition;

    @Column(name = "STATUS")
    private String status;

    // Getter/Setter 생략
}

