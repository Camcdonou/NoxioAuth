package org.infpls.noxio.auth.module.testTwo;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.springframework.web.socket.WebSocketSession;

public class SessionInfoDao {
  private TestTwoDao testTwoDao;
  
  private final Map<String, SessionInfo> sessionInfo;
  
  public SessionInfoDao(TestTwoDao ttd) {
    testTwoDao = ttd;
    sessionInfo = new HashMap();
  }
  
  public SessionInfo getSessionInfo(final WebSocketSession session) {
    return sessionInfo.get(session.getId());
  }
  
  public void createSessionInfo(final WebSocketSession session) throws IOException {
    sessionInfo.put(session.getId(), new SessionInfo(session, testTwoDao));
  }
  
  public void destroySessionInfo(final WebSocketSession session) throws IOException {
    sessionInfo.get(session.getId()).destroy();
    sessionInfo.remove(session.getId());
  }
  
  public SessionInfo getSessionInfoByUsername(final String username) {
    final SessionInfo[] sis = sessionInfo.values().toArray(new SessionInfo[0]);
    for(int i=0;i<sis.length;i++) {
      if(sis[i].loggedIn()) {
        if(sis[i].getUserName().equalsIgnoreCase(username)) {
          return sis[i];
        }
      }
    }
    return null;
  }
  
}
