package org.infpls.noxio.auth.module.auth.dao.mail;

import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;
import org.infpls.noxio.auth.module.auth.util.Oak;
import org.infpls.noxio.auth.module.auth.util.Settable;

public class MailDao {
  
  private final Properties properties;
  public MailDao() {
    properties = System.getProperties();
    properties.put("mail.transport.protocol", "smtp");
    properties.put("mail.smtp.host", Settable.getMailHost());  /* Security concern @TODO: make this ssl */
    properties.put("mail.smtp.port", Settable.getMailPort());
    properties.put("mail.smtp.auth", "true");
  }
  
  /* Returns true if sent, false if not. */
  public boolean send(final String to, final String subject, final String content) {
    Authenticator authenticator = new Authenticator() {
        @Override
        protected PasswordAuthentication getPasswordAuthentication() {
            return new PasswordAuthentication(Settable.getMailUser(), Settable.getMailPass()); /* Security concern @TODO: change password or only allow local login */
        }
    };
    
    final Session session = Session.getDefaultInstance(properties, authenticator);

    try {
      final MimeMessage message = new MimeMessage(session);
      message.setFrom(new InternetAddress(Settable.getMailUser()));
      message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
      message.setSubject(subject);
      message.setContent(content, "text/html; charset=utf-8");

      Transport.send(message);
      return true;
    } catch (MessagingException mex) {
      Oak.log(Oak.Level.WARN, "Failed to send email to: " + to, mex);
      return false;
    }
  }
}
