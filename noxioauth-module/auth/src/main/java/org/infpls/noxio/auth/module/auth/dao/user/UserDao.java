package org.infpls.noxio.auth.module.auth.dao.user;

import java.io.IOException;
import java.util.*;
import org.springframework.web.socket.WebSocketSession;

import org.infpls.noxio.auth.module.auth.session.NoxioSession;
import org.infpls.noxio.auth.module.auth.dao.DaoContainer;

/* UserDao handles both user info and logged in user NoxioSessions.
   This is because theres is an overlap in data here
   and seperating these things seems counter-intuitive.
*/

public class UserDao {
  private final List<User> users; /* This WILL be changed to a database in time */
  private final List<NoxioSession> sessions; /* This is a list of all active user NoxioSessions. */
  
  public UserDao() {
    users = new ArrayList();
    sessions = new ArrayList();
  }
  
  public synchronized boolean createUser(final String user, final String hash) {
    User u = getUserByName(user);
    
    if(u != null) {
      return false;
    }
    
    users.add(new User(user, hash));
    return true;
  }
  
  public synchronized boolean authenticate(final String user, final String salt, final String hash) {
    User u = getUserByName(user);
    
    //TODO!!!
    
    return true;
  }
  
  public User getUserByName(final String user) {
    for(int i=0;i<users.size();i++) {
      if(users.get(i).getUser().equalsIgnoreCase(user)) {
        return users.get(i);
      }
    }
    return null;
  }
    
  public NoxioSession createSession(final WebSocketSession webSocket, DaoContainer dao) throws IOException {
    NoxioSession session = new NoxioSession(webSocket, dao);
    sessions.add(session);
    return session;
  }
  
  public void destroySession(final WebSocketSession webSocket) throws IOException {
    System.out.println("HI?");
    for(int i=0;i<sessions.size();i++) {
      if(sessions.get(i).getSessionId().equals(webSocket.getId())) {
        sessions.get(i).destroy();
        sessions.remove(i);
        return;
      }
    }
  }
  
  public NoxioSession getSessionByUser(final String user) {
    for(int i=0;i<sessions.size();i++) {
      if(sessions.get(i).getUser().equals(user)) {
        return sessions.get(i);
      }
    }
    return null;
  }
}
