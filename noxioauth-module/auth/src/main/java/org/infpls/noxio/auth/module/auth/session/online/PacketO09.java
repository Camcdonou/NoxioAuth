package org.infpls.noxio.auth.module.auth.session.online;

import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketO09 extends Packet {
  private final String message;
  public PacketO09(final String message) {
    super("o09");
    this.message = message;
  }
  
  public String getMessage() { return message; }
}
