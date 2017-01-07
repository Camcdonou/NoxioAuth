package org.infpls.noxio.auth.module.testTwo;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.socket.CloseStatus;

public class TestTwo extends TextWebSocketHandler {
    
    @Autowired
    private TestTwoDao testTwoDao;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
      try {
        testTwoDao.getSessionInfoDao().createSessionInfo(session);
      }
      catch(IOException e) {
        System.err.println("Exception thrown in '" + this.toString() + "' ::: afterConnectionEstablished");
        e.printStackTrace();
      }
    }
  
    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) {
      try {
        SessionInfo si = testTwoDao.getSessionInfoDao().getSessionInfo(session);
        si.handlePacket(message.getPayload());
      }
      catch(IOException e) {
        System.err.println("Exception thrown in '" + this.toString() + "' ::: handleTextMessage");
        e.printStackTrace();
      }
    }
    
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
      try {
        testTwoDao.getSessionInfoDao().destroySessionInfo(session);
      }
      catch(IOException ex) {
        System.err.println("Exception thrown in '" + this.toString() + "' ::: afterConnectionClosed");
        ex.printStackTrace();
      }
    }

}