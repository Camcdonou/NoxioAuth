package org.infpls.noxio.auth.module.auth.dao;

import org.infpls.noxio.auth.module.auth.dao.mail.MailDao;
import org.springframework.stereotype.Component;

import org.infpls.noxio.auth.module.auth.dao.user.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.jdbc.core.JdbcTemplate;

/* @TODO: this class could probably be removed and everything that refs it coudld just ref UserDao directly. */

@Component
@PropertySource("classpath:noxio.properties")
public class DaoContainer {
  
  @Value("${mail.host}")
  private String host;
  @Value("${mail.port}")
  private String port;
  @Value("${mail.user}")
  private String user;
  @Value("${mail.pass}")
  private String pass;
  
  @Autowired
  public JdbcTemplate jdbc;
  
  private final UserDao userDao;
  private final MailDao mailDao;
  
  public DaoContainer() {
    userDao = new UserDao(this);
    mailDao = new MailDao(host, port, user, pass);
  }

  public UserDao getUserDao() { return userDao;  }
  public MailDao getMailDao() { return mailDao;  }
}
