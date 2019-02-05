package org.infpls.noxio.auth.module.auth.dao.user;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.*;
import org.springframework.web.socket.WebSocketSession;

import org.infpls.noxio.auth.module.auth.session.*;
import org.infpls.noxio.auth.module.auth.dao.DaoContainer;
import org.infpls.noxio.auth.module.auth.util.Hash;
import org.infpls.noxio.auth.module.auth.session.PacketS02;
import org.infpls.noxio.auth.module.auth.util.ID;
import org.infpls.noxio.auth.module.auth.util.Oak;
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
    sessions = Collections.synchronizedList(new ArrayList());
  }
  
  public synchronized boolean createUser(final String user, final String email, final String hash) throws IOException {
    User u = getUserByName(user);
    if(u != null) { return false; }
    
    final String uid = ID.generate32();
    final String sash = Hash.bcrypt(hash);
    final UserSettings us = new UserSettings(uid);
    try {
      dao.jdbc.update(
        "INSERT into USERS ( UID, NAME, DISPLAY, EMAIL, HASH, TYPE, SUPPORTER, CREATED, UPDATED, LASTLOGIN, SUSPENDUNTIL ) VALUES ( ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW(), ? )",
              uid, user, user, email, sash, User.Type.FREE.name(), false, null
      );
      dao.jdbc.update(
        "INSERT into SETTINGS ( " +
        "UID, UPDATED, " +
        "VOLMASTER, VOLMUSIC, VOLVOICE, VOLANNOUNCER, VOLUI, VOLFX, " +
        "GFXUPGAME, GFXUPUI, GFXUPSKY, GFXSHADOWSIZE, GFXSAFEMODE, " +
        "CONENABLEGAMEPAD, CONACTIONA, CONACTIONB, CONJUMP, CONTAUNT, CONTOSS, CONSCOREBOARD, " +
        "GAMCOLOR, GAMREDCOLOR, GAMBLUECOLOR, GAMCUSTOMMESSAGEA, GAMCUSTOMMESSAGEB, GAMUSECUSTOMSOUND, GAMCUSTOMSOUNDFILE, GAMLAGCOMP, " +
        "TOGDISABLEALTS, TOGDISABLECUSTOMSOUND, TOGDISABLECOLOR, TOGDISABLELOG, TOGDISABLEMETER " +
        ") VALUES ( ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )",
              uid, 
              us.volume.master, us.volume.music, us.volume.voice, us.volume.announcer, us.volume.ui, us.volume.fx,
              us.graphics.upGame, us.graphics.upUi, us.graphics.upSky, us.graphics.shadowSize, us.graphics.safeMode,
              us.control.enableGamepad, us.control.actionA, us.control.actionB, us.control.jump, us.control.taunt, us.control.toss, us.control.scoreboard,
              us.game.color, us.game.redColor, us.game.blueColor, us.game.customMessageA, us.game.customMessageB, us.game.useCustomSound, us.game.getCustomSoundFile(), us.game.lagComp,
              us.toggle.disableAlts, us.toggle.disableCustomSound, us.toggle.disableColor, us.toggle.disableLog, us.toggle.disableMeter
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
        "CHAR_BOX, CHAR_CRATE " +
        ") VALUES ( ?, NOW(), true, true )",
              uid
      );
    }
    catch(DataAccessException ex) {
      Oak.log(Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error during account creation.");
    }
    
    return true;
  }
  
  /* Return error message string or null if valid */
  public synchronized String authenticate(final String user, final String hash) throws IOException {
    User u = getUserByName(user);
    if(u == null) { return "Incorrect Username or Password."; } //Does user exist?
    if(getSessionByUser(u.name) != null) { return "User is already logged in."; } //Is this user already logged in?
    if(u.suspendUntil != null && u.suspendUntil.getTime() > new Date().getTime()) { return "This account is suspended until: " + u.suspendUntil.toString(); }
    return u.hashCompare(hash) ? null : "Incorrect Username or Password."; //Does the password hash match?
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
      Oak.log(Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error during user lookup.");
    }
    catch(ClassCastException | NullPointerException ex) {
      Oak.log(Oak.Level.CRIT, "SQL Data Mapping Error!", ex);
      throw new IOException("SQL Error during user lookup.");
    }
    return null;
  }
  
  public User getUserByUid(final String uid) throws IOException {
    try {
      final List<Map<String,Object>> results = dao.jdbc.queryForList(
        "SELECT * FROM USERS WHERE UID=?",
        uid
      );
      if(results.size() > 0) {
        return new User(results.get(0));
      }
    }
    catch(DataAccessException ex) {
      Oak.log(Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error during user lookup.");
    }
    catch(ClassCastException | NullPointerException ex) {
      Oak.log(Oak.Level.CRIT, "SQL Data Mapping Error!", ex);
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
      Oak.log(Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error during user lookup.");
    }
    catch(ClassCastException | NullPointerException ex) {
      Oak.log(Oak.Level.CRIT, "SQL Data Mapping Error!", ex);
      throw new IOException("SQL Error during user lookup.");
    }
    return null;
  }
  
  public void changeUserPassword(final User usr, final String hash) throws IOException {
    final String sash = Hash.bcrypt(hash);
    try {
      dao.jdbc.update(
        "UPDATE USERS SET " +
        "UPDATED = NOW(), HASH = ?" +
        "WHERE UID=?",
              sash, usr.uid
      );
    }
    catch(DataAccessException ex) {
      Oak.log(Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error during password change.");
    }
  }
  
  /* Changes a users account type */
  public void setUserType(final String uid, final User.Type type) throws IOException {
    try {
      dao.jdbc.update(
        "UPDATE USERS SET " +
        "UPDATED = NOW(), TYPE = ?" +
        "WHERE UID=?",
              type.name(), uid
      );
    }
    catch(DataAccessException ex) {
      Oak.log(Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error during account type change.");
    }
  }
  
  /* Sets supporter flag to true */
  public void setUserSupport(final String uid) throws IOException {
    try {
      dao.jdbc.update(
        "UPDATE USERS SET " +
        "UPDATED = NOW(), SUPPORTER = ?" +
        "WHERE UID=?",
              true, uid
      );
    }
    catch(DataAccessException ex) {
      Oak.log(Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error during account type change.");
    }
  }
  
  /* Bans user for <length> milliseconds */
  public void setUserSuspended(final String uid, final long length) throws IOException {
    try {
      dao.jdbc.update(
        "UPDATE USERS SET " +
        "UPDATED = NOW(), SUSPENDUNTIL = ?" +
        "WHERE UID=?",
              new Date(new Date().getTime() + length), uid
      );
    }
    catch(DataAccessException ex) {
      Oak.log(Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error during account type change.");
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
      Oak.log(Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error during user settings retrieval.");
    }
    catch(ClassCastException | NullPointerException ex) {
      Oak.log(Oak.Level.CRIT, "SQL Data Mapping Error!", ex);
      throw new IOException("SQL Error during user settings retrieval.");
    }
    return null;
  }
    
  public void saveUserSettings(final UserSettings us) throws IOException {
    try {
      dao.jdbc.update(
        "UPDATE SETTINGS SET " +
        "UPDATED=NOW(), " +
        "VOLMASTER=?, VOLMUSIC=?, VOLVOICE=?, VOLANNOUNCER=?, VOLUI=?, VOLFX=?, " +
        "GFXUPGAME=?, GFXUPUI=?, GFXUPSKY=?, GFXSHADOWSIZE=?, GFXSAFEMODE=?, " +
        "CONENABLEGAMEPAD=?, CONACTIONA=?, CONACTIONB=?, CONJUMP=?, CONTAUNT=?, CONTOSS=?, CONSCOREBOARD=?, " +
        "GAMCOLOR=?, GAMREDCOLOR=?, GAMBLUECOLOR=?, GAMCUSTOMMESSAGEA=?, GAMCUSTOMMESSAGEB=?, GAMUSECUSTOMSOUND=?, GAMCUSTOMSOUNDFILE=?, GAMLAGCOMP=?, " +
        "TOGDISABLEALTS=?, TOGDISABLECUSTOMSOUND=?, TOGDISABLECOLOR=? , TOGDISABLELOG=?, TOGDISABLEMETER=? " +
        "WHERE UID=?",
              us.volume.master, us.volume.music, us.volume.voice, us.volume.announcer, us.volume.ui, us.volume.fx,
              us.graphics.upGame, us.graphics.upUi, us.graphics.upSky, us.graphics.shadowSize, us.graphics.safeMode,
              us.control.enableGamepad, us.control.actionA, us.control.actionB, us.control.jump, us.control.taunt, us.control.toss, us.control.scoreboard,
              us.game.color, us.game.redColor, us.game.blueColor, us.game.customMessageA, us.game.customMessageB, us.game.useCustomSound, us.game.getCustomSoundFile(), us.game.lagComp,
              us.toggle.disableAlts, us.toggle.disableCustomSound, us.toggle.disableColor, us.toggle.disableLog, us.toggle.disableMeter,
              us.uid
      );
    }
    catch(DataAccessException ex) {
      Oak.log(Oak.Level.CRIT, "SQL Error!", ex);
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
      Oak.log(Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error during user stats retrieval.");
    }
    catch(ClassCastException | NullPointerException ex) {
      Oak.log(Oak.Level.CRIT, "SQL Data Mapping Error!", ex);
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
      Oak.log(Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error during user stats save.");
    }
  }
  
  public UserUnlocks getUserUnlocks(final String uid) throws IOException {
    try {
      final List<Map<String,Object>> results = dao.jdbc.queryForList(
        "SELECT UNLOCKS.*, USERS.TYPE FROM UNLOCKS JOIN USERS ON UNLOCKS.UID=USERS.UID WHERE UNLOCKS.UID=?",
        uid
      );
      if(results.size() > 0) {
        return new UserUnlocks(results.get(0));
      }
    }
    catch(DataAccessException ex) {
      Oak.log(Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error during user unlocks retrieval.");
    }
    catch(ClassCastException | NullPointerException ex) {
      Oak.log(Oak.Level.CRIT, "SQL Data Mapping Error!", ex);
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
      Oak.log(Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error during user unlock.");
    }
  }
  
  public List<UserInfo> getAdminInfo() throws IOException {
    try {
      final List<Map<String,Object>> results = dao.jdbc.queryForList(
        "SELECT UID, NAME, DISPLAY, EMAIL, TYPE, SUPPORTER, CREATED, UPDATED, LASTLOGIN, SUSPENDUNTIL FROM USERS"
      );
      List<UserInfo> users = new ArrayList();
      for(int i=0;i<results.size();i++) {
        users.add(new UserInfo(results.get(i)));
      }
      return users;
    }
    catch(DataAccessException ex) {
      Oak.log(Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error during user lookup.");
    }
    catch(ClassCastException | NullPointerException ex) {
      Oak.log(Oak.Level.CRIT, "SQL Data Mapping Error!", ex);
      throw new IOException("SQL Error during user lookup.");
    }
  }
    
  public NoxioSession createSession(final WebSocketSession webSocket, DaoContainer dao) throws IOException {
    NoxioSession session = NoxioSession.create(webSocket, dao);
    sessions.add(session);
    return session;
  }
  
  public NoxioSession createSessionGuest(final WebSocketSession webSocket, DaoContainer dao) throws IOException {
    NoxioSession session = NoxioSessionGuest.create(webSocket, dao);
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
          try { sessions.get(i).sendPacket(new PacketS02()); } catch(IOException ex) { Oak.log(Oak.Level.ERR, "Failed to send hearbeat.", ex); }  // @TODO: This is a jank fix that heartbeats a session when someone trys to log in on it while its already logged in.
          return sessions.get(i);
        }
      }
    }
    return null;
  }
}
