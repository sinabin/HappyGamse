package com.example.happyusf.WebSocket;

import com.example.happyusf.Domain.ChannelInfoDTO;
import com.example.happyusf.Service.ChannelService;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.security.Principal;
import java.util.*;

@Component
public class CustomWebSocketHandler extends TextWebSocketHandler {
    private final ChannelService channelService;

    static final Map<String, Set<WebSocketSession>> channelSessions = new HashMap<>();

    @Autowired
    public CustomWebSocketHandler(ChannelService channelService) {
        this.channelService = channelService;
    }


    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        // Check if the payload is a valid JSON object before attempting to parse it.
        String payload = message.getPayload();
        if (!isValidJson(payload)) {
            return;
        }

        JsonObject jsonMessage = new Gson().fromJson(payload, JsonObject.class);

        String action = jsonMessage.get("action").getAsString();

        switch (action) {
            case "leave_channel" -> leaveChannel(jsonMessage, session);
            case "join_channel" -> joinChannel(jsonMessage, session);
            case "create_channel" -> createChannel(jsonMessage, session);
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
    private void leaveChannel(JsonObject jsonMessage, WebSocketSession session) throws Exception {
        String channelId = jsonMessage.get("channelId").getAsString();
        Set<WebSocketSession> sessions = channelSessions.getOrDefault(channelId, new HashSet<>());
        sessions.remove(session);
        JsonObject responseMessage = new JsonObject();
        responseMessage.addProperty("action", "left_channel");
        responseMessage.addProperty("message", "채널퇴장에 성공하였습니다.");
        session.sendMessage(new TextMessage(responseMessage.toString()));
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
        Set<WebSocketSession> sessions = channelSessions.getOrDefault(channelId, new HashSet<>());
        if (sessions.contains(session)) {
            JsonObject responseMessage = new JsonObject();
            responseMessage.addProperty("action", "already_joined");
            responseMessage.addProperty("message", "이미 입장한 채널입니다.");
            session.sendMessage(new TextMessage(responseMessage.toString()));
            return;
        }
        sessions.add(session);
        channelSessions.put(channelId, sessions);
        JsonObject responseMessage = new JsonObject();
        responseMessage.addProperty("action", "joined_channel");
        responseMessage.addProperty("message", "채널입장에 성공하였습니다.");
        session.sendMessage(new TextMessage(responseMessage.toString()));
    }

    /**
     * @Explain : 채널 생성 처리 function
     * @param jsonMessage action : create_channel
     * @param session
     * @throws Exception
     */
    private void createChannel(JsonObject jsonMessage, WebSocketSession session) throws Exception {
        String channelName = jsonMessage.get("channelName").getAsString();
        String channelId = UUID.randomUUID().toString();
        ChannelInfoDTO channelInfo = ChannelInfoDTO.builder()
                .c_id(channelId)
                .c_title(channelName)
                .c_type("open")
                .c_subject("플레이게임")
                .c_maxUser(10)
                .c_heartCount(0)
                .c_isAlive(true)
                .c_master("admin")
                .build();
        channelService.createChannel(channelInfo);
        JsonObject responseMessage = new JsonObject();
        responseMessage.addProperty("action", "new_channel_created");
        responseMessage.addProperty("channelId", channelId);
        responseMessage.addProperty("channelName", channelName);
        session.sendMessage(new TextMessage(responseMessage.toString()));
    }

    private void sendMessage(JsonObject jsonMessage, WebSocketSession session) throws Exception {
        String channelId = jsonMessage.get("channelId").getAsString();
        String message = jsonMessage.get("message").getAsString();

        Set<WebSocketSession> sessions = channelSessions.getOrDefault(channelId, new HashSet<>());
        try {
            for (WebSocketSession s : sessions) {
                if (s.isOpen()) {
                    JsonObject responseMessage = new JsonObject();
                    responseMessage.addProperty("action", "message");
                    responseMessage.addProperty("sender", session.getPrincipal().getName()); // 추가된 부분: 메시지를 보낸 사람의 session ID
                    responseMessage.addProperty("message", message);
                    s.sendMessage(new TextMessage(responseMessage.toString()));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * @param channelId
     * @return 해당 채널에 접속중인 유저수
     */
    public int getChannelUserCount(String channelId) {
        Set<WebSocketSession> sessions = channelSessions.getOrDefault(channelId, new HashSet<>());
        return sessions.size();
    }

}

