package kr.bigdata.web.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PatientSummaryDto {
    private String pid;
    private String name;
    private int age;
    private int gender;
    private String bed;
    private int acuity;
    private String chiefComplaint;
    private Integer label;  // null 가능

    public PatientSummaryDto(String pid, String name, int age, int gender,
                             String bed, int acuity, String chiefComplaint, Integer label) {
        this.pid = pid;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.bed = bed;
        this.acuity = acuity;
        this.chiefComplaint = chiefComplaint;
        this.label = label;
    }

    // Getters
}
