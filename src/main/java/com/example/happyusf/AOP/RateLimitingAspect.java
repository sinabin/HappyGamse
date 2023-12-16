package com.example.happyusf.AOP;

import com.example.happyusf.Domain.MessageDTO;
import com.google.common.util.concurrent.RateLimiter;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Aspect
public class RateLimitingAspect {

    private final ConcurrentHashMap<String, RateLimiter> limiters = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Integer> requestCounts = new ConcurrentHashMap<>();

    @Around("execution(* com.example.happyusf.Service.MobileService.MobileVerificationService.processMobileVerification(..)) && args(messageDTO, bindingResult)")
    // execition : point cut  표현식으로써 가장 정교한 포인터컷을 만들 수 있다.
    public Object rateLimit(ProceedingJoinPoint joinPoint, MessageDTO messageDTO, BindingResult bindingResult) throws Throwable {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        String ip = request.getRemoteAddr();

        int count = requestCounts.getOrDefault(ip, 0);
        if (count >= 1) {
            // 두 번째 요청부터 제한 적용
            RateLimiter limiter = limiters.computeIfAbsent(ip, k -> RateLimiter.create(1 / (3.0 * 60)));

            if (!limiter.tryAcquire()) {
                HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getResponse();
                assert response != null;
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json; charset=UTF-8");
                response.getWriter().write("인증코드 재발송 요청은 3분 마다 가능합니다.");
                return null;
            }
        }

        Object result = joinPoint.proceed(); // processMobileVerification() 호출

        if (result instanceof ResponseEntity && ((ResponseEntity<?>) result).getStatusCode() == HttpStatus.OK) {
            // 첫 번째 요청에 대해 카운트 업데이트
            requestCounts.put(ip, count + 1);
        }

        return result;
    }
}
