package org.infpls.noxio.auth.module.auth.session.online;

import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketO21 extends Packet {
  private final String redirect;
  public PacketO21(final String redirect) {
    super("o21");
    this.redirect = redirect;
  }
  
  public String getRedirect() { return redirect; }
}
