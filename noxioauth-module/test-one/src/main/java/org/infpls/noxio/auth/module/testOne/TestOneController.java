package org.infpls.noxio.auth.module.testOne;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.google.gson.*;

@Controller
public class TestOneController {
  
    @Autowired
    private TestOneDao messageDao;

    @RequestMapping(value = "/messages", method = RequestMethod.GET, produces = "application/json")
    public @ResponseBody ResponseEntity getMessages() {
        final Gson gson = new GsonBuilder().create();
        return new ResponseEntity(gson.toJson(messageDao.getMessages()), HttpStatus.OK);
    }
    
   @RequestMapping(value = "/messages", method = RequestMethod.PUT, produces = "application/json")
    public @ResponseBody ResponseEntity putMessage(@RequestBody final String params) {
        final Gson gson = new GsonBuilder().create();
        final TestMessageOne m = gson.fromJson(params, TestMessageOne.class);
        return new ResponseEntity(gson.toJson(messageDao.putMessage(m)), HttpStatus.OK);
    }
    
   @RequestMapping(value = "/messages", method = RequestMethod.DELETE, produces = "application/json")
    public @ResponseBody ResponseEntity deleteMessage(@RequestBody final String params) {
        final Gson gson = new GsonBuilder().create();
        final TestMessageOne m = gson.fromJson(params, TestMessageOne.class);
        return new ResponseEntity(gson.toJson(messageDao.deleteMessage(m)), HttpStatus.OK);
    }
  
}
