package org.infpls.noxio.auth.module.auth.session.authenticate;

import java.io.IOException;
import org.infpls.noxio.auth.module.auth.session.*;

public class Authenticate extends SessionState {
        
  /* This state has no actual function. We just sit here until the session is successfully authenticated */
  
  public Authenticate(final NoxioSession session) throws IOException {
    super(session);
    sendPacket(new PacketS00('a'));
  }
  
  @Override
  public void handlePacket(final String data) throws IOException {
    close("Recieved Unexpected Data");
  }
  
  @Override
  public void destroy() throws IOException {
    
  }
}
