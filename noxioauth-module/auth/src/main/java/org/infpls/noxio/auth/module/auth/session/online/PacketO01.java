package org.infpls.noxio.auth.module.auth.session.online;

import java.util.List;
import org.infpls.noxio.auth.module.auth.dao.server.ServerInfo;
import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketO01 extends Packet {
  private final List<ServerInfo> servers;
  public PacketO01(final List<ServerInfo> servers) {
    super("o01");
    this.servers = servers;
  }
  
  public List<ServerInfo> getServers() { return servers; }
}
