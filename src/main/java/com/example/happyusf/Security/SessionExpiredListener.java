package com.example.happyusf.Security;


import com.example.happyusf.WebSocket.CustomWebSocketHandler;
import com.google.gson.JsonObject;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.stereotype.Component;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.socket.WebSocketSession;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

/**
 * @Explain 세션 만료 이벤트를 감지하고 처리하는 리스너 클래스
 */
@Component
public class SessionExpiredListener implements HttpSessionListener {

    /**
     * @Explain HTTP 세션의 만료 또는 명시적 종료로 인해 세션 파괴 이벤트가 발생하면 이 메서드가 실행됨
     * @param sessionEvent 세션 파괴 이벤트 정보를 포함하는 {@link HttpSessionEvent} 객체.
     */
    @Override
    public void sessionDestroyed(HttpSessionEvent sessionEvent) {
        // 1. 세션에서 Authentication 객체 추출
        SecurityContext securityContext = (SecurityContext) sessionEvent.getSession().getAttribute("SPRING_SECURITY_CONTEXT");
        if (securityContext == null) {
            return; // 보안 컨텍스트가 없다면, 종료
        }
        Authentication authentication = securityContext.getAuthentication();
        if (authentication == null) {
            return; // 추출한 authentication 객체에 인증 정보가 없다면 종료
        }

        // 2. CustomWebSocketHandler를 ApplicationContext에서 가져온다.
        CustomWebSocketHandler customWebSocketHandler
                = WebApplicationContextUtils.getRequiredWebApplicationContext(sessionEvent.getSession().getServletContext()).getBean(CustomWebSocketHandler.class);

        String userId = authentication.getName();
        WebSocketSession webSocketSession = customWebSocketHandler.findSessionByUserId(userId);

        // 3. 해당 로그인 유저의 WebSocket session 채널 퇴장 처리
        if (webSocketSession != null) {
            try {
                JsonObject jsonMessage = new JsonObject();
                jsonMessage.addProperty("action", "leave_channel");
                jsonMessage.addProperty("channelId", customWebSocketHandler.findChannelIdByUserId(userId));
                customWebSocketHandler.leaveChannel(jsonMessage, webSocketSession);
            } catch (Exception e) {
                e.printStackTrace(); // 오류 처리
            }
        }
    }

}
