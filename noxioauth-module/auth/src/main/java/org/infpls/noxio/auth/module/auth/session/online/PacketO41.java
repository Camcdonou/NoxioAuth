package org.infpls.noxio.auth.module.auth.session.online;

import java.util.List;
import org.infpls.noxio.auth.module.auth.dao.user.UserInfo;
import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketO41 extends Packet {
  private final List<UserInfo> users;
  public PacketO41(List<UserInfo> users) {
    super("o41");
    this.users = users;
  }
  
  public List<UserInfo> getUsers() { return users; }
}
