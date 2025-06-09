package kr.bigdata.web.dto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PatientSummaryDto {
    private String pid;
    private String visitId;
    private String name;
    private int age;
    private boolean gender;
    private String bed;
    private int acuity;
    private String chiefComplaint;
    private Integer label;

}
