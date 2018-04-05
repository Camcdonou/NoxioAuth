package org.infpls.noxio.auth.module.auth.session;

import org.infpls.noxio.auth.module.auth.dao.user.*;

public class PacketS01 extends Packet {
  
  private final String user, sid, display;
  private final boolean guest;
  private final UserSettings settings;
  private final UserStats stats;
  private final UserUnlocks unlocks;
  public PacketS01(final String user, final String sid, final String display, final boolean guest, final UserSettings settings, final UserStats stats, final UserUnlocks unlocks) {
    super("s01");
    this.user = user;
    this.sid = sid;
    this.display = display;
    this.guest = guest;
    this.settings = settings;
    this.stats = stats;
    this.unlocks = unlocks;
  }
  
  public String getUser() { return user; }
  public String getSid() { return sid; }
  public String getDisplay() { return display; }
  public boolean getGuest() { return guest; }
  public UserSettings getSettings() { return settings; }
  public UserStats getStats() { return stats; }
  public UserUnlocks getUnlocks() { return unlocks; }
}
