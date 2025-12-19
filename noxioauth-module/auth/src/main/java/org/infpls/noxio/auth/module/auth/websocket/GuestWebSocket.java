package org.infpls.noxio.auth.module.auth.websocket;

import org.springframework.web.socket.*;
import org.springframework.beans.factory.annotation.Autowired;

import org.infpls.noxio.auth.module.auth.dao.DaoContainer;
import org.infpls.noxio.auth.module.auth.session.NoxioSession;
import org.infpls.noxio.auth.module.auth.util.Oak;

import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;


public class GuestWebSocket extends AuthWebSocket {

    public GuestWebSocket(DaoContainer dao, ScheduledExecutorService scheduler) {
        super(dao, scheduler);
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession webSocket) {
      try {
        final NoxioSession session = dao.getUserDao().createSessionGuest(webSocket, dao);
        webSocket.getAttributes().put("session", session);

        // Start sending WebSocket PING frames every 20 seconds to keep connection alive
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
}