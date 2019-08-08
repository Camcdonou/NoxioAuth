package org.infpls.noxio.auth.module.auth.dao.mail;

import java.util.Date;
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
    properties.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
    properties.put("mail.smtp.starttls.enable", "true");
  }
  
  /* Returns true if sent, false if not. */
  public boolean send(final String to, final String subject, final String html, final String text) {
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
      message.setSentDate(new Date());
      message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
      message.setSubject(subject);
      message.setContent(mpMessage(text, html));
      message.addHeader("List-Unsubscribe","<https://20xx.io/nxc/unsubscribe>");

      Transport.send(message);
      return true;
    } catch (MessagingException mex) {
      Oak.log(Oak.Level.WARN, "Failed to send email to: " + to, mex);
      return false;
    }
  }
  
  private Multipart mpMessage(String messageText, String messageHtml) throws MessagingException {
      final Multipart mpMixed = new MimeMultipart("mixed");
      {
          // alternative
          final Multipart mpMixedAlternative = newChild(mpMixed, "alternative");
          {
              // Note: MUST RENDER HTML LAST otherwise iPad mail client only renders the last image and no email
              addTextVersion(mpMixedAlternative,messageText);
              addHtmlVersion(mpMixedAlternative,messageHtml);
          }
      }

      //msg.setText(message, "utf-8");
      //msg.setContent(message,"text/html; charset=utf-8");
      return mpMixed;
  }
  
    private void addTextVersion(Multipart mpRelatedAlternative, String messageText) throws MessagingException {
        final MimeBodyPart textPart = new MimeBodyPart();
        textPart.setContent(messageText, "text/plain");
        mpRelatedAlternative.addBodyPart(textPart);
    }

    private void addHtmlVersion(Multipart parent, String messageHtml) throws MessagingException {
        // HTML version
        final Multipart mpRelated = newChild(parent,"related");

        // Html
        final MimeBodyPart htmlPart = new MimeBodyPart();
        htmlPart.setContent(messageHtml, "text/html");
        mpRelated.addBodyPart(htmlPart);
    }
    
    private Multipart newChild(Multipart parent, String alternative) throws MessagingException {
        MimeMultipart child =  new MimeMultipart(alternative);
        final MimeBodyPart mbp = new MimeBodyPart();
        parent.addBodyPart(mbp);
        mbp.setContent(child);
        return child;
    }
}
