package org.infpls.noxio.auth.module.auth.session.authenticate;

import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketA21 extends Packet {
  private final String user, email;
  public PacketA21(String user, String email) {
    super("a21");
    this.user = user; this.email = email;
  }
  
  public String getUser() { return user; }
  public String getEmail() { return email; }
}
