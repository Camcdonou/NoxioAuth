package org.infpls.noxio.auth.module.auth.session.authenticate;

import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketA07 extends Packet {
  private final String salt;
  public PacketA07(final String salt) {
    super("a07");
    this.salt = salt;
  }
  
  public String getSalt() { return salt; }
}
