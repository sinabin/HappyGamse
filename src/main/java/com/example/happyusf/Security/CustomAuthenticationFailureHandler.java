package com.example.happyusf.Security;

import com.example.happyusf.Biz.User.Domain.UserDTO;
import com.example.happyusf.Biz.User.Service.LoginFailureService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @Explain :   사용자가 잘못된 자격 증명(예: 잘못된 비밀번호)을 제공하여 인증에 실패할 때 실행
 *              onAuthenticationFailure() 메서드를 오버라이드하여 실패한 경우에 수행할 작업을 정의
 */
public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler {
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final LoginFailureService loginFailureService;

    public CustomAuthenticationFailureHandler(LoginFailureService loginFailureService) {
        this.loginFailureService = loginFailureService;
    }

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {

        // login 실패시 fain_count 증가
        String username = request.getParameter("user_id");
        UserDTO userDTO = new UserDTO();
        userDTO.setUser_id(username);
        loginFailureService.updateLoginFailureCount(userDTO);

        // Exception의 메시지를 JSON 형태로 반환
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/text");
        response.setCharacterEncoding("UTF-8");
        String Message =  exception.getMessage();

        response.getWriter().write(Message);
    }
}

