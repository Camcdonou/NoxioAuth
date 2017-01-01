package org.infpls.noxio.auth.module.testTwo;

import java.io.IOException;

public class Chat extends SessionState {
  
  private final ChatDao chatDao;
  
  public Chat(SessionInfo si, ChatDao cd) throws IOException {
    super(si);
    
    chatDao = cd;
    
    cd.joinChat(this);
    
    sendPacket("Connection State: Chat.");
  }
  
  /* Packet Info
     - c00 send message
     - c01 close
     - c02 lise online users
  */
  
  public void handlePacket(final String p) throws IOException {
    final String params[] = p.split(";");
    switch(params[0]) {
      case "c00" : { sendMessage(params); break; }
      case "c01" : { sendPacket("Disconnect by user."); sessionInfo.close(); break; }
      case "c02" : { sendPacket(chatDao.listUsers()); break; }
      default : { sendPacket("Invalid request: Disconnect by Server."); sessionInfo.close(); break; }
    }
  }
  
  private void sendMessage(final String params[]) throws IOException {
    chatDao.sendMessage(sessionInfo.getUserName(), params[1]);
  }
  
  public String getUserName() {
    return sessionInfo.getUserName();
  }
  
  public void close() throws IOException { //TODO: closing is really bad and confusing, pls fix kthx
    chatDao.leaveChat(this);
  }
  
}
