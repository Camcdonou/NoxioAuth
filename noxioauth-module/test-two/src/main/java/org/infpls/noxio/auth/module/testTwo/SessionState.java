package org.infpls.noxio.auth.module.testTwo;

import java.io.IOException;

public abstract class SessionState {
  
  final public SessionInfo sessionInfo;
  
  public SessionState(SessionInfo si) {
    sessionInfo = si;
  }
  
  public abstract void handlePacket(final String p) throws IOException;
  
  public final void sendPacket(final String p) throws IOException {
    sessionInfo.sendPacket(p);
  }
  
  public abstract void close() throws IOException;
  
}
