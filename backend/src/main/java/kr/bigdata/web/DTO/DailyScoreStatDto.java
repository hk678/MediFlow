package kr.bigdata.web.dto;

import java.math.BigDecimal;

public class DailyScoreStatDto {
    private String date;
    private Double averageScore;

    public DailyScoreStatDto(String date, Double averageScore) {
        this.date = date;
        this.averageScore = averageScore;
    }
    
    public DailyScoreStatDto(String date, BigDecimal averageScore) {
        this.date = date;
        this.averageScore = averageScore != null ? averageScore.doubleValue() : null;
    }
    
    public DailyScoreStatDto(String date, Number averageScore) {
        this.date = date;
        this.averageScore = averageScore != null ? averageScore.doubleValue() : null;
    }

    public String getDate() {
        return date;
    }

    public Double getAverageScore() {
        return averageScore;
    }

    public void setDate(String date) {
        this.date = date;
    }
    
    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore;
    }
}