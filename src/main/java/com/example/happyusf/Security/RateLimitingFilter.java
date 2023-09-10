package com.example.happyusf.Security;


import com.google.common.util.concurrent.RateLimiter;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

/**
 * IP 주소별로 요청을 제한하는 필터.
 * 각 IP 주소는 초당 최대 1회의 요청만 처리가능
 */
@Component
public class RateLimitingFilter extends GenericFilterBean {

    private final ConcurrentHashMap<String, RateLimiter> limiters = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        String ip = ((HttpServletRequest) request).getRemoteAddr();
        RateLimiter limiter = limiters.computeIfAbsent(ip, k -> RateLimiter.create(1.0)); // 1초당 하나의 허용 요청

        if (!limiter.tryAcquire()) { // 요청에 대한 '허가(permit)'을 획득하지 못한 경우
            ((HttpServletResponse) response).setStatus(HttpStatus.TOO_MANY_REQUESTS.value()); // 429 상태 코드 반환
            return;
        }

        chain.doFilter(request, response);
    }
}
