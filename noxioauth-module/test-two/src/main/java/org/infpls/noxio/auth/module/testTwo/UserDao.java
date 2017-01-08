package org.infpls.noxio.auth.module.testTwo;

import java.util.*;

public class UserDao {
  
  private final Map<String,String> users;
  
  public UserDao() {
    users = new HashMap();
  }
  
  public synchronized boolean createUser(final String username, final String password) {
    if(users.get(username.toLowerCase()) != null) {
      return false;
    }
    users.put(username.toLowerCase(),password); //TODO: this is 7 years of pox on your family
    return true;
  }
  
  public synchronized boolean authenticate(final String username, final String password) { //check already logged in?
    final String un = users.get(username.toLowerCase());
    if(un != null) {
      return un.equals(password);
    }
    return false;
  }
}
