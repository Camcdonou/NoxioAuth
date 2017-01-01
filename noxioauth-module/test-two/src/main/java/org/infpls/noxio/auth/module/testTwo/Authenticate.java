package org.infpls.noxio.auth.module.testTwo;

import java.io.IOException;

public class Authenticate extends SessionState {
  
  private UserDao userDao;
  
  public Authenticate(SessionInfo si, UserDao ud) throws IOException {
    super(si);
    
    userDao = ud;
    
    sendPacket("Connection State: Authentication.");
  }
  
  /* Packet Info
     - a00 create account 
     - a01 login
     - a02 close
  */
  
  public void handlePacket(final String p) throws IOException {
    final String params[] = p.split(";");
    switch(params[0]) {
      case "a00" : { createUser(params); break; }
      case "a01" : { authenticate(params); break; }
      case "a02" : { sendPacket("Disconnect by user."); sessionInfo.close(); break; }
      default : { sendPacket("Invalid request: Disconnect by Server."); sessionInfo.close(); break; }
    }
  }
  
  private void createUser(final String params[]) throws IOException {
    if(userDao.createUser(params[1], params[2])) {
      sendPacket("User '" + params[1] + "' created.");
    }    
    else {
      sendPacket("User '" + params[1] + "' already exists.");
    }
  }
  
  private void authenticate(final String params[]) throws IOException {
    if(userDao.authenticate(params[1], params[2])) {
      sendPacket("Logged in as '" + params[1] + "'.");
      sessionInfo.setUserName(params[1]);
      sessionInfo.changeState(1);
    }
    else {
      sendPacket("Incorrect username or password.");
    }
  }
  
  public void close() throws IOException {
    
  }
  
}
