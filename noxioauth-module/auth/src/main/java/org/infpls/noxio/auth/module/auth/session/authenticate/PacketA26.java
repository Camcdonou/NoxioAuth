package org.infpls.noxio.auth.module.auth.session.authenticate;

import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketA26 extends Packet {
  private final String message;
  public PacketA26(String message) {
    super("a26");
    this.message = message;
  }
  
  public String getMessage() { return message; }
}
