package kr.bigdata.web.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
	
	 private String userId;   // 입력 폼의 name
	 private String password;

}
