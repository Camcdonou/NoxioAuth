package org.infpls.noxio.auth.module.auth.session.authenticate;

import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketA24 extends Packet {
  private final String hash, code;
  public PacketA24(String hash, String code) {
    super("a24");
    this.hash = hash; this.code = code;
  }
  
  public String getHash() { return hash; }
  public String getCode() { return code; }
}
