package org.infpls.noxio.auth.module.auth.controller;

import com.google.gson.*;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import org.infpls.noxio.auth.module.auth.dao.DaoContainer;
import org.infpls.noxio.auth.module.auth.dao.user.*;
import org.infpls.noxio.auth.module.auth.session.NoxioSession;
import org.infpls.noxio.auth.module.auth.session.PacketH01;
import org.infpls.noxio.auth.module.auth.util.Oak;
import org.infpls.noxio.auth.module.auth.util.Settable;

@Controller
public class GameServerComController {
  @Autowired
  private DaoContainer dao;
  
  /* @TODO: CRITICAL! SECURITY! requests made in this class must come from a list of valid servers. any other request should be denied */
  /* Partially implemented but needs adjustment and confirmation */
  
  /* This method is called by a game server to check if a player is logged in and if their session ID is valid. */
  /* If all OK then returns type: l04 and all of the users settings & unlock data */
  /* If not OK then returns type: l03 and a message */
  @RequestMapping(value = "/validate/{user}/{sid}", method = RequestMethod.GET, produces = "application/json")
  public @ResponseBody ResponseEntity userStatus(HttpServletRequest request, @PathVariable(value="user") final String user, @PathVariable(value="sid") final String sid) {
    /* Validate that this request is made from a white listed game server */
    if(!Settable.isWhiteListed(request.getRemoteAddr())) {
      Oak.log(Oak.Level.WARN, "Unknown address made request :" + request.getRemoteAddr());
      return new ResponseEntity("{\"type\":\"l03\", \"message\":\"Invalid request.\"}", HttpStatus.FORBIDDEN);
    }
    
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
  public @ResponseBody ResponseEntity reportStats(HttpServletRequest request, @RequestBody final String data) {
    /* Validate that this request is made from a white listed game server */
    if(!Settable.isWhiteListed(request.getRemoteAddr())) {
      Oak.log(Oak.Level.WARN, "GameServerComController::reportStats() - Unknown address made request :" + request.getRemoteAddr() + " ... " + data);
      return new ResponseEntity("{\"type\":\"h09\", \"message\":\"Invalid request.\"}", HttpStatus.FORBIDDEN);
    }
    
    final Gson gson = new GsonBuilder().create();
    try {
      final PacketH01 h01 = gson.fromJson(data, PacketH01.class);
      final NoxioSession session = dao.getUserDao().getSessionByUser(h01.getUser());
      
      if(session != null && session.loggedIn()) {
        session.recordStats(h01.getStats());
      }
      else {
        final User user = dao.getUserDao().getUserByName(h01.getUser());
        if(user == null) {
          return new ResponseEntity("{\"type\":\"h09\", \"message\":\"User does not exist or Guest account.\"}", HttpStatus.OK);
        }
        final UserStats stats = dao.getUserDao().getUserStats(user.uid);
        final UserStats nustats = stats.add(h01.getStats());
        dao.getUserDao().saveUserStats(nustats);
      }
      
      return new ResponseEntity("{\"type\":\"h00\"}", HttpStatus.OK);
    }
    catch(Exception ex) {
      Oak.log(Oak.Level.ERR, "Error during handling of reported stats.", ex);
    }
    return new ResponseEntity("{\"type\":\"h09\", \"message\":\"Failed to parse data.\"}", HttpStatus.OK);
  }
}
