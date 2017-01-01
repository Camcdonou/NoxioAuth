package org.infpls.noxio.auth.module.testTwo;

import java.io.IOException;
import java.util.*;

public class ChatDao {
  
  private final List<Chat> sessions;
  
  public ChatDao() {
    sessions = new ArrayList();
  }
  
  public void joinChat(Chat c) {
    sessions.add(c);
  }
  
  public void leaveChat(Chat c) {
    for(int i=0;i<sessions.size();i++) {
      if(sessions.get(i) == c) {
        sessions.remove(i);
        return;
      }
    }
  }
  
  public void sendMessage(final String user, final String message) throws IOException {
    for(int i=0;i<sessions.size();i++) {
      sessions.get(i).sendPacket(user + " > " + message);
    }
  }
  
  public String listUsers() {
    String list = "Users Online: ";
    for(int i=0;i<sessions.size();i++) {
      list += sessions.get(i).getUserName() + " ";
    }
    return list;
  }
  
}
