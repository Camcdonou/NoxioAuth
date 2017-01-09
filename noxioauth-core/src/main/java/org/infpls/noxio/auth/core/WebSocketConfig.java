package org.infpls.noxio.auth.core;

import org.infpls.noxio.auth.module.auth.websocket.AuthWebSocket;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.WebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(AuthWebSocketHandler(), "/auth");
    }

    @Bean
    public WebSocketHandler AuthWebSocketHandler() {
        return new AuthWebSocket();
    }

}