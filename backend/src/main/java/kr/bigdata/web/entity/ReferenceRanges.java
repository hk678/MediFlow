package kr.bigdata.web.entity;

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
@Table(name = "reference_ranges")
public class ReferenceRanges {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RANGE_ID")
    private Long rangeId;

    @Column(name = "TEST_NAME")
    private String testName;

    @Column(name = "TEST_CATEGORY")
    private String testCategory;

    @Column(name = "MIN_NORMAL")
    private Double minNormal;

    @Column(name = "MAX_NORMAL")
    private Double maxNormal;

}
