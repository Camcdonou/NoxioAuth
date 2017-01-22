package org.infpls.noxio.auth.module.auth.session.authenticate;

import com.google.gson.*;
import java.io.IOException;

import org.infpls.noxio.auth.module.auth.dao.user.UserDao;
import org.infpls.noxio.auth.module.auth.session.*;
import org.infpls.noxio.auth.module.auth.util.Hash;
import org.infpls.noxio.auth.module.auth.util.Salt;
import org.infpls.noxio.auth.module.auth.util.Validation;


public class Authenticate extends SessionState {
  
  private final UserDao userDao;
  
  private final String salt;
  
  public Authenticate(final NoxioSession session, final UserDao userDao) throws IOException {
    super(session);
    
    this.userDao = userDao;
    this.salt = Salt.generate();
    
    sendPacket(new PacketS00('a'));
  }
  
  /* Packet Info [ < outgoing | > incoming ]
     > a00 create account
     > a01 login
     > a02 close
     < a03 create account error
     < a05 login account error
     < a06 create account success
     < a07 salt
     > a08 state ready
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
        default : { close("Invalid data: " + p.getType()); break; }
      }
    } catch(IOException | NullPointerException | JsonParseException ex) {
      close(ex);
    }
  }
  
  private void createUser(final PacketA00 p) throws IOException {
    /* Make sure data is valid */
    if(!Validation.isAlphaNumeric(p.getUser())) {
      sendPacket(new PacketA03("Username must be Alpha-Numeric characters only."));
      return;
    }
    if(p.getUser().length() < 4) {
      sendPacket(new PacketA03("Username must be at least 4 characters."));
      return;
    }
    if(p.getUser().length() > 32) {
      sendPacket(new PacketA03("Username cannot be longer than 32 characters."));
      return;
    }
    if(p.getHash().length() != 64) {
      sendPacket(new PacketA03("Password hash is an invalid length."));
      return;
    }
    if(!Validation.isAlphaNumeric(p.getHash())) {
      sendPacket(new PacketA03("Password hash is bogus."));
      return;
    }
    if(Hash.generate("").equals(p.getHash())) {
      sendPacket(new PacketA03("Password cannot be nothing."));
      return;
    }
    
    if(userDao.createUser(p.getUser(), p.getHash())) {
      sendPacket(new PacketA06()); /* User creation successful */
    }
    else {
      sendPacket(new PacketA03("Username is already in use."));
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
    
    switch(userDao.authenticate(p.getUser(), p.getHash(), salt)) {
      case 0 : { session.login(p.getUser()); break; } /* Login successful */
      case 1 : { sendPacket(new PacketA05("User is already logged in.")); break; }
      case 2 : { sendPacket(new PacketA05("Incorrect Username or Password.")); break; }
      case 3 : { sendPacket(new PacketA05("User does not exist.")); break; }
      default : { sendPacket(new PacketA05("Unknown error.")); break; }
    }
  }
  
  private void stateReady(final PacketA08 p) throws IOException {
    sendPacket(new PacketA07(salt));
  }
  
  @Override
  public void destroy() throws IOException {
    
  }
  
}
