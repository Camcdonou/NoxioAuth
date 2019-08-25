package org.infpls.noxio.auth.module.auth.websocket;

import org.springframework.web.socket.*;
import org.springframework.beans.factory.annotation.Autowired;

import org.infpls.noxio.auth.module.auth.dao.DaoContainer;
import org.infpls.noxio.auth.module.auth.session.NoxioSession;
import org.infpls.noxio.auth.module.auth.util.Oak;


public class GuestWebSocket extends AuthWebSocket {
    
    @Autowired
    private DaoContainer dao;

    @Override
    public void afterConnectionEstablished(WebSocketSession webSocket) {
      try {
        final NoxioSession session = dao.getUserDao().createSessionGuest(webSocket, dao);
        webSocket.getAttributes().put("session", session);
      }
      catch(Exception ex) {
        Oak.log(Oak.Type.SESSION, Oak.Level.ERR, "Exception thrown at Websocket top level.", ex);
      }
    }
}