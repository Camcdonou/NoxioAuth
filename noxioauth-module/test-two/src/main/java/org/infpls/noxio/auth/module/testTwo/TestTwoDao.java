/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.infpls.noxio.auth.module.testTwo;

import org.springframework.stereotype.Component;

/**
 *
 * @author inferno
 */
@Component
public class TestTwoDao {
  
  private final UserDao userDao;
  private final ChatDao chatDao;
  
  public TestTwoDao() {
    userDao = new UserDao();
    chatDao = new ChatDao();
  }

  public UserDao getUserDao() {
    return userDao;
  }
  
  public ChatDao getChatDao() {
    return chatDao;
  }
  
}
