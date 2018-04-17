package org.infpls.noxio.auth.module.auth.session;

import java.io.IOException;
import org.springframework.web.socket.WebSocketSession;

import org.infpls.noxio.auth.module.auth.dao.DaoContainer;
import org.infpls.noxio.auth.module.auth.dao.pay.PaymentDao;
import org.infpls.noxio.auth.module.auth.dao.user.*;
import org.infpls.noxio.auth.module.auth.session.online.Online;
import org.infpls.noxio.auth.module.auth.util.*;

/* This version of NoxioSession is used for guest sessions.
   It overides any database writes and creates default settings and unlocks to use.
   It also replaces user account info with defaults/generated values.
   This session automatically ''''logs in'''' when created
*/
public class NoxioSessionGuest extends NoxioSession {
  
  public static NoxioSession create(final WebSocketSession webSocket, final DaoContainer dao) throws IOException {
    final NoxioSession session = new NoxioSessionGuest(webSocket, dao);
    session.init();
    return session;
  }
  
  protected NoxioSessionGuest(final WebSocketSession webSocket, final DaoContainer dao) throws IOException {
    super(webSocket, dao);
  }
  
  /* Called after construction */
  @Override
  public void init() throws IOException {
    if(loggedIn()) { throw new IOException("This session is already logged in!"); }
    sid = ID.generate32();
    final String usr = ID.generate32();
    if(dao.getUserDao().getUserByName(usr) != null) { close("Error during guest login, 256bit id collision. You should buy a lottery ticket."); return; }
    user = new User(usr, Bingis.get());
    settings = new UserSettings((String)null);
    stats = new UserStats();
    unlocks = new UserUnlocks();
    if(user == null || settings == null || stats == null || unlocks == null) { close("Fatal error during login. Please contact support."); return; }
    sendPacket(new PacketS01(user.name, sid, user.display, user.getType(), isGuest(), settings, stats, unlocks));
    sessionState = new Online(this);
  }
  
  @Override
  public void login(final String usr) throws IOException {
    throw new IOException("Guest Session called invalid function :: login()");
  }
  
  @Override
  public void saveSettings() throws IOException { }
  
  @Override
  public String doUnlock(final UserUnlocks.Unlock unlock) throws IOException {
    /* Checks */
    if(unlocks.has(unlock.key)) { return "You already have this unlocked."; }
    if(stats.getCredits() < unlock.price) { return "You do not have enough credits."; }
    
    /* Unlock */
    unlocks.unlock(unlock.key);
    stats.subtractCredits(unlock.price);
    saveStats();
    sendPacket(new PacketS05(unlocks));
    return null;
  }
  
  @Override
  public String doPayment(final PaymentDao.Item item) throws IOException {
    throw new IOException("Guest Session called invalid function :: doPayment()");
  }
  
  @Override
  public void postPayment() throws IOException {
    throw new IOException("Guest Session called invalid function :: postPayment()");
  }
  
  @Override
  protected void saveStats() throws IOException {
    sendPacket(new PacketS04(stats));
  }
  
  @Override
  public boolean isGuest() {
    return true;
  }
  
  @Override
  public void destroy() throws IOException {
    sessionState.destroy();
  }
}
