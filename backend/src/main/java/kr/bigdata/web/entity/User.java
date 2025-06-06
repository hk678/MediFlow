package kr.bigdata.web.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "USER")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
	
	@Id
    @Column(name = "USER_ID", length = 20)
    private String userId;

    @Column(name = "PASSWORD", nullable = false, length = 255)
    private String password;

    @Column(name = "USER_NAME", nullable = false, length = 50)
    private String userName;

    @Column(name = "USER_ROLE", nullable = false, length = 20)
    private String userRole; // '의사', '간호사', '관리자', '기타'

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "LAST_LOGIN")
    private LocalDateTime lastLogin;

}