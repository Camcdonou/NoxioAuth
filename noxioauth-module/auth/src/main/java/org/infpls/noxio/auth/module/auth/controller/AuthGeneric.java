package org.infpls.noxio.auth.module.auth.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.IOException;
import org.infpls.noxio.auth.module.auth.dao.DaoContainer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class AuthGeneric {
    @Autowired
    private DaoContainer dao;
  
    @RequestMapping(value = "/unsubscribe", method = RequestMethod.GET, produces = "application/json")
    public @ResponseBody ResponseEntity unsubscribe() {
        return new ResponseEntity("Not supported yet. Email support@20xx.io if you need help.", HttpStatus.OK);
    }
    
    @RequestMapping(value = "/leaders", method = RequestMethod.GET, produces = "application/json")
    public @ResponseBody ResponseEntity getLeaderboard() {
      final Gson gson = new GsonBuilder().create();
      try {
        return new ResponseEntity(gson.toJson(dao.getUserDao().getLeaderboard(255)), HttpStatus.OK);
      }
      catch(IOException ex) {
        return new ResponseEntity("Something broked.", HttpStatus.BAD_REQUEST);
      }
    }
}
