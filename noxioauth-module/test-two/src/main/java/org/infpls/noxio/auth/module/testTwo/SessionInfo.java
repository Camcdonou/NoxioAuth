package org.infpls.noxio.auth.module.testTwo;

import java.io.*;
import org.springframework.web.socket.*;

public class SessionInfo {
  private final WebSocketSession session;
  private final TestTwoDao dao;
  
  private String username;
  private SessionState sessionState;
 
  public SessionInfo(WebSocketSession s, TestTwoDao t) throws IOException {
    session = s;
    dao = t;
        
    sessionState = new Authenticate(this, dao.getUserDao(), dao.getSessionInfoDao());
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
  
  public void destroy() throws IOException {
    sessionState.destroy();
  }
  
  /* Normal connection close */
  public void close() throws IOException {
    session.close();
  }
  
  /* Error connection close */
  public void close(final String message) throws IOException {
    sendPacket("x00;" + message);
    session.close(CloseStatus.NOT_ACCEPTABLE);
  }
  
  /* Exception connection close */
  public void close(final Exception ex) throws IOException {
    StringWriter sw = new StringWriter();
    PrintWriter pw = new PrintWriter(sw);
    ex.printStackTrace(pw);
    sendPacket("x01;" + ex.getMessage() + ";" + sw.toString());
    session.close(CloseStatus.NOT_ACCEPTABLE);
  }
}
