package org.infpls.noxio.auth.module.auth.session;

import com.google.gson.Gson;
import java.io.IOException;

public abstract class SessionState {
  
  final protected NoxioSession session;
  
  public SessionState(NoxioSession session) {
    this.session = session;
  }
  
  public abstract void handlePacket(final String data) throws IOException;
  
  /* Handles the handful of packets that do not have a specific single state. EX: Saving settings */
  protected final boolean handleGenericPacket(final Gson gson, final Packet p, final String data) throws IOException {
    switch(p.getType()) {
      case "s03" : { session.saveSettings(gson.fromJson(data, PacketS03.class).getSettings()); return true; }
    }
    return false;
  }
  
  protected final void sendPacket(final Packet p) throws IOException {
    session.sendPacket(p);
  }
  
  public abstract void destroy() throws IOException;
  
  /* Normal connection close */
  public final void close() throws IOException {
    session.close();
  }
  
  /* Error connection close */
  public final void close(final String message) throws IOException {
    session.close(message);
  }
  
  /* Exception connection close */
  public final void close(final Exception ex) throws IOException {
    session.close(ex);
  }
  
}
