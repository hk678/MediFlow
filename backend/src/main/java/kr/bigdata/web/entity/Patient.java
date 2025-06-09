package kr.bigdata.web.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "patient")
@Getter
@Setter
public class Patient {

    @Id
    @Column(name = "PATIENT_ID", length = 20)
    private String patientId;

    @Column(name = "PATIENT_NAME", nullable = false, length = 50)
    private String patientName;

    @Column(name = "GENDER", nullable = false)
    private int gender;  // 0:남, 1:여

    @Column(name = "AGE", nullable = false)
    private int age;

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

}
