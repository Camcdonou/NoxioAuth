package org.infpls.noxio.auth.module.auth.session;

import org.infpls.noxio.auth.module.auth.dao.user.UserStats;

public class PacketS04 extends Packet {
  private final UserStats stats;
  public PacketS04(final UserStats stats) {
    super("s04");
    this.stats = stats;
  }
  
  public UserStats getStats() { return stats; }
}
