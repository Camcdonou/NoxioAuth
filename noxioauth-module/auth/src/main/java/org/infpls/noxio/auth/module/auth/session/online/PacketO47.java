package org.infpls.noxio.auth.module.auth.session.online;

import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketO47 extends Packet {
  private final String uid;
  public PacketO47(String uid) {
    super("o47");
    this.uid = uid;
  }
  
  public String getUid() { return uid; }
}
