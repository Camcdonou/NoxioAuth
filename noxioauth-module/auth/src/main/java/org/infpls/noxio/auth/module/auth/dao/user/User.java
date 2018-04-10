package org.infpls.noxio.auth.module.auth.dao.user;

import java.lang.reflect.Field;
import java.sql.Timestamp;
import java.util.Map;
import org.springframework.security.crypto.bcrypt.BCrypt;

public class User {
  public static enum Type {
    FREE(0), SPEC(1), FULL(2), MOD(3), ADMIN(4);
    
    public final int level;
    Type(int lvl) { level = lvl; } 
  }
  
  public final String uid;                   // Unique ID for user
  public final String name, display, email;  // User is always lower case
  private final String hash;                 // Pwd hash and pwd salt
  
  private Type type;      
  public final Timestamp created, updated, lastLogin;
  
  /* SQL Database Constructor */
  public User(final Map<String, Object> data) {
    uid = (String)data.get("UID");
    name = (String)data.get("NAME");
    display = (String)data.get("DISPLAY");
    email = (String)data.get("EMAIL");
    hash = (String)data.get("HASH");
    created = (Timestamp)data.get("CREATED");
    updated = (Timestamp)data.get("UPDATED");
    lastLogin = (Timestamp)data.get("LASTLOGIN");
    
      try {
        final String typ = (String)data.get("TYPE");
        final Field en = Type.class.getField(typ);
        type = ((Type)en.get(null));
      }
      catch(NoSuchFieldException | IllegalAccessException ex) {
        System.err.println("User::new - Error parsing transaction data from database.");
        ex.printStackTrace();
      }
  }
  
  /* Guest Constructor */
  public User(final String name, final String display) {
    uid = null;
    this.name = name;
    this.display = display;
    email = null;
    hash = null;
    type = Type.FREE;
    created = null;
    updated = null;
    lastLogin = null;
  }
  
  public boolean hashCompare(final String h) { return BCrypt.checkpw(h, hash); }
  public Type getType() { return type; }
}
