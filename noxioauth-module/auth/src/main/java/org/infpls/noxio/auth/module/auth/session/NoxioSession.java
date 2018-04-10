package org.infpls.noxio.auth.module.auth.session;

import java.io.*;
import com.google.gson.*;
import org.springframework.web.socket.*;

import org.infpls.noxio.auth.module.auth.dao.DaoContainer;
import org.infpls.noxio.auth.module.auth.dao.pay.PaymentDao;
import org.infpls.noxio.auth.module.auth.dao.user.*;
import org.infpls.noxio.auth.module.auth.session.authenticate.Authenticate;
import org.infpls.noxio.auth.module.auth.session.error.*;
import org.infpls.noxio.auth.module.auth.session.online.Online;
import org.infpls.noxio.auth.module.auth.util.ID;

public class NoxioSession {
  private final WebSocketSession webSocket;
  protected final DaoContainer dao;
  
  protected String sid;
  protected User user;
  protected UserSettings settings;
  protected UserStats stats;
  protected UserUnlocks unlocks;
  
  protected SessionState sessionState;
 
  public static NoxioSession create(final WebSocketSession webSocket, final DaoContainer dao) throws IOException {
    final NoxioSession session = new NoxioSession(webSocket, dao);
    session.init();
    return session;
  }
  
  protected NoxioSession(final WebSocketSession webSocket, final DaoContainer dao) throws IOException {
    this.webSocket = webSocket;
    this.dao = dao;
  }
  
  /* Called after construction */
  public void init() throws IOException {
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
  public void changeState(final int s) throws IOException { /* Not a huge fan of how this works. */
    sessionState.destroy();
    switch(s) {
      case 1 : { sessionState = new Online(this, dao.getInfoDao()); break; }
      default : { close(); break; } //NO.
    }
  }
  
  public void login(final String usr) throws IOException {
    if(loggedIn()) { throw new IOException("This session is already logged in!"); }
    sid = ID.generate32();
    user = dao.getUserDao().getUserByName(usr);
    settings = dao.getUserDao().getUserSettings(user.uid);
    stats = dao.getUserDao().getUserStats(user.uid);
    unlocks = dao.getUserDao().getUserUnlocks(user.uid);
    if(user == null || settings == null || stats == null || unlocks == null) { close("Fatal error during login. Please contact support."); return; }
    sendPacket(new PacketS01(user.name, sid, user.display, isGuest(), settings, stats, unlocks));
    changeState(1);
  }
  
  public void saveSettings(final UserSettings usrsets) throws IOException {
    settings = new UserSettings(settings, usrsets);
    saveSettings();
  }
  
  public void saveSettings() throws IOException {
    dao.getUserDao().saveUserSettings(settings);
  }
  
  public String doUnlock(final UserUnlocks.Unlock unlock) throws IOException {
    /* Checks */
    if(unlocks.has(unlock.key)) { return "You already have this unlocked."; }
    if(stats.getCredits() <= unlock.price) { return "You do not have enough credits."; }
    
    /* Unlock */
    unlocks.unlock(unlock.key);
    dao.getUserDao().doUserUnlock(unlocks, unlock.key);
    stats.subtractCredits(unlock.price);
    saveStats();
    sendPacket(new PacketS05(unlocks));
    return null;
  }
  
  public String doPayment(final PaymentDao.Item item) throws IOException {
    if(item == null) { return null; }
    switch(item) {
      case SPEC : { if(User.Type.SPEC.level <= user.getType().level) { return null; } break; }
      case FULL : { if(User.Type.FULL.level <= user.getType().level) { return null; } break; }
      default : { throw new IOException("Invalid Item ENUM -> NoxioSession::doPayment()"); }
    }

    return dao.getPaymentDao().doPayment(user, item);
  }
  
  public void recordStats(final PacketH01.Stats nuStats) {
    stats = stats.add(nuStats);
    try { saveStats(); }
    catch(IOException ex) {
      ex.printStackTrace();
    }
  }
  
  protected void saveStats() throws IOException {
    if(loggedIn()) {
      dao.getUserDao().saveUserStats(stats);
      if(isOpen()) { sendPacket(new PacketS04(stats)); }
    }
  }
  
  public UserSettings getSettings() { return settings; }
  public UserUnlocks getUnlocks() { return unlocks; }
  
  public UserData getUserData() {
    if(!loggedIn()) { return null; }
    return new UserData(user, settings, unlocks);
  }
  
  public boolean loggedIn() {
    return user != null && isOpen();
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
  
  public boolean isGuest() {
    return false;
  }
  
  public void destroy() throws IOException {
    saveStats();
    if(sessionState != null) { sessionState.destroy(); }
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
  
  public class UserData {
    public final String uid;                   // Unique ID for user
    public final String name, display;         // User is always lower case
    public final User.Type type;               // Payed/Unpayed user table (see User.java)

    public final UserSettings settings;
    public final UserUnlocks unlocks;

    public UserData(final User user, final UserSettings settings, final UserUnlocks unlocks) {
      uid = user.uid;
      name = user.name; display = user.display;
      type = user.getType();
      this.settings = settings; this.unlocks = unlocks;
    }
  }
}
