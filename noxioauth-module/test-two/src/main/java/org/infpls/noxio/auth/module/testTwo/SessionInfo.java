package org.infpls.noxio.auth.module.testTwo;

import java.io.IOException;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.TextMessage;

public class SessionInfo {
  private final WebSocketSession session;
  private final TestTwoDao dao;
  
  private String username;
  private SessionState sessionState;
 
  public SessionInfo(WebSocketSession s, TestTwoDao t) throws IOException {
    session = s;
    dao = t;
    
    sendPacket("Connected to server.");
    
    sessionState = new Authenticate(this, dao.getUserDao());
  }
  
  public void handlePacket(final String p) throws IOException {
    sessionState.handlePacket(p);
  }
  
  public void sendPacket(final String p) throws IOException {
    session.sendMessage(new TextMessage(p));
  }
  
  /* State info
    00 - Authentication State
    01 - Chat Server State
  */
  public void changeState(int s) throws IOException {
    switch(s) {
      case 0 : { close(); break; } //Login state should never be returned to after inital connection.
      case 1 : { sessionState = new Chat(this, dao.getChatDao()); break; }
      default : { close(); break; } //NO.
    }
  }
  
  public boolean loggedIn() {
    return username != null;
  }
  
  public void setUserName(final String u) {
    username = u;
  }
  
  public String getUserName() {
    return username;
  }
  
  public void close() throws IOException {
    sessionState.close();
    if(session.isOpen()) {
      session.close();
    }
  }
}
