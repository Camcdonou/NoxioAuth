package org.infpls.noxio.auth.module.auth.websocket;

import com.google.gson.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import org.infpls.noxio.auth.module.auth.dao.DaoContainer;
import org.infpls.noxio.auth.module.auth.dao.user.*;
import org.infpls.noxio.auth.module.auth.session.NoxioSession;
import org.infpls.noxio.auth.module.auth.session.PacketH01;

@Controller
public class GameServerComController {
  @Autowired
  private DaoContainer dao;
  
  /* @TODO: CRITICAL! SECURITY! requests made in this class must come from a list of valid servers. any other request should be denied */
  
  /* This method is called by a game server to check if a player is logged in and if their session ID is valid. */
  /* If all OK then returns type: l04 and all of the users settings & unlock data */
  /* If not OK then returns type: l03 and a message */
  @RequestMapping(value = "/validate/{user}/{sid}", method = RequestMethod.GET, produces = "application/json")
  public @ResponseBody ResponseEntity userStatus(@PathVariable(value="user") final String user, @PathVariable(value="sid") final String sid) {
    NoxioSession session = dao.getUserDao().getSessionByUser(user);

    final Gson gson = new GsonBuilder().create();
    
    if(session != null && session.loggedIn()) {
        if(session.getSessionId().equals(sid)) {
          return new ResponseEntity("{\"type\":\"l04\", data:" + gson.toJson(session.getUserData()) + "}", HttpStatus.OK);
        }
        return new ResponseEntity("{\"type\":\"l03\", \"message\":\"Incorrect Session ID.\"}", HttpStatus.OK);
    }
    return new ResponseEntity("{\"type\":\"l03\", \"message\":\"User session not found.\"}", HttpStatus.OK);
  }
  
  /* This method is called by a game server to report stats recorded in a game. */
  /* If all OK then returns type: h00 */
  /* If there is an error returns type: h09 and a message */
  @RequestMapping(value = "/report", method = RequestMethod.POST, produces = "application/json")
  public @ResponseBody ResponseEntity reportStats(@RequestBody final String data) {
    final Gson gson = new GsonBuilder().create();
    try {
      final PacketH01 h01 = gson.fromJson(data, PacketH01.class);
      final NoxioSession session = dao.getUserDao().getSessionByUser(h01.getUser());
      
      if(session != null && session.loggedIn()) {
        session.recordStats(h01.getStats());
      }
      else {
        final User user = dao.getUserDao().getUserByName(h01.getUser());
        final UserStats stats = dao.getUserDao().getUserStats(user.uid);
        final UserStats nustats = stats.add(h01.getStats());
        dao.getUserDao().saveUserStats(nustats);
      }
      
      return new ResponseEntity("{\"type\":\"h00\"}", HttpStatus.OK);
    }
    catch(Exception ex) {
      ex.printStackTrace();
    }
    return new ResponseEntity("{\"type\":\"h09\", \"message\":\"Failed to parse data.\"}", HttpStatus.OK);
  }
}
