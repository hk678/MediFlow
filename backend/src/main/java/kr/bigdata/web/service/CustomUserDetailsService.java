package kr.bigdata.web.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import kr.bigdata.web.entity.User;
import kr.bigdata.web.repository.UserRepository;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        System.out.println("CustomUserDetailsService - 사용자 로드 시도: " + userId);
        
        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> {
                System.out.println("사용자를 찾을 수 없음: " + userId);
                return new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + userId);
            });
        
        System.out.println("사용자 발견: " + user.getUserId() + ", 역할: " + user.getUserRole());
        
        // 권한 설정
        Collection<GrantedAuthority> authorities = getAuthorities(user.getUserRole());
        System.out.println("설정된 권한: " + authorities);
        
        return new CustomUserPrincipal(
            user.getUserId(),
            user.getPassword(),
            user.getUserName(),
            user.getUserRole(),
            authorities
        );
    }
    
    private Collection<GrantedAuthority> getAuthorities(String userRole) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        
        // 역할에 따라 권한 부여
        switch (userRole) {
            case "관리자":
                authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                break;
            case "의사":
                authorities.add(new SimpleGrantedAuthority("ROLE_DOCTOR"));
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                break;
            case "간호사":
                authorities.add(new SimpleGrantedAuthority("ROLE_NURSE"));
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                break;
            default:
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                break;
        }
        
        return authorities;
    }
    
    // 커스텀 UserDetails 구현
    public static class CustomUserPrincipal implements UserDetails {
        private final String userId;
        private final String password;
        private final String userName;
        private final String userRole;
        private final Collection<? extends GrantedAuthority> authorities;
        
        public CustomUserPrincipal(String userId, String password, String userName, 
                                 String userRole, Collection<? extends GrantedAuthority> authorities) {
            this.userId = userId;
            this.password = password;
            this.userName = userName;
            this.userRole = userRole;
            this.authorities = authorities;
        }
        
        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return authorities;
        }
        
        @Override
        public String getPassword() {
            return password;
        }
        
        @Override
        public String getUsername() {
            return userId; // Spring Security에서는 username을 식별자로 사용
        }
        
        public String getUserId() {
            return userId;
        }
        
        public String getUserName() {
            return userName;
        }
        
        public String getUserRole() {
            return userRole;
        }
        
        @Override
        public boolean isAccountNonExpired() {
            return true;
        }
        
        @Override
        public boolean isAccountNonLocked() {
            return true;
        }
        
        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }
        
        @Override
        public boolean isEnabled() {
            return true;
        }
        
        @Override
        public String toString() {
            return "CustomUserPrincipal{" +
                    "userId='" + userId + '\'' +
                    ", userName='" + userName + '\'' +
                    ", userRole='" + userRole + '\'' +
                    ", authorities=" + authorities +
                    '}';
        }
    }
}