package org.infpls.noxio.auth.module.auth.session;

public class Packet {
  private final String type;
  public Packet(final String type) { this.type = type; }
  public final String getType() { return type; }
}
