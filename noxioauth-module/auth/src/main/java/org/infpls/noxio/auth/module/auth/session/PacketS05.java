package org.infpls.noxio.auth.module.auth.session;

import org.infpls.noxio.auth.module.auth.dao.user.UserUnlocks;

public class PacketS05 extends Packet {
  private final UserUnlocks unlocks;
  public PacketS05(final UserUnlocks unlocks) {
    super("s05");
    this.unlocks = unlocks;
  }
  
  public UserUnlocks getUnlocks() { return unlocks; }
}
