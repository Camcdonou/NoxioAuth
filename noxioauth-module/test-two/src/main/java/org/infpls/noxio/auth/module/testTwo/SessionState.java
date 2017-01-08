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
  
  public abstract void destroy() throws IOException;
  
  
  /* Normal connection close */
  public final void close() throws IOException {
    sessionInfo.close();
  }
  
  /* Error connection close */
  public final void close(final String message) throws IOException {
    sessionInfo.close(message);
  }
  
  /* Exception connection close */
  public final void close(final Exception ex) throws IOException {
    sessionInfo.close(ex);
  }
  
}
