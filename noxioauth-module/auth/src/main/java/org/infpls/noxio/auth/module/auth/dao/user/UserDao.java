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

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/* UserDao handles both user info and logged in user NoxioSessions.
   This is because theres is an overlap in data here
   and seperating these things seems counter-intuitive.
*/

public class UserDao {
  private final DaoContainer dao;
  private final Map<String, NoxioSession> sessionsByWsId; /* Look up session by WebSocket ID */
  private final Map<String, NoxioSession> sessionsByUser; /* Look up session by Username */

  private LeaderboardCache leaderboardCache;
  private static final long LEADERBOARD_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private final ExecutorService statExecutor;

  public UserDao(final DaoContainer dao) {
    this.dao = dao;
    sessionsByWsId = new ConcurrentHashMap<>();
    sessionsByUser = new ConcurrentHashMap<>();
    statExecutor = Executors.newFixedThreadPool(2);
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
              uid, user, user, email, sash, User.Type.FULL.name(), false, null
      );
      dao.jdbc.update(
        "INSERT into SETTINGS ( " +
        "UID, UPDATED, " +
        "VOLMASTER, VOLMUSIC, VOLVOICE, VOLANNOUNCER, VOLUI, VOLFX, " +
        "GFXUPGAME, GFXUPUI, GFXUPSKY, GFXSHADOWSIZE, GFXSAFEMODE, GFXBLOOM, " +
        "CONENABLEGAMEPAD, CONACTIONA, CONACTIONB, CONJUMP, CONTAUNT, CONTOSS, CONSCOREBOARD, " +
        "GAMCOLOR, GAMREDCOLOR, GAMBLUECOLOR, GAMCUSTOMMESSAGEA, GAMCUSTOMMESSAGEB, GAMUSECUSTOMSOUND, GAMCUSTOMSOUNDFILE, GAMLAGCOMP, " +
        "TOGDISABLEALTS, TOGDISABLECUSTOMSOUND, TOGDISABLECOLOR, TOGDISABLELOG, TOGDISABLEMETER " +
        ") VALUES ( ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              uid, 
              us.volume.master, us.volume.music, us.volume.voice, us.volume.announcer, us.volume.ui, us.volume.fx,
              us.graphics.upGame, us.graphics.upUi, us.graphics.upSky, us.graphics.shadowSize, us.graphics.safeMode, us.graphics.bloom,
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
        "UID, UPDATED " +
        ") VALUES ( ?, NOW() )",
              uid
      );
    }
    catch(DataAccessException ex) {
      Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Error!", ex);
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
      Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error during user lookup.");
    }
    catch(ClassCastException | NullPointerException ex) {
      Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Data Mapping Error!", ex);
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
      Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error during user lookup.");
    }
    catch(ClassCastException | NullPointerException ex) {
      Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Data Mapping Error!", ex);
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
      Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Error!", ex);
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
      Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Error!", ex);
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
      Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Error!", ex);
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
      Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error during account suspension.");
    }
  }
  
  /* Changes display name on user, does not affect actual login name */
  public void setUserDisplayName(final String uid, final String name) throws IOException {
    try {
      dao.jdbc.update(
        "UPDATE USERS SET " +
        "UPDATED = NOW(), DISPLAY = ? " +
        "WHERE UID=?",
          name, uid
      );
    }
    catch(DataAccessException ex) {
      Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error during account display name change.");
    }
  }
  
  /* Changes adds credits to a users account */
  public void addUserCredits(final String uid, final int amount) throws IOException {
    try {
      dao.jdbc.update(
        "UPDATE STATS SET " +
        "CREDITS = CREDITS + ? " +
        "WHERE UID=?",
          amount, uid
      );
    }
    catch(DataAccessException ex) {
      Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error while adding credits to user.");
    }
  }
  
  /* Removes custom messages and sounds */
  public void resetUserCustoms(final String uid) throws IOException {
    try {
      dao.jdbc.update(
        "UPDATE SETTINGS SET " +
        "GAMCUSTOMMESSAGEA = NULL, GAMCUSTOMMESSAGEB = NULL, GAMCUSTOMSOUNDFILE = NULL, GAMUSECUSTOMSOUND = FALSE " +
        "WHERE UID=?",
          uid
      );
    }
    catch(DataAccessException ex) {
      Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error while resetting user customs.");
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
      Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error during user settings retrieval.");
    }
    catch(ClassCastException | NullPointerException ex) {
      Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Data Mapping Error!", ex);
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
        "GFXUPGAME=?, GFXUPUI=?, GFXUPSKY=?, GFXSHADOWSIZE=?, GFXSAFEMODE=?, GFXBLOOM=?, " +
        "CONENABLEGAMEPAD=?, CONACTIONA=?, CONACTIONB=?, CONJUMP=?, CONTAUNT=?, CONTOSS=?, CONSCOREBOARD=?, " +
        "GAMCOLOR=?, GAMREDCOLOR=?, GAMBLUECOLOR=?, GAMCUSTOMMESSAGEA=?, GAMCUSTOMMESSAGEB=?, GAMUSECUSTOMSOUND=?, GAMCUSTOMSOUNDFILE=?, GAMLAGCOMP=?, " +
        "TOGDISABLEALTS=?, TOGDISABLECUSTOMSOUND=?, TOGDISABLECOLOR=? , TOGDISABLELOG=?, TOGDISABLEMETER=? " +
        "WHERE UID=?",
              us.volume.master, us.volume.music, us.volume.voice, us.volume.announcer, us.volume.ui, us.volume.fx,
              us.graphics.upGame, us.graphics.upUi, us.graphics.upSky, us.graphics.shadowSize, us.graphics.safeMode, us.graphics.bloom,
              us.control.enableGamepad, us.control.actionA, us.control.actionB, us.control.jump, us.control.taunt, us.control.toss, us.control.scoreboard,
              us.game.color, us.game.redColor, us.game.blueColor, us.game.customMessageA, us.game.customMessageB, us.game.useCustomSound, us.game.getCustomSoundFile(), us.game.lagComp,
              us.toggle.disableAlts, us.toggle.disableCustomSound, us.toggle.disableColor, us.toggle.disableLog, us.toggle.disableMeter,
              us.uid
      );
    }
    catch(DataAccessException ex) {
      Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Error!", ex);
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
      Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error during user stats retrieval.");
    }
    catch(ClassCastException | NullPointerException ex) {
      Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Data Mapping Error!", ex);
      throw new IOException("SQL Error during user stats retrieval.");
    }
    return null;
  }
  
  public List<UserStats> getLeaderboard(int max) throws IOException {
    if (leaderboardCache != null && leaderboardCache.isValid(max)) {
      return leaderboardCache.data;
    }

    try {
      final List<UserStats> res = new ArrayList();
      final List<Map<String,Object>> results = dao.jdbc.queryForList(
        "SELECT x.*, c.GLOBALCOUNT FROM (SELECT t.*, USERS.NAME, @rownum := @rownum + 1 AS RANK FROM STATS AS t INNER JOIN USERS ON t.UID=USERS.UID, (SELECT @rownum := 0) AS r ORDER BY LIFECREDITS DESC) AS x, (SELECT COUNT(*) AS GLOBALCOUNT FROM STATS) AS c WHERE GLOBALCOUNT<=?",
        max
      );
      for(int i=0;i<results.size();i++) {
        res.add(new UserStats(results.get(i)));
      }
      leaderboardCache = new LeaderboardCache(res, max);
      return res;
    }
    catch(DataAccessException ex) {
      Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error during user stats retrieval.");
    }
    catch(ClassCastException | NullPointerException ex) {
      Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Data Mapping Error!", ex);
      throw new IOException("SQL Error during user stats retrieval.");
    }
  }

  private class LeaderboardCache {
    final List<UserStats> data;
    final long timestamp;
    final int max;

    LeaderboardCache(List<UserStats> data, int max) {
      this.data = data;
      this.max = max;
      this.timestamp = System.currentTimeMillis();
    }

    boolean isValid(int requestedMax) {
      return max >= requestedMax && (System.currentTimeMillis() - timestamp) < LEADERBOARD_CACHE_TTL;
    }
  }
  
  public void saveUserStats(final UserStats us) {
    statExecutor.submit(() -> {
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
        Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Error!", ex);
      }
    });
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
      Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error during user unlocks retrieval.");
    }
    catch(ClassCastException | NullPointerException ex) {
      Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Data Mapping Error!", ex);
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
      Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error during user unlock.");
    }
  }
  
  public List<UserInfo> getAdminInfo() throws IOException {
    try {
      final List<Map<String,Object>> results = dao.jdbc.queryForList(
        "SELECT " +
        "USERS.UID, USERS.NAME, USERS.DISPLAY, USERS.EMAIL, USERS.TYPE, USERS.SUPPORTER, USERS.CREATED, USERS.UPDATED, USERS.LASTLOGIN, USERS.SUSPENDUNTIL, " +
        "SETTINGS.GAMCUSTOMSOUNDFILE, SETTINGS.GAMCUSTOMMESSAGEA, SETTINGS.GAMCUSTOMMESSAGEB " +
        "FROM USERS INNER JOIN SETTINGS ON USERS.UID=SETTINGS.UID"
      );
      List<UserInfo> users = new ArrayList();
      for(int i=0;i<results.size();i++) {
        users.add(new UserInfo(results.get(i)));
      }
      return users;
    }
    catch(DataAccessException ex) {
      Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Error!", ex);
      throw new IOException("SQL Error during user lookup.");
    }
    catch(ClassCastException | NullPointerException ex) {
      Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "SQL Data Mapping Error!", ex);
      throw new IOException("SQL Error during user lookup.");
    }
  }
    
  public synchronized NoxioSession createSession(final WebSocketSession webSocket, DaoContainer dao) throws IOException {
    NoxioSession session = NoxioSession.create(webSocket, dao);
    sessionsByWsId.put(webSocket.getId(), session);
    return session;
  }
  
  public synchronized NoxioSession createSessionGuest(final WebSocketSession webSocket, DaoContainer dao) throws IOException {
    NoxioSession session = NoxioSessionGuest.create(webSocket, dao);
    sessionsByWsId.put(webSocket.getId(), session);
    return session;
  }

  public synchronized void registerLoggedInSession(final NoxioSession session) {
    if(session.loggedIn()) {
      sessionsByUser.put(session.getUser(), session);
    }
  }
  
  public synchronized void destroySession(final WebSocketSession webSocket) throws IOException {
    final NoxioSession s = sessionsByWsId.remove(webSocket.getId());
    if (s != null) {
      if (s.loggedIn()) {
        sessionsByUser.remove(s.getUser());
      }
      try { s.destroy(); }
      catch(Exception ex) { Oak.log(Oak.Type.SESSION, Oak.Level.ERR, "Failed to destroy session.", ex); }
    }
  }
  
  public synchronized NoxioSession getSessionByUser(final String user) {
    final NoxioSession s = sessionsByUser.get(user);
    if(s != null && s.loggedIn()) {
      try { s.sendPacket(new PacketS02()); } catch(IOException ex) { Oak.log(Oak.Type.SESSION, Oak.Level.ERR, "Failed to send hearbeat.", ex); }  // @TODO: This is a jank fix that heartbeats a session when someone trys to log in on it while its already logged in.
      return s;
    }
    return null;
  }

  /* Sends a message to all online users */
  public void sendGlobalMessage(String message) {
    for(NoxioSession s : sessionsByWsId.values()) {
      try {
        if(s.isOpen()) { s.sendPacket(new PacketS45(message)); }
      }
      catch(Exception ex) { Oak.log(Oak.Type.SESSION, Oak.Level.ERR, "Failed to send global message to user."); }
    }
  }
}
