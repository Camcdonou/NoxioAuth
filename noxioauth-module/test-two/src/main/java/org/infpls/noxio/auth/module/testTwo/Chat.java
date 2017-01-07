package org.infpls.noxio.auth.module.testTwo;

import java.io.IOException;

public class Chat extends SessionState {
  
  private final ChatDao chatDao;
  
  public Chat(SessionInfo si, ChatDao cd) throws IOException {
    super(si);
    
    chatDao = cd;
    
    cd.joinChat(this); //Pass SessionInfo instead of SessionState?
    
    sendPacket("c03;");
  }
  
  /* Packet Info [ < outgoing | > incoming ]
     > c00 recieve message
     > c01 close
     < c03 chat state
     < c04 chat send message
     < c05 send info
  */
  
  @Override
  public void handlePacket(final String p) throws IOException {
    try {
      final String params[] = p.split(";");
      switch(params[0]) {
        case "c00" : { recieveMessage(params); break; }
        case "c01" : { close(); break; }
        default : { close("Invalid data: " + p); break; }
      }
    } catch(IOException ex) {
      close(ex);
    }
  }
  
  private void recieveMessage(final String params[]) throws IOException {
    if(params[1].startsWith("/")) {
      switch(params[1].trim()) {
        case "/list" : { sendInfo(chatDao.listUsers()); break; }
        case "/online" : { sendInfo(chatDao.listUsers()); break; }
        case "/help" : { sendInfo("Valid commands /online /list /help /close /disconnect"); break; }
        case "/close" : { close(); break; }
        case "/disconnect" : { close(); break; }
        default : { sendInfo("Invalid command. Use /help for more."); break; }
      }
    }
    else {
      chatDao.recieveMessage(sessionInfo.getUserName(), params[1]);
    }
  }
  
  public void sendMessage(final String username, final String message) throws IOException {
    sendPacket("c04;" + username + ";" + message);
  }
  
  public void sendInfo(final String message) throws IOException {
    sendPacket("c05;" + message);
  }
  
  public String getUserName() {
    return sessionInfo.getUserName();
  }
  
  @Override
  public void destroy() throws IOException {
    chatDao.leaveChat(this);
  }
  
}
