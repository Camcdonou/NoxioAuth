package org.infpls.noxio.auth.module.auth.session.online;

import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketO46 extends Packet {
  private final String uid, name;
  public PacketO46(String uid, String name) {
    super("o46");
    this.uid = uid;
    this.name = name;
  }
  
  public String getUid() { return uid; }
  public String getName() { return name; }
}
