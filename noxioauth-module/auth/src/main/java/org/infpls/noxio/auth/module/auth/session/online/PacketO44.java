package org.infpls.noxio.auth.module.auth.session.online;

import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketO44 extends Packet {
  private final String uid;
  public PacketO44(String uid) {
    super("o44");
    this.uid = uid;
  }
  
  public String getUid() { return uid; }
}
