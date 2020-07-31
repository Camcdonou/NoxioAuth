package org.infpls.noxio.auth.module.auth.dao;

import org.infpls.noxio.auth.module.auth.dao.file.FileDao;
import org.infpls.noxio.auth.module.auth.dao.mail.MailDao;
import org.infpls.noxio.auth.module.auth.dao.pay.PaymentDao;
import org.springframework.stereotype.Component;

import org.infpls.noxio.auth.module.auth.dao.user.UserDao;
import org.infpls.noxio.auth.module.auth.util.Oak;
import org.infpls.noxio.auth.module.auth.util.Settable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

/* @TODO: this class is weird and should get some critical thought about its design before its refactored */

@Component
public class DaoContainer {
  
  @Autowired
  public JdbcTemplate jdbc;
  @Autowired
  private FileDao fileDao;

  private final UserDao userDao;
  private final MailDao mailDao;
  private final PaymentDao paymentDao;
  
  public DaoContainer() {
    Settable.update();                  // This call to Settable.update() ensures all properties are loaded before we start using them.
    Oak.open();                         // Starts logging
    userDao = new UserDao(this);
    mailDao = new MailDao();
    paymentDao = new PaymentDao(this);
  }

  public UserDao getUserDao() { return userDao;  }
  public MailDao getMailDao() { return mailDao;  }
  public FileDao getFileDao() { return fileDao;  }
  public PaymentDao getPaymentDao() { return paymentDao;  }
}
