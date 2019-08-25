package org.infpls.noxio.auth.module.auth.session.online;

import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketO45 extends Packet {
  private final String message;
  public PacketO45(String message) {
    super("o45");
    this.message = message;
  }
  
  public String getMessage() { return message; }
}
