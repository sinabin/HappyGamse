package com.example.happyusf.Security;

import com.example.happyusf.Biz.User.Service.LoginFailureService;
import com.example.happyusf.WebSocket.CustomWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.session.HttpSessionEventPublisher;

import javax.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired private CustomAuthenticationProvider customAuthProvider;

    @Autowired private LoginFailureService loginFailureService;

    @Autowired private CustomWebSocketHandler customWebSocketHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authenticationProvider(customAuthProvider)
                .authorizeRequests(authorizeRequests ->
                        authorizeRequests
                                .antMatchers("/public/**").permitAll()
                                .antMatchers("/user/**").hasRole("USER")
                                .antMatchers("/admin/**").hasRole("ADMIN")
                                .antMatchers("/friend/channel/**").hasRole("USER")
                                .anyRequest().permitAll()
                )
                .formLogin(formLogin -> formLogin.loginPage("/loginPage")
                        .usernameParameter("user_id")
                        .passwordParameter("password")
                        .loginProcessingUrl("/loginAction")
                        .failureHandler(new CustomAuthenticationFailureHandler(loginFailureService))
                        .successHandler((request, response, authentication) -> {
                            request.getSession().setAttribute("user_id", authentication.getName());
                        })
                        .defaultSuccessUrl("/", true)
                )
                .logout(logout -> {
                    logout
                            .logoutSuccessUrl("/")
                            .addLogoutHandler(new CustomLogoutHandler(customWebSocketHandler));
                })
                .csrf().disable() // CSRF 방어 비활성화
                .cors().and() // CORS 설정
                .sessionManagement(sessionManagement ->
                        sessionManagement
                                .maximumSessions(1) // 동시 세션 허용 최대 개수
                                .expiredUrl("/") // 세션 만료 시 리다이렉션 URL
                                .maxSessionsPreventsLogin(true) // 최대 세션 동시 접속 시 로그인 차단 여부
                                .and()
                                .sessionFixation().changeSessionId() // 세션 고정공격 보호기능 활성화
                                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // 세션 생성 정책 설정
                ).exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint((request, response, authException) ->
                                response.sendError(HttpServletResponse.SC_FORBIDDEN, "접근권한이 없습니다. (로그인 또는 계정 상태를 확인해주세요.)")));

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
