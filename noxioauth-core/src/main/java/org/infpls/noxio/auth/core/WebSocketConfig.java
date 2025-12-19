package org.infpls.noxio.auth.core;

import org.infpls.noxio.auth.module.auth.websocket.AuthWebSocket;
import org.infpls.noxio.auth.module.auth.websocket.GuestWebSocket;
import org.infpls.noxio.auth.module.auth.dao.DaoContainer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.Executors;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Autowired
    private DaoContainer dao;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(AuthWebSocketHandler(), "/auth").setAllowedOrigins("*");
        registry.addHandler(GuestWebSocketHandler(), "/guest").setAllowedOrigins("*");
    }

    @Bean
    public ScheduledExecutorService webSocketPingScheduler() {
        return Executors.newScheduledThreadPool(2);
    }

    @Bean
    public WebSocketHandler AuthWebSocketHandler() {
        return new AuthWebSocket(dao, webSocketPingScheduler());
    }

    @Bean
    public WebSocketHandler GuestWebSocketHandler() {
        return new GuestWebSocket(dao, webSocketPingScheduler());
    }

}