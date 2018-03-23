package org.infpls.noxio.auth.module.auth.session.online;

import org.infpls.noxio.auth.module.auth.dao.user.UserUnlocks;
import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketO07 extends Packet {
  private final UserUnlocks.Key key;
  public PacketO07(final UserUnlocks.Key key) {
    super("o07");
    this.key = key;
  }
  
  public UserUnlocks.Key getKey() { return key; }
}
