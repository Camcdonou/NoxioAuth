package org.infpls.noxio.auth.module.testTwo;

import java.util.*;

public class UserDao {
  
  private final Map<String,String> users;
  
  public UserDao() {
    users = new HashMap();
  }
  
  public boolean createUser(final String username, final String password) {
    if(users.get(username) != null)
      return false;
    else
      users.put(username,password); //TODO: this is 7 years of pox on your family
    return true;
  }
  
  public boolean authenticate(final String username, final String password) {
    return users.get(username).equals(password);
  }
}
