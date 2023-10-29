package com.example.happyusf.Security;

import com.example.happyusf.WebSocket.CustomWebSocketHandler;
import com.google.gson.JsonObject;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.web.socket.WebSocketSession;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CustomLogoutHandler implements LogoutHandler {

    private final CustomWebSocketHandler customWebSocketHandler;

    public CustomLogoutHandler(CustomWebSocketHandler customWebSocketHandler) {
        this.customWebSocketHandler = customWebSocketHandler;
    }

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        // 로그아웃 시 WebSocket 세션을 찾아 leaveChannel을 호출
        String userId = authentication.getName();
        WebSocketSession session = customWebSocketHandler.findSessionByUserId(userId);  // 사용자 ID를 통해 WebSocket 세션 찾기
        if (session != null) {
            JsonObject jsonMessage = new JsonObject();  // JsonObject 생성
            jsonMessage.addProperty("action", "leave_channel");  // action 추가
            jsonMessage.addProperty("channelId", customWebSocketHandler.findChannelIdByUserId(userId));  // channelId 추가
            try {
                customWebSocketHandler.leaveChannel(jsonMessage, session);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }
}
