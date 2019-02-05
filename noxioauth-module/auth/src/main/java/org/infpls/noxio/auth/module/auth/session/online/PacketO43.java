package org.infpls.noxio.auth.module.auth.session.online;

import org.infpls.noxio.auth.module.auth.session.Packet;
import org.infpls.noxio.auth.module.auth.dao.user.User;

public class PacketO43 extends Packet {
  private final String uid;
  private final User.Type userType;
  public PacketO43(String uid, User.Type userType) {
    super("o43");
    this.uid = uid;
    this.userType = userType;
  }
  
  public String getUid() { return uid; }
  public User.Type getUserType() { return userType; }
}
