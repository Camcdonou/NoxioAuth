package org.infpls.noxio.auth.module.auth.websocket;

import java.io.IOException;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;

import org.infpls.noxio.auth.module.auth.dao.DaoContainer;
import org.infpls.noxio.auth.module.auth.session.NoxioSession;
import org.infpls.noxio.auth.module.auth.util.Oak;


public class AuthWebSocket extends TextWebSocketHandler {
    
    @Autowired
    private DaoContainer dao;

    @Override
    public void afterConnectionEstablished(WebSocketSession webSocket) {
      try {
        final NoxioSession session = dao.getUserDao().createSession(webSocket, dao);
        webSocket.getAttributes().put("session", session);
      }
      catch(Exception ex) {
        Oak.log(Oak.Level.ERR, "Exception thrown at Websocket top level.", ex);
      }
    }

    @Override
    public void handleTextMessage(WebSocketSession webSocket, TextMessage data) {
      try {
        final NoxioSession session = (NoxioSession)(webSocket.getAttributes().get("session"));
        session.handlePacket(data.getPayload());
      }
      catch(Exception ex) {
        Oak.log(Oak.Level.ERR, "Exception thrown at Websocket top level.", ex);
        try { ((NoxioSession)(webSocket.getAttributes().get("session"))).close(ex); }
        catch(IOException ioex) { Oak.log(Oak.Level.CRIT, "Failed to close session after exception.", ioex); }
      }
    }
  
    @Override
    public void afterConnectionClosed(WebSocketSession webSocket, CloseStatus status) {
      try {
        dao.getUserDao().destroySession(webSocket);
      }
      catch(Exception ex) {
        Oak.log(Oak.Level.ERR, "Exception thrown at Websocket top level.", ex);
      }
    }
}