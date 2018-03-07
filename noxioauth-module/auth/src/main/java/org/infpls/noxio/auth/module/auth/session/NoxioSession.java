package org.infpls.noxio.auth.module.auth.session;

import java.io.*;
import com.google.gson.*;
import org.springframework.web.socket.*;

import org.infpls.noxio.auth.module.auth.dao.DaoContainer;
import org.infpls.noxio.auth.module.auth.dao.user.*;
import org.infpls.noxio.auth.module.auth.session.authenticate.Authenticate;
import org.infpls.noxio.auth.module.auth.session.error.*;
import org.infpls.noxio.auth.module.auth.session.online.Online;
import org.infpls.noxio.auth.module.auth.util.ID;

public class NoxioSession {
  private final WebSocketSession webSocket;
  private final DaoContainer dao;
  
  private String sid;
  private User user;
  private UserSettings settings;
  private UserStats stats;
  
  private SessionState sessionState;
 
  public NoxioSession(final WebSocketSession webSocket, final DaoContainer dao) throws IOException {
    this.webSocket = webSocket;
    this.dao = dao;
        
    sessionState = new Authenticate(this, dao.getUserDao(), dao.getMailDao());
  }
  
  public void handlePacket(final String data) throws IOException {
    
    sessionState.handlePacket(data);
  }
  
  public void sendPacket(final Packet p) throws IOException {
    final Gson gson = new GsonBuilder().create();
    webSocket.sendMessage(new TextMessage(gson.toJson(p)));
  }
  
  /* State info
    00 - Authentication State
    01 - Online State
  */
  public void changeState(final int s) throws IOException { /* Not a huge fan of how this works */
    sessionState.destroy();
    switch(s) {
      case 1 : { sessionState = new Online(this); break; }
      default : { close(); break; } //NO.
    }
  }
  
  public void login(final String usr) throws IOException {
    if(loggedIn()) { throw new IOException("This session is already logged in!"); }
    sid = ID.generate32();
    user = dao.getUserDao().getUserByName(usr);
    settings = dao.getUserDao().getUserSettings(user.uid);
    stats = dao.getUserDao().getUserStats(user.uid);
    if(user == null || settings == null || stats == null) { close("Fatal error during login. Please contact support."); return; }
    sendPacket(new PacketS01(user.name, sid, settings, stats));
    changeState(1);
  }
  
  public void saveSettings(final UserSettings usrsets) throws IOException {
    settings = new UserSettings(settings, usrsets);
    dao.getUserDao().saveUserSettings(settings);
  }
  
  private void saveStats() throws IOException {
    dao.getUserDao().saveUserStats(stats);
    if(isOpen()) { sendPacket(new PacketS04(stats)); }
  }
  
  public boolean loggedIn() {
    return user != null;
  }
  
  public String getUser() {
    return user.name;
  }
  
  public String getSessionId() {
    return sid;
  }
  
  public String getWebSocketId() {
    return webSocket.getId();
  }
  
  public boolean isOpen() { 
    return webSocket.isOpen();
  }
  
  public void destroy() throws IOException {
    saveStats();
    sessionState.destroy();
  }
  
  /* Normal connection close */
  public void close() throws IOException {
    webSocket.close();
  }
  
  /* Error connection close */
  public void close(final String message) throws IOException {
    sendPacket(new PacketX00(message));
    webSocket.close(CloseStatus.NOT_ACCEPTABLE);
  }
  
  /* Exception connection close */
  public void close(final Exception ex) throws IOException {
    StringWriter sw = new StringWriter();
    PrintWriter pw = new PrintWriter(sw);
    ex.printStackTrace(pw);
    sendPacket(new PacketX01(ex.getMessage(), sw.toString()));
    webSocket.close(CloseStatus.NOT_ACCEPTABLE);
  }
}
