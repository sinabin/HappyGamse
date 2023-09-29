package com.example.happyusf.Controller.Rest;


import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.time.Duration;
import java.time.Instant;

@RestController
public class SessionController {

    /**
     * @Explain : 로그인 상태 API
     * @param authentication
     * @return boolean
     */
    @GetMapping("/api/is-authenticated")
    public boolean isAuthenticated(Authentication authentication) {
        return authentication != null && authentication.isAuthenticated();
    }


    /**
     * @Explaion : 세션 유지시간(초) 반환
     * @param request
     * @return 세션 유지시간(초) : long
     */
    @GetMapping("/api/session-time-remaining")
    public long getSessionTimeRemaining(HttpServletRequest request) {
        HttpSession session = request.getSession(false); // false: create a new session if none exists
        if (session != null) {
            return Duration.between(Instant.now(), Instant.ofEpochMilli(session.getLastAccessedTime() + session.getMaxInactiveInterval() * 1000)).getSeconds();
        } else {
            return 0L;
        }
    }



}
