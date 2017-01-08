package org.infpls.noxio.auth.module.testTwo;

import org.springframework.stereotype.Component;

@Component
public class TestTwoDao {
  
  private final UserDao userDao;
  private final ChatDao chatDao;
  private final SessionInfoDao sessionInfoDao;
  
  public TestTwoDao() {
    userDao = new UserDao();
    chatDao = new ChatDao();
    sessionInfoDao = new SessionInfoDao(this);
  }

  public UserDao getUserDao() {
    return userDao;
  }
  
  public ChatDao getChatDao() {
    return chatDao;
  }
  
  public SessionInfoDao getSessionInfoDao() {
    return sessionInfoDao;
  }
  
}
