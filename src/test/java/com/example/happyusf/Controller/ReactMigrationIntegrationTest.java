package com.example.happyusf.Controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for React SPA migration
 *
 * Tests the following migration changes:
 * 1. AccountViewController legacy URL redirects
 * 2. TermsController REST API endpoints
 * 3. Security configuration for React routes
 * 4. React SPA route accessibility
 */
@SpringBootTest
@AutoConfigureMockMvc
class ReactMigrationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    // ========================================
    // 1. AccountViewController Redirect Tests
    // ========================================

    @Test
    @DisplayName("Legacy /loginPage should redirect to /login")
    void testLoginPageRedirect() throws Exception {
        mockMvc.perform(get("/loginPage"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login"));
    }

    @Test
    @DisplayName("Legacy /register/agreement should redirect to /agreement")
    void testAgreementPageRedirect() throws Exception {
        mockMvc.perform(get("/register/agreement"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/agreement"));
    }

    @Test
    @DisplayName("Legacy /register/agreement/signup should redirect to /signup")
    void testSignUpPageRedirect() throws Exception {
        mockMvc.perform(get("/register/agreement/signup"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/signup"));
    }

    @Test
    @DisplayName("Legacy /findAccountInfo should redirect to /find-account")
    void testFindAccountPageRedirect() throws Exception {
        mockMvc.perform(get("/findAccountInfo"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/find-account"));
    }

    // ========================================
    // 2. TermsController REST API Tests
    // ========================================

    @Test
    @DisplayName("GET /api/terms/service should return service terms HTML")
    void testGetServiceTerms() throws Exception {
        mockMvc.perform(get("/api/terms/service"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("text/plain;charset=UTF-8"))
                .andExpect(content().string(containsString("<h3>서비스 이용약관</h3>")))
                .andExpect(content().string(containsString("제1조 (목적)")))
                .andExpect(content().string(containsString("HappyGamse")));
    }

    @Test
    @DisplayName("GET /api/terms/privacy should return privacy policy HTML")
    void testGetPrivacyPolicy() throws Exception {
        mockMvc.perform(get("/api/terms/privacy"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("text/plain;charset=UTF-8"))
                .andExpect(content().string(containsString("<h3>개인정보 처리방침</h3>")))
                .andExpect(content().string(containsString("1. 개인정보의 수집 및 이용 목적")))
                .andExpect(content().string(containsString("회원 가입 및 관리")));
    }

    // ========================================
    // 3. Security Configuration Tests
    // ========================================

    @Test
    @DisplayName("React SPA routes should be publicly accessible - /login")
    void testReactLoginRouteAccessible() throws Exception {
        mockMvc.perform(get("/login"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("React SPA routes should be publicly accessible - /signup")
    void testReactSignupRouteAccessible() throws Exception {
        mockMvc.perform(get("/signup"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("React SPA routes should be publicly accessible - /agreement")
    void testReactAgreementRouteAccessible() throws Exception {
        mockMvc.perform(get("/agreement"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("React SPA routes should be publicly accessible - /find-account")
    void testReactFindAccountRouteAccessible() throws Exception {
        mockMvc.perform(get("/find-account"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Root route (/) should be publicly accessible")
    void testRootRouteAccessible() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "testuser", authorities = {"ROLE_USER"})
    @DisplayName("/api/is-authenticated should return user data for authenticated users")
    void testIsAuthenticatedWithAuth() throws Exception {
        mockMvc.perform(get("/api/is-authenticated"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user_id").value("testuser"));
    }

    @Test
    @DisplayName("/api/is-authenticated should return empty response for unauthenticated users")
    void testIsAuthenticatedWithoutAuth() throws Exception {
        mockMvc.perform(get("/api/is-authenticated"))
                .andExpect(status().isOk())
                .andExpect(content().string(""));
    }

    // ========================================
    // 4. Protected Routes Tests
    // ========================================

    @Test
    @DisplayName("Protected API routes should require authentication")
    void testProtectedApiRequiresAuth() throws Exception {
        // This should fail with 403 Forbidden since no authentication
        mockMvc.perform(get("/api/user/profile"))
                .andExpect(status().isForbidden());
    }

    // ========================================
    // 5. Backwards Compatibility Tests
    // ========================================

    @Test
    @DisplayName("Following redirect chain: /loginPage → /login should work")
    void testRedirectChainWorks() throws Exception {
        mockMvc.perform(get("/loginPage"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login"));

        // Verify the target URL is accessible
        mockMvc.perform(get("/login"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Terms API endpoints should be publicly accessible")
    void testTermsEndpointsPubliclyAccessible() throws Exception {
        // Verify /api/terms/** is publicly accessible (no 403)
        mockMvc.perform(get("/api/terms/service"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/terms/privacy"))
                .andExpect(status().isOk());
    }
}
