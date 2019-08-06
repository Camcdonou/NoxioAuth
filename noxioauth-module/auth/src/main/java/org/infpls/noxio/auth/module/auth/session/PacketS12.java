package org.infpls.noxio.auth.module.auth.session;

public class PacketS12 extends Packet {
  private final String message;
  public PacketS12(final String message) {
    super("s12");
    this.message = message;
  }
 
  public String getMessage() { return message; }
}
