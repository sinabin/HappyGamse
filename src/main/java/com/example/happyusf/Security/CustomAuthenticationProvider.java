package com.example.happyusf.Security;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;


@Component
public class CustomAuthenticationProvider implements AuthenticationProvider {
    // 보통 AuthenticationProvider는 상태를 가지지 않는 클래스이므로, 생성자 주입을 사용하여 필요한 의존성들을 주입하도록 한다.
    private final UserDetailsService userDetailsService;
    private final BCryptPasswordEncoder passwordEncoder;


    public CustomAuthenticationProvider(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        String password = (String) authentication.getCredentials();

        UserDetails loadedUser = userDetailsService.loadUserByUsername(username);

        if (loadedUser == null) {
            throw new BadCredentialsException("존재하지 않는 ID입니다.");
        }else if(!password.equals(loadedUser.getPassword())){
            throw new BadCredentialsException("패스워드가 일치하지 않습니다.");
        }


        return new UsernamePasswordAuthenticationToken(loadedUser, password, loadedUser.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(aClass);
    }
}
