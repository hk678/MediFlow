package kr.bigdata.web.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import kr.bigdata.web.service.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
public class SpringSecurityConfig {
	
	@SuppressWarnings({ "deprecation", "removal" })
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authz -> authz
                .requestMatchers(
                    "/api/auth/login",
                    "/api/auth/join",
                    "/api/auth/logout",
                    "/api/patients/**",
                    "/api/visits/**",
                    "/api/history/**",
                    "/api/admin/**" // 개발 중 임시로 모든 접근 허용
                ).permitAll()
                // .requestMatchers("/api/admin/**").hasRole("ADMIN") // 운영시 주석 해제
                .anyRequest().authenticated()
            )
            .logout(logout -> logout
                .logoutUrl("/api/auth/logout")
                .logoutSuccessUrl("/api/auth/login?logout")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            );
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
	
    @Bean
    public AuthenticationManager authenticationManager(
            HttpSecurity http,
            PasswordEncoder passwordEncoder,
            CustomUserDetailsService userDetailsService) throws Exception {
        return http
            .getSharedObject(AuthenticationManagerBuilder.class)
            .userDetailsService(userDetailsService)
            .passwordEncoder(passwordEncoder)
            .and()
            .build();
    }
}