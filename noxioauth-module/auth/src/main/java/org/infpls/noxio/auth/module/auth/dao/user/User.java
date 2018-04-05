package org.infpls.noxio.auth.module.auth.dao.user;

import java.sql.Timestamp;
import java.util.Map;
import org.springframework.security.crypto.bcrypt.BCrypt;

public class User {  
  public final String uid;                   // Unique ID for user
  public final String name, display, email;  // User is always lower case
  private final String hash;           // Pwd hash and pwd salt
  
  public final boolean premium;              // True if user has payed for the game
  public final Timestamp created, updated, lastLogin;
  
  /* SQL Database Constructor */
  public User(final Map<String, Object> data) {
    uid = (String)data.get("UID");
    name = (String)data.get("NAME");
    display = (String)data.get("DISPLAY");
    email = (String)data.get("EMAIL");
    hash = (String)data.get("HASH");
    premium = (Boolean)data.get("PREMIUM");
    created = (Timestamp)data.get("CREATED");
    updated = (Timestamp)data.get("UPDATED");    
    lastLogin = (Timestamp)data.get("LASTLOGIN");   
  }
  
  /* Guest Constructor */
  public User(final String name, final String display) {
    uid = null;
    this.name = name;
    this.display = display;
    email = null;
    hash = null;
    premium = false;
    created = null;
    updated = null;
    lastLogin = null;
  }
  
  public boolean hashCompare(final String h) { return BCrypt.checkpw(h, hash); }
}
