package org.infpls.noxio.auth.module.auth.dao.user;

import java.sql.Timestamp;
import java.util.Map;
import org.infpls.noxio.auth.module.auth.util.Hash;

public class User {  
  public final String uid;                   // Unique ID for user
  public final String name, display, email;  // User is always lower case
  private final String hash, salt;           // Pwd hash and pwd salt
  
  public final boolean premium;              // True if user has payed for the game
  public final Timestamp created, updated, lastLogin;
  
  public User(final Map<String, Object> data) {
    uid = (String)data.get("UID");
    name = (String)data.get("NAME");
    display = (String)data.get("DISPLAY");
    email = (String)data.get("EMAIL");
    hash = (String)data.get("HASH");
    salt = (String)data.get("SALT");
    premium = (Boolean)data.get("PREMIUM");
    created = (Timestamp)data.get("CREATED");
    updated = (Timestamp)data.get("UPDATED");    
    lastLogin = (Timestamp)data.get("LASTLOGIN");   
  }
  
  public boolean hashCompare(final String h) { return Hash.generate(h+salt).equals(hash); }
  public String salt(final String h) { return Hash.generate(h + salt); }
}
