package com.example.happyusf.Controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@Controller
public class LoginController {

    @GetMapping("/loginPage")
    public String showLoginPage(Authentication authentication, HttpServletResponse response) throws IOException {
        if (authentication != null && authentication.isAuthenticated()) {
            response.setContentType("text/html; charset=UTF-8");
            PrintWriter out = response.getWriter();
            out.println("<script>alert('이미 로그인되어있습니다..'); location.href='/';</script>");
            out.flush();
            return null;
        }
        return "loginPage"; // 이 부분은 실제 로그인 페이지의 view 이름으로 변경해야 합니다.
    }



}
