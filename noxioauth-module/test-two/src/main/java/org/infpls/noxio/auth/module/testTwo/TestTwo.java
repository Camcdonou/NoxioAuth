package org.infpls.noxio.auth.module.testTwo;

import java.io.IOException;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.socket.CloseStatus;

public class TestTwo extends TextWebSocketHandler {
    
//    @Autowired
    private Map<String, SessionInfo> sessionInfo = new HashMap();
    
    @Autowired
    private TestTwoDao testTwoDao;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
      try {
        sessionInfo.put(session.getId(), new SessionInfo(session, testTwoDao));
      }
      catch(IOException e) {
        e.printStackTrace();
      }
    }
  
    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) {
      try {
          SessionInfo si = sessionInfo.get(session.getId());
          si.handlePacket(message.getPayload());
      } catch (IOException ex) {
          ex.printStackTrace();
      }
    }
    
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
      try {
        SessionInfo si = sessionInfo.get(session.getId());
        si.close();
      }
      catch(IOException e) {
        e.printStackTrace();
      }
    }

}