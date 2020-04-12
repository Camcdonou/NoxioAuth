package org.infpls.noxio.auth.module.auth.session.online;

import com.google.gson.*;
import java.io.IOException;
import org.infpls.noxio.auth.module.auth.dao.pay.PaymentDao;
import org.infpls.noxio.auth.module.auth.dao.user.User;
import org.infpls.noxio.auth.module.auth.dao.user.UserDao;
import org.infpls.noxio.auth.module.auth.dao.user.UserUnlocks;
import org.infpls.noxio.auth.module.auth.session.*;
import org.infpls.noxio.auth.module.auth.util.Settable;

public class Online extends SessionState {
  
  private final UserDao userDao;
  
  public Online(final NoxioSession session, final UserDao userDao) throws IOException {
    super(session);
    
    this.userDao = userDao;
    
    sendPacket(new PacketS00('o'));
  }
  
  /* Packet Info [ < outgoing | > incoming ]
     < o00 session id
     < o01 server info
     > o02 request server info
     > o03 state ready
     < o04 unlock list
     > o07 request unlock
     < o08 unlock succeed
     < o09 unlock fail
     > o20 request payment
     < o21 request good & redirect
     < o22 request bad
     > o30 request quickmatch server info
     < o31 send quickmatch server info
     > o40 request admin menu data
     < o41 admin menu data
     > o42 admin ban user
     > o43 admin change user type
     > o44 admin set supporter flag
     > o45 admin global message
     > o46 admin name change
     > o47 admin reset customs
  */
  
  @Override
  public void handlePacket(final String data) throws IOException {
    try {
      final Gson gson = new GsonBuilder().create();
      Packet p = gson.fromJson(data, Packet.class);
      if(p.getType() == null) { close("Invalid data: NULL TYPE"); return; } //Switch statements throw Null Pointer if this happens.
      if(handleGenericPacket(gson, p, data)) { return; }
      switch(p.getType()) {
        case "o02" : { serverInfo(gson.fromJson(data, PacketO02.class)); break; }
        case "o03" : { stateReady(gson.fromJson(data, PacketO03.class)); break; }
        case "o07" : { checkUnlock(gson.fromJson(data, PacketO07.class)); break; }
        case "o20" : { requestPayment(gson.fromJson(data, PacketO20.class)); break; }
        case "o30" : { quickInfo(gson.fromJson(data, PacketO30.class)); break; }
        /* Admin stuff <CHECKED> */
        case "o40" : { adminInfo(gson.fromJson(data, PacketO40.class)); break; }
        case "o42" : { adminSuspendUser(gson.fromJson(data, PacketO42.class)); break; }
        case "o43" : { adminSetUserType(gson.fromJson(data, PacketO43.class)); break; }
        case "o44" : { adminSetUserSupport(gson.fromJson(data, PacketO44.class)); break; }
        case "o45" : { adminSendGlobalMessage(gson.fromJson(data, PacketO45.class)); break; }
        case "o46" : { adminNameChange(gson.fromJson(data, PacketO46.class)); break; }
        case "o47" : { adminResetCustoms(gson.fromJson(data, PacketO47.class)); break; }
        default : { close("Invalid data: " + p.getType()); break; }
      }
    } catch(IOException | NullPointerException | JsonParseException ex) {
      close(ex);
    }
  }
  
  private void serverInfo(final PacketO02 p) throws IOException {
    sendPacket(new PacketO01(Settable.getGameServerInfo()));
  }
  
  private void stateReady(final PacketO03 p) throws IOException {
    sendPacket(new PacketO04(UserUnlocks.getUnlockList()));
  }
  
  /* Confirms the unlock is valid then attempts to unlock it */
  private void checkUnlock(final PacketO07 p) throws IOException {
    final UserUnlocks.Unlock u = UserUnlocks.getUnlock(p.getKey());
    if(u == null) { sendPacket(new PacketO09("Invalid key.")); return; }
    
    /* if result is null then everything is okay, if result has a string then the unlock failed and the string is sent to the client as a message */
    final String result = session.doUnlock(u);
    if(result == null) { sendPacket(new PacketO08()); }
    else { sendPacket(new PacketO09(result)); }
  }
  
  private void requestPayment(final PacketO20 p) throws IOException {
    final PaymentDao.Item item = p.getItem();
    
    /* do */
    final String result = session.doPayment(item);
    if(result != null) { sendPacket(new PacketO21(result)); }
    else { sendPacket(new PacketO22("Failed to create transaction.")); }
  }
  
  private void quickInfo(final PacketO30 p) throws IOException {
    sendPacket(new PacketO31(Settable.getGameServerInfo()));
  }
  
  private boolean isAdmin() {
    return session.getUserData().type == User.Type.ADMIN;
  }
  
  private boolean isMod() {
    return session.getUserData().type == User.Type.ADMIN || session.getUserData().type == User.Type.MOD;
  }
  
  private void adminInfo(final PacketO40 p) throws IOException {
    if(!isMod()) { session.close("Stop right there criminal scum!"); return; }
    sendPacket(new PacketO41(userDao.getAdminInfo()));
  }
  
  private void adminSuspendUser(final PacketO42 p) throws IOException {
    if(!isMod()) { session.close("Stop right there criminal scum!"); return; }
    userDao.setUserSuspended(p.getUid(), p.getLength());
  }
  
  private void adminSetUserType(final PacketO43 p) throws IOException {
    if(!isMod() || p.getUserType() == null) { session.close("Stop right there criminal scum!"); return; }
    if(p.getUserType() == User.Type.ADMIN) { session.close("You do not have permission to upgrade a user to this level."); return; }
    if(p.getUserType() == User.Type.MOD) {
      if(!isAdmin()) { session.close("You do not have permission to upgrade a user to this level."); return; }
    }
    userDao.setUserType(p.getUid(), p.getUserType());
  }
  
  private void adminSetUserSupport(final PacketO44 p) throws IOException {
    if(!isMod()) { session.close("Stop right there criminal scum!"); return; }
    userDao.setUserSupport(p.getUid());
  }
  
  private void adminSendGlobalMessage(final PacketO45 p) throws IOException {
    if(!isMod()) { session.close("Stop right there criminal scum!"); return; }
    userDao.sendGlobalMessage(p.getMessage());
  }
  
  private void adminNameChange(final PacketO46 p) throws IOException {
    if(!isMod()) { session.close("Stop right there criminal scum!"); return; }
    userDao.setUserDisplayName(p.getUid(), p.getName());
  }
  
  private void adminResetCustoms(final PacketO47 p) throws IOException {
    if(!isMod()) { session.close("Stop right there criminal scum!"); return; }
    userDao.resetUserCustoms(p.getUid());
  }
  
  @Override
  public void destroy() throws IOException {
    
  }
}
