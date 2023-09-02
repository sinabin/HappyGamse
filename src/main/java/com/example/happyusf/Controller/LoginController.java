package com.example.happyusf.Controller;

import com.example.happyusf.Service.PageResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@Controller
public class LoginController {

    private final PageResourceService pageResourceService;

    @Autowired
    public LoginController(PageResourceService pageResourceService){
        this.pageResourceService = pageResourceService;
    }

    @GetMapping("/loginPage")
    public String showLoginPage(Authentication authentication, HttpServletResponse response) throws IOException {
        if (authentication != null && authentication.isAuthenticated()) {
            response.setContentType("text/html; charset=UTF-8");
            PrintWriter out = response.getWriter();
            out.println("<script>alert('이미 로그인되어있습니다..'); location.href='/';</script>");
            out.flush();
            return null;
        }
        return "loginPage";
    }

    @GetMapping("/register/agreement")
    public String showAgreementPage(Authentication authentication, HttpServletResponse response, Model model) throws IOException {
        if (authentication != null && authentication.isAuthenticated()) {
            response.setContentType("text/html; charset=UTF-8");
            PrintWriter out = response.getWriter();
            out.println("<script>alert('이미 로그인되어있습니다..'); location.href='/';</script>");
            out.flush();
            return null;
        }
        String terms = pageResourceService.findPageResource("terms_of_service");
        String privacy_policy = pageResourceService.findPageResource("privacy_policy");
        model.addAttribute("terms", terms);
        model.addAttribute("privacy_policy", privacy_policy);
        return "agreementPage";
    }

    @GetMapping("/register/agreement/signup")
    public String showSignUpPage(Authentication authentication, HttpServletResponse response) throws IOException {
        if (authentication != null && authentication.isAuthenticated()) {
            response.setContentType("text/html; charset=UTF-8");
            PrintWriter out = response.getWriter();
            out.println("<script>alert('이미 로그인되어있습니다..'); location.href='/';</script>");
            out.flush();
            return null;
        }
        return "signUpPage";
    }

    @GetMapping("/findAccountInfo")
    public String findAccountInfo(Authentication authentication, HttpServletResponse response) throws IOException {
        if (authentication != null && authentication.isAuthenticated()) {
            response.setContentType("text/html; charset=UTF-8");
            PrintWriter out = response.getWriter();
            out.println("<script>alert('이미 로그인되어있습니다..'); location.href='/';</script>");
            out.flush();
            return null;
        }
        return "findAccountInfoPage";
    }



}
