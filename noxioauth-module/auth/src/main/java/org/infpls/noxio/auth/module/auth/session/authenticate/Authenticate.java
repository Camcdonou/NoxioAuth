package org.infpls.noxio.auth.module.auth.session.authenticate;

import com.google.gson.*;
import java.io.IOException;

import org.infpls.noxio.auth.module.auth.dao.mail.MailDao;
import org.infpls.noxio.auth.module.auth.dao.user.User;
import org.infpls.noxio.auth.module.auth.dao.user.UserDao;
import org.infpls.noxio.auth.module.auth.session.*;
import org.infpls.noxio.auth.module.auth.util.ID;
import org.infpls.noxio.auth.module.auth.util.Validation;


public class Authenticate extends SessionState {
  
  private static String createEmailSubject = "20xx.io Email Verification";
  private static String createEmailContent = "<html>\n" +
"<head>\n" +
"  <title>20XX.io</title>\n" +
"</head>\n" +
"<body>\n" +
"<div style='width: 512px; font-family:Arial,Helvetica,sans-serif;'>\n" +
" <div style='background-color:#0d1e33; color:#c6d4df;'>\n" +
" <div style='background-color:#28323a; color:#c6d4df; font-size:32px; padding:8px 8px 0px 8px'>The Year Is 20XX . . .</div>\n" +
"  <p style='font-size:18px; padding:0px 8px 0px 8px; color:#c6d4df;'>\n" +
"  Thanks for joining 20XX.io.\n" +
"  To finish creating your account copy the verification code below and enter it on the site.\n" +
"  </p>\n" +
"  <div style='font-size:18px; padding:0px 8px 0px 8px; color:#c6d4df;'>Your username is:</div>\n" +
"  <span style='font-size:32px;background-color:#6c6e70; color:#c6d4df; font-weight: bold; margin:0px 8px 0px 8px;'>$$USER$$</span>\n" +
"  <div style='font-size:18px; padding:0px 8px 0px 8px; color:#c6d4df;'>Your verification code is:</div>\n" +
"  <span style='font-size:32px;background-color:#6c6e70; color:#c6d4df; font-weight: bold; margin:0px 8px 0px 8px;'>$$CODE$$</span>\n" +
"  <div style='font-size:12px; padding:0px 8px 0px 8px; color:#c6d4df;'>Now get out there and get destrudled!</div>\n" +
"  <div style='background-color:#0d1e33; color:#0d1e33; font-size:32px;'>_</div>\n" +
" </div>\n" +
"</div>\n" +
"</body>\n" +
"</html>\n" +
"";
  
  private final UserDao userDao;
  private final MailDao mailDao;

  private String createUserName;
  private String createUserEmail;
  private String createUserHash;
  private String createUserCode;
  
  public Authenticate(final NoxioSession session, final UserDao userDao, final MailDao mailDao) throws IOException {
    super(session);
    
    this.userDao = userDao;
    this.mailDao = mailDao;
    
    sendPacket(new PacketS00('a'));
  }
  
  /* Packet Info [ < outgoing | > incoming ]
     > a00 create account
     > a01 login
     > a02 close
     < a03 create account error
     < a05 login account error
     < a06 create account success
     < a07 deprecated salty packet (can remove)
     > a08 state ready
     < a11 sending email
     < a12 verification request
     > a13 verification code
     < a14 failed to send email
  */
  
  @Override
  public void handlePacket(final String data) throws IOException {
    try {
      final Gson gson = new GsonBuilder().create();
      Packet p = gson.fromJson(data, Packet.class);
      if(p.getType() == null) { close("Invalid data: NULL TYPE"); return; } //Switch statements throw Null Pointer if this happens.
      switch(p.getType()) {
        case "a00" : { createUser(gson.fromJson(data, PacketA00.class)); break; }
        case "a01" : { authenticate(gson.fromJson(data, PacketA01.class)); break; }
        case "a02" : { close(); break; }
        case "a08" : { stateReady(gson.fromJson(data, PacketA08.class)); break; }
        case "a13" : { verifyCreateUser(gson.fromJson(data, PacketA13.class)); break; }
        default : { close("Invalid data: " + p.getType()); break; }
      }
    } catch(IOException | NullPointerException | JsonParseException ex) {
      close(ex);
    }
  }
  
  private void createUser(final PacketA00 p) throws IOException {
    /* Validation */
    final String user = p.getUser().toLowerCase();
    final String hash = p.getHash();
    final String email = p.getEmail();
    String res;
    /* Username */
    if((res = Validation.validUserName(user)) != null) {
      sendPacket(new PacketA03(res)); return;
    }
    /* Password Hash */
    if((res = Validation.validHash(hash)) != null) {
      sendPacket(new PacketA03(res)); return;
    }
    /* Email */
    if((res = Validation.validEmail(email)) != null) {
      sendPacket(new PacketA03(res)); return;
    }

    /* Check if user exists */
    User u = userDao.getUserByName(user);
    if(u != null) {
      sendPacket(new PacketA03("Username is already in use.")); return;
    }
    
    /* Check if email in use */
    u = userDao.getUserByEmail(email);
    if(u != null) {
      sendPacket(new PacketA03("Email is already in use.")); return;
    }

    final String vc = ID.generate6();
    final String emc = createEmailContent.replace("$$USER$$", user).replace("$$CODE$$", vc);
    sendPacket(new PacketA11());                                              // Valid data, sending verification email
    if(mailDao.send(email, createEmailSubject, emc)) {                        // Verification email has been sent successfully /* @TODO: blocking. */
      createUserName = user;
      createUserEmail = email;
      createUserHash = hash;
      createUserCode = vc;
      sendPacket(new PacketA12());
    }           
    else { sendPacket(new PacketA14()); }
  }
  
  private void verifyCreateUser(final PacketA13 p) throws IOException {
    if(createUserCode != null && p.getCode().equals(createUserCode)) {
      if(userDao.createUser(createUserName, createUserEmail, createUserHash)) {
        sendPacket(new PacketA06());
      }
      else {
        createUserName = null; createUserEmail = null; createUserHash = null; createUserCode = null;
        sendPacket(new PacketA15());
      }
    }
    else {
      sendPacket(new PacketA03("Incorrect verification code."));
    }
  }
  
  private void authenticate(final PacketA01 p) throws IOException {
    /* Make sure data is valid */
    if(!Validation.isAlphaNumeric(p.getUser())) {
      sendPacket(new PacketA05("Username must be Alpha-Numeric characters only."));
      return;
    }
    if(!Validation.isAlphaNumeric(p.getHash())) {
      sendPacket(new PacketA05("Password hash is bogus."));
      return;
    }
    
    switch(userDao.authenticate(p.getUser(), p.getHash())) {
      case 0 : { session.login(p.getUser()); break; } /* Login successful */
      case 1 : { sendPacket(new PacketA05("User is already logged in.")); break; }
      case 2 : { sendPacket(new PacketA05("Incorrect Username or Password.")); break; }
      case 3 : { sendPacket(new PacketA05("User does not exist.")); break; }
      default : { sendPacket(new PacketA05("Unknown error.")); break; }
    }
  }
  
  private void stateReady(final PacketA08 p) throws IOException {
    sendPacket(new PacketA07());
  }
  
  @Override
  public void destroy() throws IOException {
    
  }
  
}
