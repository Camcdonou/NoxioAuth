package org.infpls.noxio.auth.module.auth.session.authenticate;

import java.io.IOException;

import org.infpls.noxio.auth.module.auth.dao.user.UserDao;
import org.infpls.noxio.auth.module.auth.session.NoxioSession;
import org.infpls.noxio.auth.module.auth.session.SessionState;


public class Authenticate extends SessionState {
  
  private final UserDao userDao;
  
  public Authenticate(NoxioSession session, UserDao userDao) throws IOException {
    super(session);
    
    this.userDao = userDao;
    
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
  
  @Override
  public void handlePacket(final String p) throws IOException {
    try {
      final String params[] = p.split(";");
      switch(params[0]) {
        case "a00" : { createUser(params); break; }
        case "a01" : { authenticate(params); break; }
        case "a02" : { close(); break; }
        default : { close("Invalid data: " + p); break; }
      }
    } catch(IOException ex) {
      close(ex);
    }
  }
  
  private void createUser(final String params[]) throws IOException {

  }
  
  private void authenticate(final String params[]) throws IOException {

  }
  
  @Override
  public void destroy() throws IOException {
    
  }
  
}
