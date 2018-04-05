package org.infpls.noxio.auth.module.auth.dao;

import org.infpls.noxio.auth.module.auth.dao.file.FileDao;
import org.infpls.noxio.auth.module.auth.dao.mail.MailDao;
import org.infpls.noxio.auth.module.auth.dao.server.InfoDao;
import org.springframework.stereotype.Component;

import org.infpls.noxio.auth.module.auth.dao.user.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

/* @TODO: this class could probably be removed and everything that refs it coudld just ref UserDao directly. */

@Component
public class DaoContainer {
  
  @Autowired
  public JdbcTemplate jdbc;
  @Autowired
  private MailDao mailDao;
  @Autowired
  private FileDao fileDao;
  @Autowired
  private InfoDao infoDao;
  
  private final UserDao userDao;
  
  public DaoContainer() {
    userDao = new UserDao(this);
  }

  public UserDao getUserDao() { return userDao;  }
  public MailDao getMailDao() { return mailDao;  }
  public FileDao getFileDao() { return fileDao;  }
  public InfoDao getInfoDao() { return infoDao;  }
}
