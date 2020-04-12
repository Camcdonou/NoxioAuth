package org.infpls.noxio.auth.module.auth.dao.user;

import java.lang.reflect.Field;
import java.sql.Timestamp;
import java.util.Map;
import org.infpls.noxio.auth.module.auth.util.Oak;

/* This is class is used when an admin/mod retreives user data. */
/* It is identical to User.java except it does not contain the password hash */
/* The reason for this should be super obvious. */

public class UserInfo {
  public static enum Type {
    FREE(0), SPEC(1), FULL(2), MOD(3), ADMIN(4);
    
    public final int level;
    Type(int lvl) { level = lvl; } 
  }
  
  public final String uid;                   // Unique ID for user
  public final String name, display, email;  // User is always lower case
  public final String customSound;           // Filename of custom sound file for this account. null/undefined if none exists
  public final String customMsgA, customMsgB;// Custom win message strings
  
  private Type type;
  public final boolean supporter;            // Outside supporter flag
  public final Timestamp created, updated, lastLogin, suspendUntil;
  
  /* SQL Database Constructor */
  public UserInfo(final Map<String, Object> data) {
    uid = (String)data.get("UID");
    name = (String)data.get("NAME");
    display = (String)data.get("DISPLAY");
    email = (String)data.get("EMAIL");
    supporter = (boolean)data.get("SUPPORTER");
    created = (Timestamp)data.get("CREATED");
    updated = (Timestamp)data.get("UPDATED");
    lastLogin = (Timestamp)data.get("LASTLOGIN");
    customSound = (String)data.get("GAMCUSTOMSOUNDFILE");
    customMsgA = (String)data.get("GAMCUSTOMMESSAGEA");
    customMsgB = (String)data.get("GAMCUSTOMMESSAGEB");
    suspendUntil = data.get("SUSPENDUNTIL") != null ? (Timestamp)data.get("SUSPENDUNTIL") : null;
    
      try {
        final String typ = (String)data.get("TYPE");
        final Field en = Type.class.getField(typ);
        type = ((Type)en.get(null));
      }
      catch(NoSuchFieldException | IllegalAccessException ex) {
        Oak.log(Oak.Type.SQL, Oak.Level.CRIT, "Error parsing user data from database.", ex);
      }
  }
}
