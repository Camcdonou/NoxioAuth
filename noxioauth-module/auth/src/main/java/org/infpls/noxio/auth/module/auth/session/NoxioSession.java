package org.infpls.noxio.auth.module.auth.session;

import java.io.*;
import org.springframework.web.socket.*;

import org.infpls.noxio.auth.module.auth.dao.DaoContainer;
import org.infpls.noxio.auth.module.auth.session.authenticate.Authenticate;

public class NoxioSession {
  private final WebSocketSession webSocket;
  private final DaoContainer dao;
  
  private String user;
  private SessionState sessionState;
 
  public NoxioSession(WebSocketSession webSocket, DaoContainer dao) throws IOException {
    this.webSocket = webSocket;
    this.dao = dao;
        
    sessionState = new Authenticate(this, dao.getUserDao());
  }
  
  public void handlePacket(final String p) throws IOException {
    sessionState.handlePacket(p);
  }
  
  public void sendPacket(final String p) throws IOException {
    webSocket.sendMessage(new TextMessage(p));
  }
  
  /* State info
    00 - Authentication State
  */
  public void changeState(int s) throws IOException { /* Not a huge fan of how this works */
//    switch(s) {
//      case 0 : { close(); break; } //Login state should never be returned to after inital connection.
//      case 1 : { sessionState = new Chat(this, dao.getChatDao()); break; }
//      default : { close(); break; } //NO.
//    }
  }
  
  public boolean loggedIn() {
    return user != null;
  }
  
  public String getUser() {
    return user;
  }
  
  public String getSessionId() {
    return webSocket.getId();
  }
  
  public void destroy() throws IOException {
    sessionState.destroy();
  }
  
  /* Normal connection close */
  public void close() throws IOException {
    webSocket.close();
  }
  
  /* Error connection close */
  public void close(final String message) throws IOException {
    sendPacket("x00;" + message);
    webSocket.close(CloseStatus.NOT_ACCEPTABLE);
  }
  
  /* Exception connection close */
  public void close(final Exception ex) throws IOException {
    StringWriter sw = new StringWriter();
    PrintWriter pw = new PrintWriter(sw);
    ex.printStackTrace(pw);
    sendPacket("x01;" + ex.getMessage() + ";" + sw.toString());
    webSocket.close(CloseStatus.NOT_ACCEPTABLE);
  }
}
