package com.example.happyusf.Security;

import com.example.happyusf.WebSocket.CustomWebSocketHandler;
import com.google.gson.JsonObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.web.socket.WebSocketSession;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Slf4j //Logger 인스턴스 자동 생성
public class CustomLogoutHandler implements LogoutHandler {

    private final CustomWebSocketHandler customWebSocketHandler;

    public CustomLogoutHandler(CustomWebSocketHandler customWebSocketHandler) {
        this.customWebSocketHandler = customWebSocketHandler;
    }

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {

        if (authentication == null) {
            redirectToErrorPage(response, "/login?error=sessionExpired", "세션 만료 또는 인증되지 않은 사용자");
            return;
        }

        try {
            // WebSocketSession에서 해당 User가 참여한 채널 퇴장처리
            String userId = authentication.getName();
            WebSocketSession session = customWebSocketHandler.findSessionByUserId(userId);
            if (session != null) {
                JsonObject jsonMessage = new JsonObject();
                jsonMessage.addProperty("action", "leave_channel");
                jsonMessage.addProperty("channelId", customWebSocketHandler.findChannelIdByUserId(userId));
                customWebSocketHandler.leaveChannel(jsonMessage, session);
            }

            // 세션 무효화
            invalidateSession(request, response);

        } catch (Exception e) {
            log.error("로그아웃 처리 중 오류 발생", e);
            redirectToErrorPage(response, "/500", "서버 오류로 인한 로그아웃 실패");
        }
    }

    private void invalidateSession(HttpServletRequest request, HttpServletResponse response) {
        // 세션 무효화
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        // 쿠키 삭제
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                cookie.setMaxAge(0); // 쿠키 만료 시간을 0으로 설정하여 삭제
                cookie.setPath("/"); // 경로를 루트로 설정하여 전체 도메인에 대해 쿠키 삭제 적용
                response.addCookie(cookie); // 응답에 수정된 쿠키 추가
            }
        }
    }


    private void redirectToErrorPage(HttpServletResponse response, String url, String errorMessage) {
        try {
            response.sendRedirect(url);
        } catch (IOException e) {
            throw new RuntimeException("리다이렉션 실패: " + errorMessage, e);
        }
    }
}
