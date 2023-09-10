package com.example.happyusf.Security;

import com.example.happyusf.Service.UserService.LoginFailureService;
import com.example.happyusf.Service.UserService.UserRepositoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.session.HttpSessionEventPublisher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired private CustomAuthenticationProvider customAuthProvider;

    @Autowired private LoginFailureService loginFailureService;

    @Autowired private RateLimitingFilter rateLimitingFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authenticationProvider(customAuthProvider)
                .addFilterBefore(rateLimitingFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeRequests(authorizeRequests ->
                        authorizeRequests
                                .antMatchers("/public/**").permitAll()
                                .antMatchers("/admin/**").hasRole("USER") //ADMIN 역할만 접근 가능
                                .anyRequest().permitAll()
                )
                .formLogin(formLogin -> formLogin.loginPage("/loginPage")
                        .usernameParameter("user_id")
                        .passwordParameter("password")
                        .loginProcessingUrl("/loginAction")
                        .failureHandler(new CustomAuthenticationFailureHandler(loginFailureService)) //
                        .successHandler(new CustomAuthenticationSuccessHandler())
                        .defaultSuccessUrl("/", true)
                )
                .logout(logout -> logout.logoutSuccessUrl("/"))
                .csrf().disable() // CSRF 방어 비활성화
                .cors().and() // CORS 설정
                .sessionManagement(sessionManagement ->
                        sessionManagement
                                .maximumSessions(1) // 동시 세션 허용 최대 개수
                                .expiredUrl("/") // 세션 만료 시 리다이렉션 URL
                                .maxSessionsPreventsLogin(false) // 최대 세션 동시 접속 시 로그인 차단 여부
                                .and()
                                .sessionFixation().changeSessionId() // 세션 고정공격 보호기능 활성화
                                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // 세션 생성 정책 설정
                );

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public HttpSessionEventPublisher httpSessionEventPublisher() {
        return new HttpSessionEventPublisher();
    }


}
