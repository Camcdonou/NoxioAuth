package org.infpls.noxio.auth.module.auth.session.authenticate;

import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketA00 extends Packet {
  private final String user, hash, email;
  public PacketA00(final String user, final String hash, final String email) {
    super("a00");
    this.user = user; this.hash = hash; this.email = email;
  }
  
  public String getUser() { return user; }
  public String getHash() { return hash; }
  public String getEmail() { return email; }
}
