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
  
  public synchronized boolean createUser(final String user, final String email, final String hash) throws IOException {
    User u = getUserByName(user);
    if(u != null) { return false; }
    
    final String uid = ID.generate32();
    final String salt = ID.generate32();
    final String sash = Hash.generate(hash + salt);
    final UserSettings us = new UserSettings(uid);
    try {
      dao.jdbc.update(
        "INSERT into USERS ( UID, NAME, DISPLAY, EMAIL, SALT, HASH, PREMIUM, CREATED, UPDATED, LASTLOGIN ) VALUES ( ?, ?, ?, ?, ?, ?, 0, NOW(), NOW(), NOW() )",
              uid, user, user, email, salt, sash
      );
      dao.jdbc.update(
        "INSERT into SETTINGS ( " +
        "UID, UPDATED, " +
        "VOLMASTER, VOLMUSIC, VOLVOICE, VOLANNOUNCER, VOLFX, " +
        "GFXUPGAME, GFXUPUI, GFXUPSKY, GFXSHADOWSIZE, GFXSAFEMODE, " +
        "CONENABLEGAMEPAD, CONACTIONA, CONACTIONB, CONJUMP, CONTAUNT, CONTOSS, CONSCOREBOARD, " +
        "GAMCOLOR, GAMREDCOLOR, GAMBLUECOLOR, GAMUSECUSTOMSOUND, GAMCUSTOMSOUNDFILE, " +
        "TOGDISABLEALTS, TOGDISABLECUSTOMSOUND, TOGDISABLECOLOR " +
        ") VALUES ( ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )",
              uid, 
              us.volume.master, us.volume.music, us.volume.voice, us.volume.announcer, us.volume.fx,
              us.graphics.upGame, us.graphics.upUi, us.graphics.upSky, us.graphics.shadowSize, us.graphics.safeMode,
              us.control.enableGamepad, us.control.actionA, us.control.actionB, us.control.jump, us.control.taunt, us.control.toss, us.control.scoreboard,
              us.game.color, us.game.redColor, us.game.blueColor, us.game.useCustomSound, us.game.getCustomSoundFile(),
              us.toggle.disableAlts, us.toggle.disableCustomSound, us.toggle.disableColor
      );
      dao.jdbc.update(
        "INSERT into STATS ( " +
        "UID, UPDATED, CREDITS, LIFECREDITS, KEELL, DEATH, GAMEWIN, GAMELOSE, BETRAYED, BETRAYL, " +
        "FIRSTBLOOD, KILLJOY, ENDEDREIGN, FLAGCAPTURE, FLAGDEFENSE, HILLCONTROL, PERFECT, HUMILIATION, " +
        "MKX02, MKX03, MKX04, MKX05, MKX06, MKX07, MKX08, MKX09, MKX10, MKX11, MKX12, MKX13, MKX14, MKX15, MKX16, MKX17, MKX18, MKX19, MKX20, " +
        "KSX05, KSX10, KSX15, KSX20, KSX25, KSX30, " +
        "CUMRES " +
        ") VALUES ( ?, NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ? )",
              uid, (int)(Math.random()*37)
      );
      dao.jdbc.update(
        "INSERT into UNLOCKS ( " +
        "UID, UPDATED, " +
        "CHAR_BOX, CHAR_CRATE, CHAR_VOXEL, CHAR_CARGO, CHAR_BLOCK, CHAR_QUAD, CHAR_INFERNO, " +
        "ALT_BOXGOLD, ALT_QUADFIRE, ALT_BOXRED, ALT_CRATEORANGE, ALT_VOXELGREEN, ALT_BLOCKROUND, " +
        "FT_COLOR, FT_SOUND " +
        ") VALUES ( ?, NOW(), true, false, false, false, false, false, false, false, false, false, false, false, false, false, false )",
              uid
      );
      /* @TODO: unlocks will be difficult to add to in the future so it may be worthwhile to stream line it in some form. */
    }
    catch(DataAccessException ex) {
      System.err.println("UserDao::createuser() - SQL Error!");
      ex.printStackTrace();
      throw new IOException("SQL Error during account creation.");
    }
    
    return true;
  }
  
  /*  returns int @TODO: i dont like this style of return so just change it to a != null stringy one
    0 - success
    1 - user is already logged in
    2 - incorrect password or username
    3 - user does not exist
  */
  public synchronized int authenticate(final String user, final String hash) throws IOException {
    User u = getUserByName(user);
    if(u == null) { return 3; } //Does user exist?
    if(getSessionByUser(u.name) != null) { return 1; } //Is this user already logged in?
    return u.hashCompare(hash) ? 0 : 2; //Does the password hash match?
  }
  
  public User getUserByName(final String user) throws IOException {
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
      throw new IOException("SQL Error during user lookup.");
    }
    catch(ClassCastException | NullPointerException ex) {
      System.err.println("UserDao::getUserByName() - SQL Data Mapping Error!");
      ex.printStackTrace();
      throw new IOException("SQL Error during user lookup.");
    }
    return null;
  }
  
  public User getUserByEmail(final String email) throws IOException {
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
      throw new IOException("SQL Error during user lookup.");
    }
    catch(ClassCastException | NullPointerException ex) {
      System.err.println("UserDao::getUserByEmail() - SQL Data Mapping Error!");
      ex.printStackTrace();
      throw new IOException("SQL Error during user lookup.");
    }
    return null;
  }
  
  /* Flags a given unlock */
  public void changeUserPassword(final User usr, final String hash) throws IOException {
    final String sash = usr.salt(hash);
    try {
      dao.jdbc.update(
        "UPDATE USERS SET " +
        "UPDATED = NOW(), HASH = ?" +
        "WHERE UID=?",
              sash, usr.uid
      );
    }
    catch(DataAccessException ex) {
      System.err.println("UserDao::changeUserPassword() - SQL Error!");
      ex.printStackTrace();
      throw new IOException("SQL Error during user unlock.");
    }
  }
  
  public UserSettings getUserSettings(final String uid) throws IOException {
    try {
      final List<Map<String,Object>> results = dao.jdbc.queryForList(
        "SELECT * FROM SETTINGS WHERE UID=?",
        uid
      );
      if(results.size() > 0) {
        return new UserSettings(results.get(0));
      }
    }
    catch(DataAccessException ex) {
      System.err.println("UserDao::getUserSettings() - SQL Error!");
      ex.printStackTrace();
      throw new IOException("SQL Error during user settings retrieval.");
    }
    catch(ClassCastException | NullPointerException ex) {
      System.err.println("UserDao::getUserSettings() - SQL Data Mapping Error!");
      ex.printStackTrace();
      throw new IOException("SQL Error during user settings retrieval.");
    }
    return null;
  }
    
  public void saveUserSettings(final UserSettings us) throws IOException {
    try {
      dao.jdbc.update(
        "UPDATE SETTINGS SET " +
        "UPDATED=NOW(), " +
        "VOLMASTER=?, VOLMUSIC=?, VOLVOICE=?, VOLANNOUNCER=?, VOLFX=?, " +
        "GFXUPGAME=?, GFXUPUI=?, GFXUPSKY=?, GFXSHADOWSIZE=?, GFXSAFEMODE=?, " +
        "CONENABLEGAMEPAD=?, CONACTIONA=?, CONACTIONB=?, CONJUMP=?, CONTAUNT=?, CONTOSS=?, CONSCOREBOARD=?, " +
        "GAMCOLOR=?, GAMREDCOLOR=?, GAMBLUECOLOR=?, GAMUSECUSTOMSOUND=?, GAMCUSTOMSOUNDFILE=?, " +
        "TOGDISABLEALTS=?, TOGDISABLECUSTOMSOUND=?, TOGDISABLECOLOR=? " +
        "WHERE UID=?",
              us.volume.master, us.volume.music, us.volume.voice, us.volume.announcer, us.volume.fx,
              us.graphics.upGame, us.graphics.upUi, us.graphics.upSky, us.graphics.shadowSize, us.graphics.safeMode,
              us.control.enableGamepad, us.control.actionA, us.control.actionB, us.control.jump, us.control.taunt, us.control.toss, us.control.scoreboard,
              us.game.color, us.game.redColor, us.game.blueColor, us.game.useCustomSound, us.game.getCustomSoundFile(),
              us.toggle.disableAlts, us.toggle.disableCustomSound, us.toggle.disableColor,
              us.uid
      );
    }
    catch(DataAccessException ex) {
      System.err.println("UserDao::saveUserSettings() - SQL Error!");
      ex.printStackTrace();
      throw new IOException("SQL Error during user settings save.");
    }
  }
    
  public UserStats getUserStats(final String uid) throws IOException {
    try {
      final List<Map<String,Object>> results = dao.jdbc.queryForList(
        "SELECT x.*, c.GLOBALCOUNT FROM (SELECT t.*, @rownum := @rownum + 1 AS RANK FROM STATS AS t, (SELECT @rownum := 0) AS r ORDER BY LIFECREDITS DESC) AS x, (SELECT COUNT(*) AS GLOBALCOUNT FROM STATS) AS c WHERE UID=?",
        uid
      );
      if(results.size() > 0) {
        return new UserStats(results.get(0));
      }
    }
    catch(DataAccessException ex) {
      System.err.println("UserDao::getUserStats() - SQL Error!");
      ex.printStackTrace();
      throw new IOException("SQL Error during user stats retrieval.");
    }
    catch(ClassCastException | NullPointerException ex) {
      System.err.println("UserDao::getUserStats() - SQL Data Mapping Error!");
      ex.printStackTrace();
      throw new IOException("SQL Error during user stats retrieval.");
    }
    return null;
  }
  
  public void saveUserStats(final UserStats us) throws IOException {
    try {
      dao.jdbc.update(
        "UPDATE STATS SET " +
        "UPDATED = NOW(), CREDITS=?, LIFECREDITS=?, KEELL=?, DEATH=?, GAMEWIN=?, GAMELOSE=?, BETRAYED=?, BETRAYL=?, " +
        "FIRSTBLOOD=?, KILLJOY=?, ENDEDREIGN=?, FLAGCAPTURE=?, FLAGDEFENSE=?, HILLCONTROL=?, PERFECT=?, HUMILIATION=?, " +
        "MKX02=?, MKX03=?, MKX04=?, MKX05=?, MKX06=?, MKX07=?, MKX08=?, MKX09=?, MKX10=?, MKX11=?, MKX12=?, MKX13=?, MKX14=?, MKX15=?, MKX16=?, MKX17=?, MKX18=?, MKX19=?, MKX20=?, " +
        "KSX05=?, KSX10=?, KSX15=?, KSX20=?, KSX25=?, KSX30=?, " +
        "CUMRES=? " +
        "WHERE UID=?",
              us.getCredits(), us.lifeCredits, us.kill, us.death, us.gameWin, us.gameLose, us.betrayed, us.betrayl,
              us.firstBlood, us.killJoy, us.endedReign, us.flagCapture, us.flagDefense, us.hillControl, us.perfect, us.humiliation,
              us.mkx02, us.mkx03, us.mkx04, us.mkx05, us.mkx06, us.mkx07, us.mkx08, us.mkx09, us.mkx10, us.mkx11, us.mkx12, us.mkx13, us.mkx14, us.mkx15, us.mkx16, us.mkx17, us.mkx18, us.mkx19, us.mkx20,
              us.ksx05, us.ksx10, us.ksx15, us.ksx20, us.ksx25, us.ksx30,
              us.cumRes,
              us.uid
      );
    }
    catch(DataAccessException ex) {
      System.err.println("UserDao::saveUserStats() - SQL Error!");
      ex.printStackTrace();
      throw new IOException("SQL Error during user stats save.");
    }
  }
  
  public UserUnlocks getUserUnlocks(final String uid) throws IOException {
    try {
      final List<Map<String,Object>> results = dao.jdbc.queryForList(
        "SELECT * FROM UNLOCKS WHERE UID=?",
        uid
      );
      if(results.size() > 0) {
        return new UserUnlocks(results.get(0));
      }
    }
    catch(DataAccessException ex) {
      System.err.println("UserDao::getUserUnlocks() - SQL Error!");
      ex.printStackTrace();
      throw new IOException("SQL Error during user unlocks retrieval.");
    }
    catch(ClassCastException | NullPointerException ex) {
      System.err.println("UserDao::getUserUnlocks() - SQL Data Mapping Error!");
      ex.printStackTrace();
      throw new IOException("SQL Error during user unlocks retrieval.");
    }
    return null;
  }
  
  /* Flags a given unlock */
  public void doUserUnlock(final UserUnlocks uu, final UserUnlocks.Key key) throws IOException {
    try {
      dao.jdbc.update(
        "UPDATE UNLOCKS SET " +
        "UPDATED = NOW(), " + key.name() + " = true " + /* This should be perfectly safe, UserUnlocks.Key is a final static enum. No chance of injection AFAIK */
        "WHERE UID=?",
              uu.uid
      );
    }
    catch(DataAccessException ex) {
      System.err.println("UserDao::doUserUnlock() - SQL Error!");
      ex.printStackTrace();
      throw new IOException("SQL Error during user unlock.");
    }
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
          try { sessions.get(i).sendPacket(new PacketS02()); } catch(IOException ex) { ex.printStackTrace(); }  // @TODO: This is a jank fix that heartbeats a session when someone trys to log in on it while its already logged in.
          return sessions.get(i);
        }
      }
    }
    return null;
  }
}
