package org.infpls.noxio.auth.module.auth.session;

public class PacketS10 extends Packet {
  
  private final String user, hash;
  public PacketS10(final String user, final String hash) {
    super("s10");
    this.user = user; this.hash = hash;
  }
  
  public String getUser() { return user; }
  public String getHash() { return hash; }
}
