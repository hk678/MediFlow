package kr.bigdata.web.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "bed_info")
@Getter
@Setter
public class BedInfo {
    @Id
    @Column(name = "BED_NUMBER")
    private String bedNumber;

    @Column(name = "LOCATION")
    private String location;

    @Column(name = "STATUS")
    private String status;
}