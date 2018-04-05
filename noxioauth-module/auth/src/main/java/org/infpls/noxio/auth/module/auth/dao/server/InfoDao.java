package org.infpls.noxio.auth.module.auth.dao.server;

import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class InfoDao {
  @Value("#{'${game.server.name}'.split(',')}")
  private String[] name;
  @Value("#{'${game.server.domain}'.split(',')}")
  private String[] domain;
  @Value("#{'${game.server.address}'.split(',')}")
  private String[] address;
  @Value("#{'${game.server.port}'.split(',')}")
  private String[] port;
  
  public InfoDao() { }
  
  public List<ServerInfo> getServerList() {
    final List<ServerInfo> svs = new ArrayList();
    for(int i=0;i<name.length;i++) {
      svs.add(new ServerInfo(name[i], domain[i], Integer.parseInt(port[i])));
    }
    return svs;
  }
  
  public boolean isWhiteListed(String addr) {
    for(int i=0;i<address.length;i++) {
      if(address[i].equals(addr)) {
        return true;
      }
    }
    return false;
  }
}