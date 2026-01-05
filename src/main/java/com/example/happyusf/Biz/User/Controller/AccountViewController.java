package com.example.happyusf.Biz.User.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * AccountViewController - Legacy URL redirects to React SPA routes
 *
 * This controller maintains backwards compatibility by redirecting old Thymeleaf URLs
 * to new React SPA routes. All authentication page rendering is now handled by React.
 *
 * Migration Note:
 * - Old Thymeleaf view rendering methods have been removed
 * - React now handles all authentication UI (LoginPage, SignUpPage, etc.)
 * - API endpoints remain unchanged in respective REST controllers
 */
@Controller
public class AccountViewController {

    /**
     * Redirect legacy login page URL to React route
     * Old: /loginPage → New: /login
     */
    @GetMapping("/loginPage")
    public String redirectToLogin() {
        return "redirect:/login";
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
