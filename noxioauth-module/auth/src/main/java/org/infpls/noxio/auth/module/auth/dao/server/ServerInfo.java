package org.infpls.noxio.auth.module.auth.dao.server;

public class ServerInfo {
  private final String id, address;
  private final int port;
  public ServerInfo(final String id, final String address, final int port) {
    this.id = id;
    this.address = address; this.port = port;
  }
  
  public String getId() { return id; }
  public String getAddress() { return address; }
  public int getPort() { return port; }
}
