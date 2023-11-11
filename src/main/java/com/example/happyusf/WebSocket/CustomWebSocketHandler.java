package com.example.happyusf.WebSocket;

import com.example.happyusf.Domain.ChannelInfoDTO;
import com.example.happyusf.Service.ChannelService;
import com.example.happyusf.Service.Utils.CrawlingService;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.security.Principal;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class CustomWebSocketHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(CustomWebSocketHandler.class);
    private final ChannelService channelService;

    static final Map<String, Set<WebSocketSession>> channelSessions = new ConcurrentHashMap<>();
    static private Map<String, WebSocketSession> userSessionMap = new HashMap<>();
    static private Map<String, String> userChannelMap = new HashMap<>();

    // 사용자 ID를 통해 WebSocket 세션을 찾는 메소드
    public WebSocketSession findSessionByUserId(String userId) {
        return userSessionMap.get(userId);
    }

    // 사용자 ID를 통해 채널 ID를 찾는 메소드
    public String findChannelIdByUserId(String userId) {
        return userChannelMap.get(userId);
    }

    @Autowired
    public CustomWebSocketHandler(ChannelService channelService) {
        this.channelService = channelService;
    }


    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        String payload = message.getPayload();
        if (!isValidJson(payload)) {
            return;
        }

        JsonObject jsonMessage = new Gson().fromJson(payload, JsonObject.class);

        String action = jsonMessage.get("action").getAsString();

        switch (action) {
            case "leave_channel" -> leaveChannel(jsonMessage, session);
            case "join_channel" -> joinChannel(jsonMessage, session);
            case "message" -> sendMessage(jsonMessage, session);
            default -> {}
        }
    }

    private boolean isValidJson(String jsonInString ) {
        try {
            new Gson().fromJson(jsonInString , Object.class);
            return true;
        } catch(JsonSyntaxException ex) {
            return false;
        }
    }

    /**
     * @Explain : 채널 퇴장처리 function
     * @param jsonMessage action : left_channel
     * @param session
     * @throws Exception
     */
    public void leaveChannel(JsonObject jsonMessage, WebSocketSession session) throws Exception {
        String channelId = jsonMessage.get("channelId").getAsString();
        Set<WebSocketSession> sessions = channelSessions.getOrDefault(channelId, Collections.synchronizedSet(new HashSet<>()));
        sessions.remove(session);
        if(sessions.isEmpty()){
            ChannelInfoDTO channelInfo = ChannelInfoDTO.builder().c_id(channelId)
                    .c_isAlive(false).build();
            channelService.updateChannelStatus(channelInfo);
        } else {
            channelSessions.put(channelId, sessions);
        }
        JsonObject responseMessage = new JsonObject();
        responseMessage.addProperty("action", "left_channel");
        responseMessage.addProperty("message", "채널연결을 종료했습니다.");
        session.sendMessage(new TextMessage(responseMessage.toString()));

        // 사용자 ID와 WebSocket 세션, 채널 ID를 연결 해제
        String userId = ((UsernamePasswordAuthenticationToken) session.getPrincipal()).getName();
        userSessionMap.remove(userId);
        userChannelMap.remove(userId);
    }

    /**
     * @Explain : 채널 입장처리 function
     * @param jsonMessage action : joined_channel
     * @param session
     * @throws Exception
     */
    private void joinChannel(JsonObject jsonMessage, WebSocketSession session) throws Exception {

        Principal principal = session.getPrincipal();
        // 로그인 체크
        if (principal == null || !(principal instanceof UsernamePasswordAuthenticationToken)) {
            JsonObject responseMessage = new JsonObject();
            responseMessage.addProperty("action", "error");
            responseMessage.addProperty("message", "로그인이 필요합니다.");

            session.sendMessage(new TextMessage(responseMessage.toString()));
            return;
        }

        String userId = ((UsernamePasswordAuthenticationToken) principal).getName();
        String channelId = jsonMessage.get("channelId").getAsString();

        Set<WebSocketSession> sessions = channelSessions.getOrDefault(channelId, Collections.synchronizedSet(new HashSet<>()));
        boolean isRejoin = false;

        // 사용자가 이미 채널에 입장한 세션기록이 있을 경우, 기존 세션을 제거
        for (WebSocketSession existingSession : sessions) {
            if (existingSession.getPrincipal() != null && existingSession.getPrincipal().getName().equals(userId)) {

                sessions.remove(existingSession);
                isRejoin = true;
                break;
            }
        }

        // 기존 세션을 제거하고, 새로운 세션을 추가
        sessions.add(session);
        channelSessions.put(channelId, sessions);
        userSessionMap.put(userId, session);
        userChannelMap.put(userId, channelId);

        // 채널 상태 업데이트
        int userCount = getChannelUserCount(channelId);
        if(userCount <= 1){
            ChannelInfoDTO channelInfo = ChannelInfoDTO.builder().c_id(channelId)
                    .c_isAlive(true).build();
            channelService.updateChannelStatus(channelInfo);
        }

        // 메시지 전송
        JsonObject responseMessage = new JsonObject();
        responseMessage.addProperty("action", "joined_channel");
        responseMessage.addProperty("message", isRejoin ? userId + "님이 채널에 재입장 했습니다." : session.getPrincipal().getName() +"님이 채널에 입장했습니다.");
        session.sendMessage(new TextMessage(responseMessage.toString()));
    }

    /**
     * @param jsonMessage
     * @param session
     * @Explain message 처리
     */
    private void sendMessage(JsonObject jsonMessage, WebSocketSession session) throws Exception {
        String channelId = jsonMessage.get("channelId").getAsString();
        String message = jsonMessage.get("message").getAsString();

        Set<WebSocketSession> sessions = channelSessions.getOrDefault(channelId, Collections.synchronizedSet(new HashSet<>()));
        try {
            for (WebSocketSession s : sessions) {
                if (s.isOpen()) {
                    JsonObject responseMessage = new JsonObject();
                    responseMessage.addProperty("action", "message");
                    responseMessage.addProperty("sender", session.getPrincipal().getName()); // 추가된 부분: 메시지를 보낸 사람의 session ID
                    responseMessage.addProperty("message", message);
                    s.sendMessage(new TextMessage(responseMessage.toString()));
                }else{
                    sessions.remove(s);
                }
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    /**
     * @param channelId
     * @return (int) 해당 채널에 접속중인 유저수
     */
    public int getChannelUserCount(String channelId) {
        Set<WebSocketSession> sessions = channelSessions.getOrDefault(channelId, Collections.synchronizedSet(new HashSet<>()));
        return sessions.size();
    }

}

