package org.infpls.noxio.auth.module.auth.dao.user;

import java.io.IOException;
import java.util.*;
import org.springframework.web.socket.WebSocketSession;

import org.infpls.noxio.auth.module.auth.session.NoxioSession;
import org.infpls.noxio.auth.module.auth.dao.DaoContainer;
import org.infpls.noxio.auth.module.auth.util.Hash;
import org.infpls.noxio.auth.module.auth.session.PacketS02;
import org.infpls.noxio.auth.module.auth.util.ID;
import org.springframework.dao.DataAccessException;

/* UserDao handles both user info and logged in user NoxioSessions.
   This is because theres is an overlap in data here
   and seperating these things seems counter-intuitive.
*/

public class UserDao {
  private final DaoContainer dao;
  
  private final List<User> users; /* @FIXME This WILL be changed to a database in time */
  private final List<NoxioSession> sessions; /* This is a list of all active user NoxioSessions. */
  
  public UserDao(final DaoContainer dao) {
    this.dao = dao;
    users = new ArrayList();
    sessions = new ArrayList();
    
    /* @FIXME DEBUG */
    users.add(new User("test",Hash.generate("test")));
    users.add(new User("test2",Hash.generate("test")));
    users.add(new User("test3",Hash.generate("test")));
    users.add(new User("inferno",Hash.generate("test")));
    users.add(new User("infernoplus",Hash.generate("test")));
  }
  
  public synchronized boolean createUser(final String user, final String hash) {
    User u = getUserByName(user);
    if(u != null) { return false; }
    
    final String uid = ID.generate32();
    final String salt = ID.generate32();
    try {
      dao.jdbc.update(
        "INSERT into USERS (UID, NAME, DISPLAY, EMAIL, SALT, HASH, PREMIUM, CREATED, UPDATED) VALUES ( ?, ?, ?, ?, ?, ?, 0, NOW(), NOW() )",
              uid, user, user, "email@email.email", salt, hash
      );
    }
    catch(DataAccessException ex) {
      System.err.println("UserDao::createuser() - Error in SQL!");
      ex.printStackTrace();
      return false;
    }
    
    users.add(new User(user, hash));
    return true;
  }
  
  /*  returns int
    0 - success
    1 - user is already logged in
    2 - incorrect password or username
    3 - user does not exist
  */
  public synchronized int authenticate(final String user, final String hash, final String salt) {
    User u = getUserByName(user);
    if(u == null) { return 3; } //Does user exist?
    if(getSessionByUser(u.getUser()) != null) { return 1; } //Is this user already logged in?
    return Hash.generate(salt+u.getHash()).equals(hash) ? 0 : 2; //Does the password hash match?
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
    for(int i=0;i<sessions.size();i++) {
      if(sessions.get(i).getWebSocketId().equals(webSocket.getId())) {
        sessions.get(i).destroy();
        sessions.remove(i);
        return;
      }
    }
  }
  
  public NoxioSession getSessionByUser(final String user) {
    for(int i=0;i<sessions.size();i++) {
      if(sessions.get(i).loggedIn()) {
        if(sessions.get(i).getUser().equals(user)) {
          try { sessions.get(i).sendPacket(new PacketS02()); } catch(IOException ex) { ex.printStackTrace(); }  // This is a jank fix that heartbeats a session when someone trys to log in on it while its already logged in.
          return sessions.get(i);
        }
      }
    }
    return null;
  }
}
