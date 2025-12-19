package org.infpls.noxio.auth.module.auth.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.infpls.noxio.auth.module.auth.dao.DaoContainer;
import org.infpls.noxio.auth.module.auth.dao.user.User;
import org.infpls.noxio.auth.module.auth.dao.user.UserDao;
import org.infpls.noxio.auth.module.auth.util.ID;
import org.infpls.noxio.auth.module.auth.util.Validation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class AuthUser {
    
  @Autowired
  private DaoContainer dao;
  
  /* Account creation */
  @RequestMapping(value = "/auth/create", method = RequestMethod.POST, produces = "application/json")
  public @ResponseBody ResponseEntity authCreate(@RequestBody final String data) {
      try {       
        Gson gson = new GsonBuilder().create();
        final AuthCreate ac = gson.fromJson(data, AuthCreate.class);

        /* Validation */
        final String user = ac.user.toLowerCase();
        final String hash = ac.hash;

        String res;
        /* Username */
        if((res = Validation.validUserName(user)) != null) {
          return new ResponseEntity("{\"message\":\"" + res + "\"}", HttpStatus.CONFLICT);
        }
        /* Password Hash */
        if((res = Validation.validHash(hash)) != null) {
          return new ResponseEntity("{\"message\":\"" + res + "\"}", HttpStatus.CONFLICT);
        }

      /* Check if user exists */

        User u = dao.getUserDao().getUserByName(user);
        if(u != null) {
          return new ResponseEntity("{\"message\":\"Username already in use.\"}", HttpStatus.CONFLICT);
        }

        /* Send Email - DISABLED FOR NOW, CREATE ACCOUNT DIRECTLY */
        // final String vc = ID.generate6();
        // final String emcHTML = CREATE_EMAIL_CONTENT_HTML.replace("$$USER$$", user).replace("$$CODE$$", vc);
        // final String emcTEXT = CREATE_EMAIL_CONTENT_TEXT.replace("$$USER$$", user).replace("$$CODE$$", vc);
        // if(dao.getMailDao().send(email, CREATE_EMAIL_SUBJECT, emcTEXT)) {
        //   dao.getUserDao().createPending(user, hash, email, vc);
        //   return new ResponseEntity(HttpStatus.OK);
        // }
        // else { return new ResponseEntity("{\"message\":\"Failed to send verification email.\"}", HttpStatus.CONFLICT); }

        // Create account directly without email verification
        if(dao.getUserDao().createUser(user, null, hash)) {
          return new ResponseEntity(HttpStatus.OK);
        }
        else {
          return new ResponseEntity("{\"message\":\"Failed to create account.\"}", HttpStatus.CONFLICT);
        }

      }
      catch(Exception ex) {
          return new ResponseEntity("{\"message\":\"Unknown exception while processing user creation.\"}", HttpStatus.CONFLICT);
      }
  }

  public static class AuthCreate {
    public final String user, hash;
    public AuthCreate(String user, String hash) {
      this.user = user; this.hash = hash;
    }
  }
}
