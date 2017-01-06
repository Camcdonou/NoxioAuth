package org.infpls.noxio.auth.module.testTwo;

import java.io.IOException;

public class Authenticate extends SessionState {
  
  private final UserDao userDao;
  private final SessionInfoDao sessionInfoDao;
  
  public Authenticate(SessionInfo si, UserDao ud, SessionInfoDao sid) throws IOException {
    super(si);
    
    userDao = ud;
    sessionInfoDao = sid;
    
    sendPacket("a04;");
  }
  
  /* Packet Info [ < outgoing | > incoming ]
     > a00 create account
     > a01 login
     > a02 close
     < a03 create account error
     < a04 login state
     < a05 login account error
     < a06 create account success
  */
  
  public void handlePacket(final String p) throws IOException {
    final String params[] = p.split(";");
    switch(params[0]) {
      case "a00" : { createUser(params); break; }
      case "a01" : { authenticate(params); break; }
      case "a02" : { close(); break; }
      default : { close(); break; }
    }
  }
  
  private void createUser(final String params[]) throws IOException {
    if(userDao.createUser(params[1].toLowerCase(), params[2])) {
      sendPacket("a06;User '" + params[1].toLowerCase() + "' created.");
    }
    else {
      sendPacket("a03;User '" + params[1].toLowerCase() + "' already exists.");
    }
  }
  
  private void authenticate(final String params[]) throws IOException {
    if(userDao.authenticate(params[1].toLowerCase(), params[2])) {
      if(sessionInfoDao.getSessionInfoByUsername(params[1].toLowerCase()) == null) {
        sessionInfo.setUserName(params[1].toLowerCase());
        sessionInfo.changeState(1);
      }
      else {
        sendPacket("a05;User '" + params[1].toLowerCase() + "' is already logged in");
      }
    }
    else {
      sendPacket("a05;Incorrect username or password");
    }
  }
  
  public void destroy() throws IOException {
    
  }
  
}
