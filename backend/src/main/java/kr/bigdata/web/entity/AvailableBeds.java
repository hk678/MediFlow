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
@Table(name = "available_beds")
@Getter
@Setter
public class AvailableBeds {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RECORD_ID")
    private Long recordId;

    @Column(name = "WARD_TYPE")
    private String wardType;

    @Column(name = "TOTAL_BEDS")
    private int totalBeds;

    @Column(name = "AVAILABLE_COUNT")
    private int availableCount;

    @Column(name = "UPDATED_TIME")
    private LocalDateTime updatedTime;

    // Getter/Setter ...
}

