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
        System.out.println("[GUEST-WEBSOCKET-DEBUG] Connection established: " + webSocket.getId());
        final NoxioSession session = dao.getUserDao().createSessionGuest(webSocket, dao);
        webSocket.getAttributes().put("session", session);

        System.out.println("[GUEST-WEBSOCKET-DEBUG] Scheduling PING task for: " + webSocket.getId());
        // Start sending WebSocket PING frames every 20 seconds to keep connection alive
        ScheduledFuture<?> pingTask = scheduler.scheduleAtFixedRate(() -> {
          try {
            System.out.println("[GUEST-WEBSOCKET-PING] Executing PING task for: " + webSocket.getId());
            if (webSocket.isOpen()) {
              webSocket.sendMessage(new PingMessage());
              System.out.println("[GUEST-WEBSOCKET-PING] Sent PING to: " + webSocket.getId());
              Oak.log(Oak.Type.SESSION, Oak.Level.INFO, "Sent WebSocket PING to keep connection alive: " + webSocket.getId());
            } else {
              System.out.println("[GUEST-WEBSOCKET-PING] WebSocket closed, skipping PING: " + webSocket.getId());
            }
          } catch (Exception e) {
            System.out.println("[GUEST-WEBSOCKET-PING] ERROR sending PING: " + e.getMessage());
            e.printStackTrace();
            Oak.log(Oak.Type.SESSION, Oak.Level.WARN, "Failed to send WebSocket PING: " + e.getMessage());
          }
        }, 20, 20, TimeUnit.SECONDS);

        pingTasks.put(webSocket.getId(), pingTask);
        System.out.println("[GUEST-WEBSOCKET-DEBUG] PING task scheduled successfully for: " + webSocket.getId());
      }
      catch(Exception ex) {
        System.out.println("[GUEST-WEBSOCKET-DEBUG] ERROR in afterConnectionEstablished: " + ex.getMessage());
        ex.printStackTrace();
        Oak.log(Oak.Type.SESSION, Oak.Level.ERR, "Exception thrown at Websocket top level.", ex);
      }
    }
}