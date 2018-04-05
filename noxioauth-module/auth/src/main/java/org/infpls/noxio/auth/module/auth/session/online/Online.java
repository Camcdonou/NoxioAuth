package org.infpls.noxio.auth.module.auth.session.online;

import com.google.gson.*;
import java.io.IOException;

import org.infpls.noxio.auth.module.auth.dao.server.InfoDao;
import org.infpls.noxio.auth.module.auth.dao.user.UserUnlocks;
import org.infpls.noxio.auth.module.auth.session.*;

public class Online extends SessionState {
  
  private final InfoDao infoDao;
  public Online(final NoxioSession session, final InfoDao infoDao) throws IOException {
    super(session);
   this.infoDao = infoDao;
    
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
        default : { close("Invalid data: " + p.getType()); break; }
      }
    } catch(IOException | NullPointerException | JsonParseException ex) {
      close(ex);
    }
  }
  
  private void serverInfo(final PacketO02 p) throws IOException {
    sendPacket(new PacketO01(infoDao.getServerList()));
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
  
  @Override
  public void destroy() throws IOException {
    
  }
}
