package org.infpls.noxio.auth.module.auth.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import org.infpls.noxio.auth.module.auth.dao.DaoContainer;
import org.infpls.noxio.auth.module.auth.session.NoxioSession;

@Controller
public class AuthValidationController {
    @Autowired
    private DaoContainer dao;
  
    @RequestMapping(value = "/validate/{user}/{sid}", method = RequestMethod.GET, produces = "application/json")
    public @ResponseBody ResponseEntity getStatus(@PathVariable(value="user") final String user, @PathVariable(value="sid") final String sid) {
        NoxioSession session = dao.getUserDao().getSessionByUser(user);
        if(session != null) {
          if(session.loggedIn()) {
            if(session.getSessionId().equals(sid)) {
              return new ResponseEntity("{\"result\":\"true\"}", HttpStatus.OK);
            }
            return new ResponseEntity("{\"result\":\"false\", \"message\":\"Incorrect Session ID.\"}", HttpStatus.OK);
          }
          return new ResponseEntity("{\"result\":\"false\", \"message\":\"User session not found.\"}", HttpStatus.OK);
        }
        return new ResponseEntity("{\"result\":\"false\", \"message\":\"User session not found.\"}", HttpStatus.OK);
    }
}
