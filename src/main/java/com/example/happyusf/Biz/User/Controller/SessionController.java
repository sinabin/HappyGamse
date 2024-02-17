package com.example.happyusf.Biz.User.Controller;


import com.example.happyusf.Biz.User.Domain.UserDTO;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.time.Duration;
import java.time.Instant;

@RestController
@RequestMapping("/api")
public class SessionController {

    /**
     * @Explain : 로그인 상태 API
     * @param authentication
     * @return boolean
     */
    @GetMapping("/is-authenticated")
    public UserDTO isAuthenticated(Authentication authentication) {
        UserDTO userinfo = UserDTO.builder().user_id(authentication.getName()).build();
        return userinfo;
    }


    /**
     * @Explaion : 세션 유지시간(초) 반환
     * @param request
     * @return 세션 유지시간(초) : long
     */
    @GetMapping("/session-time-remaining")
    public long getSessionTimeRemaining(HttpServletRequest request) {
        HttpSession session = request.getSession(false); // false: create a new session if none exists
        if (session != null) {
            return Duration.between(Instant.now(), Instant.ofEpochMilli(session.getLastAccessedTime() + session.getMaxInactiveInterval() * 1000)).getSeconds();
        } else {
            return 0L;
        }
    }



}
