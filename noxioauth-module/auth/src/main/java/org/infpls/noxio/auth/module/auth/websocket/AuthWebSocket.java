package org.infpls.noxio.auth.module.auth.websocket;

import java.io.IOException;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;

import org.infpls.noxio.auth.module.auth.dao.DaoContainer;
import org.infpls.noxio.auth.module.auth.session.NoxioSession;


public class AuthWebSocket extends TextWebSocketHandler {
    
    @Autowired
    private DaoContainer dao;

    @Override
    public void afterConnectionEstablished(WebSocketSession webSocket) {
      try {
        NoxioSession session = dao.getUserDao().createSession(webSocket, dao);
        webSocket.getAttributes().put("session", session);
      }
      catch(Exception e) {
        System.err.println("Exception thrown in " + this.toString() + ":::afterConnectionEstablished");
        e.printStackTrace();
      }
    }

    @Override
    public void handleTextMessage(WebSocketSession webSocket, TextMessage data) {
      try {
        NoxioSession session = (NoxioSession)(webSocket.getAttributes().get("session"));
        session.handlePacket(data.getPayload());
      }
      catch(Exception e) {
        System.err.println("Exception thrown in " + this.toString() + ":::handleTextMessage");
        e.printStackTrace();
      }
    }
  
    @Override
    public void afterConnectionClosed(WebSocketSession webSocket, CloseStatus status) {
      try {
        dao.getUserDao().destroySession(webSocket);
      }
      catch(Exception ex) {
        System.err.println("Exception thrown in " + this.toString() + ":::afterConnectionClosed");
        ex.printStackTrace();
      }
    }

}