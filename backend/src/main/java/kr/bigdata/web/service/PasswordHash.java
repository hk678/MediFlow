package kr.bigdata.web.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHash {
	
	public static void main(String[] args) {
        String[] passwords = {"user1pass"};
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        for (String raw : passwords) {
            String hashed = encoder.encode(raw);
            System.out.println("평문: " + raw);
            System.out.println("암호문: " + hashed);
            System.out.println("-------------------");
        }
    }
}
