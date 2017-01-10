package org.infpls.noxio.auth.module.auth.session.error;

import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketX00 extends Packet {
  private final String message;
  public PacketX00(final String message) {
    super("x00");
    this.message = message;
  }
  
  public String getMessage() { return message; }
}
