package com.example.happyusf.WebSocket;

import com.example.happyusf.Biz.Channel.Service.ChannelService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Value("${cors.allowed.origin}")
    private String allowedOrigin;

    private final ChannelService channelService;

    public WebSocketConfig(ChannelService channelService) {
        this.channelService = channelService;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(myWebSocketHandler(), "/ws").setAllowedOrigins(allowedOrigin);
    }

    @Bean
    public WebSocketHandler myWebSocketHandler() {
        return new CustomWebSocketHandler(channelService);
    }
}
