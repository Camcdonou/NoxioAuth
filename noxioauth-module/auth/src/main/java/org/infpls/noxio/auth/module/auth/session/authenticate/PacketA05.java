package org.infpls.noxio.auth.module.auth.session.authenticate;

import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketA05 extends Packet {
  private final String message;
  public PacketA05(final String message) {
    super("a05");
    this.message = message;
  }
  
  public String getMessage() { return message; }
}
