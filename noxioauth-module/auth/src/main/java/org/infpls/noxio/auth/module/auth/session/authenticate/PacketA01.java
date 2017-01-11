package org.infpls.noxio.auth.module.auth.session.authenticate;

import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketA01 extends Packet {
  private final String user, hash;
  public PacketA01(final String user, final String hash) {
    super("a01");
    this.user = user; this.hash = hash;
  }
  
  public String getUser() { return user.toLowerCase(); }
  public String getHash() { return hash; }
}
