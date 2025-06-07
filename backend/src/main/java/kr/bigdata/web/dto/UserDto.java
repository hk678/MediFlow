package kr.bigdata.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String userId;
    private String password; // 응답 시 제외될 수 있도록 처리 필요
    private String userName;
    private String userRole; // '의사', '간호사', '관리자', '기타'
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
}