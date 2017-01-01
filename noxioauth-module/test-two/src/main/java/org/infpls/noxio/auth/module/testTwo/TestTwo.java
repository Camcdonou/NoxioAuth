package org.infpls.noxio.auth.module.testTwo;

import java.io.IOException;

import java.util.*;
 
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;

/* These are INSTANCED in a weird way not a base container type thing */

@ServerEndpoint("/livemessages") 
public class TestTwo {
    private final Map<String, SessionInfo> sessionInfo = new HashMap();
    private final TestTwoDao testTwoDao = new TestTwoDao();

    @OnOpen
    public void onOpen(Session session) {
        try { session.
            sessionInfo.put(session.getId(), new SessionInfo(session, testTwoDao));
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    @OnMessage
    public void onMessage(String p, Session session) {
        try {
            SessionInfo si = sessionInfo.get(session.getId());
            si.handlePacket(p);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
 
    @OnClose
    public void onClose(Session session) throws IOException {
      SessionInfo si = sessionInfo.get(session.getId());
      si.close();
    }
}