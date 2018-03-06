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
  private final List<NoxioSession> sessions; /* This is a list of all active user NoxioSessions. */
  
  public UserDao(final DaoContainer dao) {
    this.dao = dao;
    sessions = new ArrayList();
  }
  
  public synchronized boolean createUser(final String user, final String email, final String hash) {
    User u = getUserByName(user);
    if(u != null) { return false; }
    
    final String uid = ID.generate32();
    final String salt = ID.generate32();
    final String sash = Hash.generate(hash + salt);
    try {
      dao.jdbc.update(
        "INSERT into USERS (UID, NAME, DISPLAY, EMAIL, SALT, HASH, PREMIUM, CREATED, UPDATED, LASTLOGIN) VALUES ( ?, ?, ?, ?, ?, ?, 0, NOW(), NOW(), NOW() )",
              uid, user, user, email, salt, sash
      );
    }
    catch(DataAccessException ex) {
      System.err.println("UserDao::createuser() - SQL Error!");
      ex.printStackTrace();
      return false;
    }
    
    return true;
  }
  
  /*  returns int @TODO: i dont like this style of return so just change it to a != null stringy one
    0 - success
    1 - user is already logged in
    2 - incorrect password or username
    3 - user does not exist
  */
  public synchronized int authenticate(final String user, final String hash) {
    User u = getUserByName(user);
    if(u == null) { return 3; } //Does user exist?
    if(getSessionByUser(u.name) != null) { return 1; } //Is this user already logged in?
    return u.hashCompare(hash) ? 0 : 2; //Does the password hash match?
  }
  
  public User getUserByName(final String user) {
    try {
      final List<Map<String,Object>> results = dao.jdbc.queryForList(
        "SELECT * FROM USERS WHERE NAME=?",
        user
      );
      if(results.size() > 0) {
        return new User(results.get(0));
      }
    }
    catch(DataAccessException ex) {
      System.err.println("UserDao::getUserByName() - SQL Error!");
      ex.printStackTrace();
    }
    catch(ClassCastException | NullPointerException ex) {
      System.err.println("UserDao::getUserByName() - SQL Data Mapping Error!");
      ex.printStackTrace();
    }
    return null;
  }
  
  public User getUserByEmail(final String email) {
    try {
      final List<Map<String,Object>> results = dao.jdbc.queryForList(
        "SELECT * FROM USERS WHERE EMAIL=?",
        email
      );
      if(results.size() > 0) {
        return new User(results.get(0));
      }
    }
    catch(DataAccessException ex) {
      System.err.println("UserDao::getUserByEmail() - SQL Error!");
      ex.printStackTrace();
    }
    catch(ClassCastException | NullPointerException ex) {
      System.err.println("UserDao::getUserByEmail() - SQL Data Mapping Error!");
      ex.printStackTrace();
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
