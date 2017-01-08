package org.infpls.noxio.auth.module.testTwo;

import java.io.IOException;
import java.util.*;

public class ChatDao {
  
  private final List<Chat> sessions;
  
  public ChatDao() {
    sessions = new ArrayList();
  }
  
  public void joinChat(Chat c) throws IOException {
    sessions.add(c);
    sendInfo(c.getUserName() + " joined.");
  }
  
  public void leaveChat(Chat c) throws IOException {
    for(int i=0;i<sessions.size();i++) {
      if(sessions.get(i) == c) {
        sessions.remove(i);
        sendInfo(c.getUserName() + " left.");
        return;
      }
    }
  }
  
  public void sendInfo(final String message) throws IOException {
    for(int i=0;i<sessions.size();i++) {
      sessions.get(i).sendInfo(message);
    }
  }
  
  public void recieveMessage(final String user, final String message) throws IOException {
    for(int i=0;i<sessions.size();i++) {
      sessions.get(i).sendMessage(user, message);
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
