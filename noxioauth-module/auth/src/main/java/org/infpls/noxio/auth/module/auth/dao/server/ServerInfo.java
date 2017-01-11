package org.infpls.noxio.auth.module.auth.dao.server;

public class ServerInfo {
  private final String name, location, adress;
  private final int port;
  public ServerInfo(final String name, final String location, final String adress, final int port) {
    this.name = name; this.location = location;
    this.adress = adress; this.port = port;
  }
  
  public String getName() { return name; }
  public String getLocation() { return location; }
  public String getAdress() { return adress; }
  public int getPort() { return port; }
}
