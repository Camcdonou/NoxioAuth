package org.infpls.noxio.auth.module.auth.session.online;

import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketO42 extends Packet {
  private final String uid;
  private final long length;
  public PacketO42(String uid, long length) {
    super("o42");
    this.uid = uid;
    this.length = length;
  }
  
  public String getUid() { return uid; }
  public long getLength() { return length; }
}
