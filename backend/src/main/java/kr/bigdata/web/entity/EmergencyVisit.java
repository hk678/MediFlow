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
@Table(name = "emergency_visit")
public class EmergencyVisit {

    @Id
    @Column(name = "VISIT_ID")
    private String visitId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PATIENT_ID", referencedColumnName = "PATIENT_ID", nullable = false)
    private Patient patient;

    @Column(name = "ADMISSION_TIME")
    private LocalDateTime admissionTime;

    @Column(name = "DISCHARGE_TIME")
    private LocalDateTime dischargeTime;

    @Column(name = "BED_NUMBER")
    private String bedNumber;

    @Column(name = "ACUITY", nullable = false)
    private int acuity;

    @Column(name = "PAIN", nullable = false)
    private int pain;

    @Column(name = "CHIEF_COMPLAINT", nullable = false)
    private String chiefComplaint;

    @Column(name = "ARRIVAL_TRANSPORT", nullable = false)
    private String arrivalTransport;

    @Column(name = "FINAL_DISPOSITION")
    private Integer finalDisposition;

    @Column(name = "STATUS", nullable = false)
    private String status;

    @Column(name = "DIAGNOSIS")
    private String diagnosis;
}
