package org.infpls.noxio.auth.module.auth.session;

public class PacketS45 extends Packet {
  private final String message;
  public PacketS45(final String message) {
    super("s45");
    this.message = message;
  }
 
  public String getMessage() { return message; }
}
