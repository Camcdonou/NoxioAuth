package org.infpls.noxio.auth.module.auth.dao.mail;

import java.util.Properties;
import javax.annotation.PostConstruct;
import javax.mail.*;
import javax.mail.internet.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class MailDao {
  @Value("${mail.host}")
  private String host;
  @Value("${mail.port}")
  private String port;
  @Value("${mail.user}")
  private String user;
  @Value("${mail.pass}")
  private String pass;
  
  private final Properties properties;
  public MailDao() {
    properties = System.getProperties();
  }
  
  @PostConstruct
  public void init() {
    properties.put("mail.transport.protocol", "smtp");
    properties.put("mail.smtp.host", host);  /* Security concern @TODO: make this ssl */
    properties.put("mail.smtp.port", port);
    properties.put("mail.smtp.auth", "true");
  }
  
  /* Returns true if sent, false if not. */
  public boolean send(final String to, final String subject, final String content) {
    Authenticator authenticator = new Authenticator() {
        @Override
        protected PasswordAuthentication getPasswordAuthentication() {
            return new PasswordAuthentication(user, pass); /* Security concern @TODO: change password or only allow local login */
        }
    };
    
    final Session session = Session.getDefaultInstance(properties, authenticator);

    try {
      final MimeMessage message = new MimeMessage(session);
      message.setFrom(new InternetAddress(user));
      message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
      message.setSubject(subject);
      message.setContent(content, "text/html; charset=utf-8");

      Transport.send(message);
      return true;
    } catch (MessagingException mex) {
      System.err.println("Failed to send email to: " + to);
      mex.printStackTrace();
      return false;
    }
  }
}
