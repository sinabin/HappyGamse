package com.example.happyusf.Controller.View;

import com.example.happyusf.Service.Utils.PageResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@Controller
public class AccountViewController {

    private final PageResourceService pageResourceService;

    @Autowired
    public AccountViewController(PageResourceService pageResourceService){
        this.pageResourceService = pageResourceService;
    }

    /**
     * @Explain 로그인 페이지
     */
    @GetMapping("/loginPage")
    public String showLoginPage(Authentication authentication, HttpServletResponse response) throws IOException {
        if (LoginChekcer(authentication,response )){
            return null;
        }
        return "loginPage";
    }

    /**
     * @Explain 이용약관 페이지
     */
    @GetMapping("/register/agreement")
    public String showAgreementPage(Authentication authentication, HttpServletResponse response, Model model) throws IOException {
        if (LoginChekcer(authentication,response )){
            return null;
        }
        String terms = pageResourceService.findPageResource("terms_of_service");
        String privacy_policy = pageResourceService.findPageResource("privacy_policy");
        model.addAttribute("terms", terms);
        model.addAttribute("privacy_policy", privacy_policy);
        return "agreementPage";
    }

    /**
     * @Explain 회원가입 페이지
     */
    @GetMapping("/register/agreement/signup")
    public String showSignUpPage(Authentication authentication, HttpServletResponse response) throws IOException {
        if (LoginChekcer(authentication,response )){
            return null;
        }
        return "signUpPage";
    }

    /**
     * @Explain 계정정보 찾기 페이지
     */
    @GetMapping("/findAccountInfo")
    public String findAccountInfo(Authentication authentication, HttpServletResponse response) throws IOException {
        if (LoginChekcer(authentication,response )){
           return null;
        }
        return "findAccountInfoPage";
    }

    public boolean LoginChekcer(Authentication authentication,  HttpServletResponse response) throws IOException {
        if (authentication != null && authentication.isAuthenticated()) {
            response.setContentType("text/html; charset=UTF-8");
            PrintWriter out = response.getWriter();
            out.println("<script>alert('이미 로그인되어있습니다..'); location.href='/';</script>");
            out.flush();
            return true;
        }
        return false;
    }


}
