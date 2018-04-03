package org.infpls.noxio.auth.module.auth.session.authenticate;

import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketA27 extends Packet {
  private final String message;
  public PacketA27(String message) {
    super("a27");
    this.message = message;
  }
  
  public String getMessage() { return message; }
}
