package org.infpls.noxio.auth.module.auth.session.authenticate;

import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketA13 extends Packet {
  private final String code;
  public PacketA13(final String code) {
    super("a13");
    this.code = code;
  }
  
  public String getCode() { return code; }
}
