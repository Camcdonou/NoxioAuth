package org.infpls.noxio.auth.module.auth.dao.mail;

import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;

public class MailDao {
  private final Properties properties;
  private final String from;
  private final String user, pass;
  public MailDao(final String host, final String port, final String user, final String pass) {
    properties = System.getProperties();
    properties.put("mail.transport.protocol", "smtp");
    properties.put("mail.smtp.host", host);  /* Security concern @TODO: make this ssl */
    properties.put("mail.smtp.port", port);
    properties.put("mail.smtp.auth", "true");
    
    from = user;
    this.user = user;
    this.pass = pass;
  }
  
  /* Returns true if sent, false if not. */
  public boolean send(final String to) {
    Authenticator authenticator = new Authenticator() {
        @Override
        protected PasswordAuthentication getPasswordAuthentication() {
            return new PasswordAuthentication(user, pass); /* Security concern @TODO: change password or only allow local login */
        }
    };
    
    final Session session = Session.getDefaultInstance(properties, authenticator);

    try {
      final MimeMessage message = new MimeMessage(session);
      message.setFrom(new InternetAddress(from));
      message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
      message.setSubject("20XX Verify Email");
      message.setText("Your verification code is: blergh23");

      Transport.send(message);
      return true;
    } catch (MessagingException mex) {
      System.err.println("Failed to send email to: " + to);
      mex.printStackTrace();
      return false;
    }
  }
}
