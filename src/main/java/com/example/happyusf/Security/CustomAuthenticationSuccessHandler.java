package com.example.happyusf.Security;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * @Explain :   사용자가 성공적으로 인증(예: 올바른 아이디/비밀번호 제공)될 때 실행
 *              onAuthenticationSuccess() 메서드를 오버라이드하여 성공한 경우에 수행할 작업을 정의
 */
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        HttpSession session = request.getSession(false);
        if (session != null) {
            int timeoutInSeconds = session.getMaxInactiveInterval(); // 세션 유지시간을 초단위로 반환
            response.setHeader("Session-Expires-In", String.valueOf(timeoutInSeconds));
        }

    }
}
