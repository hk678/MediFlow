package kr.bigdata.web.service;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import kr.bigdata.web.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        kr.bigdata.web.entity.User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new UsernameNotFoundException("사용자 없음: " + userId));
        String role = "ROLE_" + user.getUserRole();
        // 스프링 시큐리티 User로 래핑
        return new org.springframework.security.core.userdetails.User(
            user.getUserId(),
            user.getPassword(),
            Collections.singleton(new SimpleGrantedAuthority(role))
        );
    }

}