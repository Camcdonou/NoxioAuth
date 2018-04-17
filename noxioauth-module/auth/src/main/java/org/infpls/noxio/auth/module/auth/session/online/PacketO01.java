package org.infpls.noxio.auth.module.auth.session.online;

import java.util.List;
import org.infpls.noxio.auth.module.auth.session.Packet;
import org.infpls.noxio.auth.module.auth.util.Settable;

public class PacketO01 extends Packet {
  private final List<Settable.ServerInfo> servers;
  public PacketO01(final List<Settable.ServerInfo> servers) {
    super("o01");
    this.servers = servers;
  }
  
  public List<Settable.ServerInfo> getServers() { return servers; }
}
