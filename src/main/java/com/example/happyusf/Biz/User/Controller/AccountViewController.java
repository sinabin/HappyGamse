package com.example.happyusf.Biz.User.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * AccountViewController - Handles authentication page rendering
 */
@Controller
public class AccountViewController {

    /**
     * Render login page using Thymeleaf template
     */
    @GetMapping("/loginPage")
    public String loginPage() {
        return "loginPage";
    }

    /**
     * Redirect /login to /loginPage
     */
    @GetMapping("/login")
    public String redirectLoginPage() {
        return "redirect:/loginPage";
    }

    /**
     * Redirect legacy agreement page URL to React route
     * Old: /register/agreement → New: /agreement
     */
    @GetMapping("/register/agreement")
    public String redirectToAgreement() {
        return "redirect:/agreement";
    }

    /**
     * Redirect legacy signup page URL to React route
     * Old: /register/agreement/signup → New: /signup
     */
    @GetMapping("/register/agreement/signup")
    public String redirectToSignUp() {
        return "redirect:/signup";
    }

    /**
     * Redirect legacy find account page URL to React route
     * Old: /findAccountInfo → New: /find-account
     */
    @GetMapping("/findAccountInfo")
    public String redirectToFindAccount() {
        return "redirect:/find-account";
    }
}
