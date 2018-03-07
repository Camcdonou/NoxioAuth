package org.infpls.noxio.auth.module.auth.session;

import org.infpls.noxio.auth.module.auth.dao.user.UserSettings;

public class PacketS03 extends Packet {
  private final UserSettings settings;
  public PacketS03(final UserSettings settings) {
    super("s03");
    this.settings = settings;
  }
  
  public UserSettings getSettings() { return settings; }
}
