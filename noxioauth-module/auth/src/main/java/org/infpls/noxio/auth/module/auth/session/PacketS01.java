package org.infpls.noxio.auth.module.auth.session;

public class PacketS01 extends Packet {
  
  private final String user, sid;
  public PacketS01(final String user, final String sid) {
    super("s01");
    this.user = user;
    this.sid = sid;
  }
  
  public String getUser() { return user; }
  public String getSid() { return sid; }
}
