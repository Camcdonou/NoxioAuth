package org.infpls.noxio.auth.module.auth.session.online;

import java.util.List;
import org.infpls.noxio.auth.module.auth.session.Packet;
import org.infpls.noxio.auth.module.auth.util.Settable;

public class PacketO31 extends Packet {
  private final List<Settable.ServerInfo> servers;
  public PacketO31(final List<Settable.ServerInfo> servers) {
    super("o31");
    this.servers = servers;
  }
  
  public List<Settable.ServerInfo> getServers() { return servers; }
}
