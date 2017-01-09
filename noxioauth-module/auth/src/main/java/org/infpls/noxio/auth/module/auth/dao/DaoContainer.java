package org.infpls.noxio.auth.module.auth.dao;

import org.springframework.stereotype.Component;

import org.infpls.noxio.auth.module.auth.dao.user.UserDao;

@Component
public class DaoContainer {
  
  private final UserDao userDao;
  
  public DaoContainer() {
    userDao = new UserDao();
  }

  public UserDao getUserDao() { return userDao;  }
}
