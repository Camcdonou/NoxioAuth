package org.infpls.noxio.auth.module.auth.session.error;

import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketX01 extends Packet {
  private final String message, trace;
  public PacketX01(final String message, final String trace) {
    super("x01");
    this.message = message; this.trace = trace;
  }
  
  public String getMessage() { return message; }
  public String getTrace() { return trace; }
}
