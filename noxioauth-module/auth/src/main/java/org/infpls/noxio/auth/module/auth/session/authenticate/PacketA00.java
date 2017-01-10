package org.infpls.noxio.auth.module.auth.session.authenticate;

import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketA00 extends Packet {
  private final String user, hash;
  public PacketA00(final String user, final String hash) {
    super("a00");
    this.user = user; this.hash = hash;
  }
  
  public String getUser() { return user; }
  public String getHash() { return hash; }
}
