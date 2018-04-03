package org.infpls.noxio.auth.module.auth.session.authenticate;

import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketA23 extends Packet {
  private final String message;
  public PacketA23(String message) {
    super("a23");
    this.message = message;
  }
  
  public String getMessage() { return message; }
}
