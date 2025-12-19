package org.infpls.noxio.auth.module.auth.websocket;

import java.io.IOException;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;

import org.infpls.noxio.auth.module.auth.dao.DaoContainer;
import org.infpls.noxio.auth.module.auth.session.NoxioSession;
import org.infpls.noxio.auth.module.auth.util.Oak;

import java.util.concurrent.*;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


public class AuthWebSocket extends TextWebSocketHandler {

    protected final DaoContainer dao;
    protected final ScheduledExecutorService scheduler;
    protected final Map<String, ScheduledFuture<?>> pingTasks = new ConcurrentHashMap<>();

    public AuthWebSocket(DaoContainer dao, ScheduledExecutorService scheduler) {
        this.dao = dao;
        this.scheduler = scheduler;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession webSocket) {
      try {
        final NoxioSession session = dao.getUserDao().createSession(webSocket, dao);
        webSocket.getAttributes().put("session", session);

        // Start sending WebSocket PING frames every 20 seconds to keep connection alive
        // This is critical for tunneling services (Cloudflare, playit.gg) that timeout idle connections
        ScheduledFuture<?> pingTask = scheduler.scheduleAtFixedRate(() -> {
          try {
            if (webSocket.isOpen()) {
              webSocket.sendMessage(new PingMessage());
              Oak.log(Oak.Type.SESSION, Oak.Level.INFO, "Sent WebSocket PING to keep connection alive: " + webSocket.getId());
            }
          } catch (Exception e) {
            Oak.log(Oak.Type.SESSION, Oak.Level.WARN, "Failed to send WebSocket PING: " + e.getMessage());
          }
        }, 20, 20, TimeUnit.SECONDS);

        pingTasks.put(webSocket.getId(), pingTask);
      }
      catch(Exception ex) {
        Oak.log(Oak.Type.SESSION, Oak.Level.ERR, "Exception thrown at Websocket top level.", ex);
      }
    }

    @Override
    public void handleTextMessage(WebSocketSession webSocket, TextMessage data) {
      try {
        final NoxioSession session = (NoxioSession)(webSocket.getAttributes().get("session"));
        session.handlePacket(data.getPayload());
      }
      catch(Exception ex) {
        Oak.log(Oak.Type.SESSION, Oak.Level.ERR, "Exception thrown at Websocket top level.", ex);
        try { ((NoxioSession)(webSocket.getAttributes().get("session"))).close(ex); }
        catch(IOException ioex) { Oak.log(Oak.Type.SESSION, Oak.Level.CRIT, "Failed to close session after exception.", ioex); }
      }
    }
  
    @Override
    public void handlePongMessage(WebSocketSession webSocket, PongMessage message) {
      // Client responded to our PING with a PONG - connection is alive
      Oak.log(Oak.Type.SESSION, Oak.Level.INFO, "Received WebSocket PONG from: " + webSocket.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession webSocket, CloseStatus status) {
      try {
        // Stop sending PING frames for this connection
        ScheduledFuture<?> pingTask = pingTasks.remove(webSocket.getId());
        if (pingTask != null) {
          pingTask.cancel(false);
        }

        dao.getUserDao().destroySession(webSocket);
      }
      catch(Exception ex) {
        Oak.log(Oak.Type.SESSION, Oak.Level.ERR, "Exception thrown at Websocket top level.", ex);
      }
    }
}