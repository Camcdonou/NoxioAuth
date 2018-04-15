package org.infpls.noxio.auth.module.auth.session;

import org.infpls.noxio.auth.module.auth.dao.user.*;

public class PacketS06 extends Packet {
  
  private final String user, sid, display;
  private final int userType;
  private final UserUnlocks unlocks;
  public PacketS06(final String user, final String sid, final String display, final User.Type userType, final UserUnlocks unlocks) {
    super("s06");
    this.user = user;
    this.sid = sid;
    this.display = display;
    this.userType = userType.level;
    this.unlocks = unlocks;
  }
  
  public String getUser() { return user; }
  public String getSid() { return sid; }
  public String getDisplay() { return display; }
  public int getUserType() { return userType; }
  public UserUnlocks getUnlocks() { return unlocks; }
}
