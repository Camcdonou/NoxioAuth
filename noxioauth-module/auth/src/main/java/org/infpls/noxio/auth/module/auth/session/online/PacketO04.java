package org.infpls.noxio.auth.module.auth.session.online;

import java.util.List;
import org.infpls.noxio.auth.module.auth.dao.user.UserUnlocks;
import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketO04 extends Packet {
  private final List<UserUnlocks.Unlock> unlocks;
  public PacketO04(final List<UserUnlocks.Unlock> unlocks) {
    super("o04");
    this.unlocks = unlocks;
  }
  
  public List<UserUnlocks.Unlock> getUnlocks() { return unlocks; }
}
