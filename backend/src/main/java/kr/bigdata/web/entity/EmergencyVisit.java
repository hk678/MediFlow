package kr.bigdata.web.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
@Table(name = "emergency_visit")
public class EmergencyVisit {

    @Id
    @Column(name = "VISIT_ID", nullable = false, length = 255)
    private String visitId; // PK는 String

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PATIENT_ID", referencedColumnName = "PATIENT_ID", nullable = false)
    private Patient patient;

    @Column(name = "ADMISSION_TIME", nullable = false)
    private LocalDateTime admissionTime;

    @Column(name = "DISCHARGE_TIME")
    private LocalDateTime dischargeTime;

    @Column(name = "ACUITY", nullable = false)
    private int acuity;

    @Column(name = "PAIN", nullable = false)
    private int pain;

    @Column(name = "CHIEF_COMPLAINT", nullable = false, length = 50)
    private String chiefComplaint;

    @Column(name = "ARRIVAL_TRANSPORT", nullable = false, length = 20)
    private String arrivalTransport;

    @Column(name = "FINAL_DISPOSITION")
    private Integer finalDisposition;

    @Column(name = "BED_NUMBER", length = 255)
    private String bedNumber;

    @Column(name = "STATUS", nullable = false, length = 10)
    private String status;


}

