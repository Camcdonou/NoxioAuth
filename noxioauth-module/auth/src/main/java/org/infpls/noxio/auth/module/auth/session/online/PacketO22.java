package org.infpls.noxio.auth.module.auth.session.online;

import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketO22 extends Packet {
  private final String message;
  public PacketO22(final String message) {
    super("o22");
    this.message = message;
  }
  
  public String getMessage() { return message; }
}
