package org.infpls.noxio.auth.module.auth.session.online;

import com.google.gson.*;
import java.io.IOException;
import java.util.*;

import org.infpls.noxio.auth.module.auth.dao.server.ServerInfo;
import org.infpls.noxio.auth.module.auth.session.*;

public class Online extends SessionState {
  
  
  public Online(final NoxioSession session) throws IOException {
    super(session);
    
    sendPacket(new PacketS00('o'));
  }
  
  /* Packet Info [ < outgoing | > incoming ]
     < o00 session id
     < o01 server info
     > o02 request server info
     > o03 state ready
  */
  
  @Override
  public void handlePacket(final String data) throws IOException {
    try {
      final Gson gson = new GsonBuilder().create();
      Packet p = gson.fromJson(data, Packet.class);
      if(p.getType() == null) { close("Invalid data: NULL TYPE"); return; } //Switch statements throw Null Pointer if this happens.
      switch(p.getType()) {
        case "o02" : { serverInfo(gson.fromJson(data, PacketO02.class)); break; }
        case "o03" : { stateReady(gson.fromJson(data, PacketO03.class)); break; }
        default : { close("Invalid data: " + p.getType()); break; }
      }
    } catch(IOException | NullPointerException | JsonParseException ex) {
      close(ex);
    }
  }
  
  private void serverInfo(final PacketO02 p) throws IOException {
    /* @TODO Dummy data */
    final List<ServerInfo> predef = new ArrayList();
    predef.add(new ServerInfo("EXT-TEST-1", "68.34.229.231", 7001));
    predef.add(new ServerInfo("INT-TEST-1", "10.0.0.253", 7001));
    predef.add(new ServerInfo("LOC-TEST-1", "localhost", 7001));
    sendPacket(new PacketO01(predef));
  }
  
  private void stateReady(final PacketO03 p) throws IOException {
    
  }
  
  @Override
  public void destroy() throws IOException {
    
  }
}
