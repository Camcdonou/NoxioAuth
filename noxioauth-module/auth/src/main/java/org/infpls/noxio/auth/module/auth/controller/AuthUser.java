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
        final String email = ac.email.trim();

        String res;
        /* Username */
        if((res = Validation.validUserName(user)) != null) {
          return new ResponseEntity("{\"message\":\"" + res + "\"}", HttpStatus.CONFLICT);
        }
        /* Password Hash */
        if((res = Validation.validHash(hash)) != null) {
          return new ResponseEntity("{\"message\":\"" + res + "\"}", HttpStatus.CONFLICT);
        }
        /* Email */
        if((res = Validation.validEmail(email)) != null) {
          return new ResponseEntity("{\"message\":\"" + res + "\"}", HttpStatus.CONFLICT);
        }

      /* Check if user exists */

        User u = dao.getUserDao().getUserByName(user);
        if(u != null) {
          return new ResponseEntity("{\"message\":\"Username already in use.\"}", HttpStatus.CONFLICT);
        }

        /* Check if email in use */
        u = dao.getUserDao().getUserByEmail(email);
        if(u != null) {
          return new ResponseEntity("{\"message\":\"Email already in use.\"}", HttpStatus.CONFLICT);
        }

        /* Send Email */
        final String vc = ID.generate6();
        final String emcHTML = CREATE_EMAIL_CONTENT_HTML.replace("$$USER$$", user).replace("$$CODE$$", vc);
        final String emcTEXT = CREATE_EMAIL_CONTENT_TEXT.replace("$$USER$$", user).replace("$$CODE$$", vc);
        if(dao.getMailDao().send(email, CREATE_EMAIL_SUBJECT, emcHTML, emcTEXT)) {         // Verification email has been sent successfully /* @TODO: blocking. */
          dao.getUserDao().createPending(user, hash, email, vc);
          return new ResponseEntity(HttpStatus.OK);
        }           
        else { return new ResponseEntity("{\"message\":\"Failed to send verification email.\"}", HttpStatus.CONFLICT); }

      }
      catch(Exception ex) {
          return new ResponseEntity("{\"message\":\"Unknown exception while processing user creation.\"}", HttpStatus.CONFLICT);
      }
  }
  
    /* Account Verification */
  @RequestMapping(value = "/auth/verify/{user}/{code}", method = RequestMethod.GET, produces = "text/html")
  public @ResponseBody ResponseEntity authVerify(@PathVariable String user, @PathVariable String code) {
      try {
        /* Validation */
        final UserDao.PendingUser pu = dao.getUserDao().getPending(user, code);
        if(pu == null) {  return new ResponseEntity("Invalid verification code.", HttpStatus.OK); }
        if(dao.getUserDao().createUser(pu.name, pu.email, pu.hash)) {
          return new ResponseEntity("Account created succesfully!", HttpStatus.OK);
        }
        else {
          return new ResponseEntity("Error during account creation.", HttpStatus.OK);
        }
      }
      catch(Exception ex) {
          return new ResponseEntity("Unknown exception while processing user verification.", HttpStatus.CONFLICT);
      }
  }
  
  /* Request Password Reset */
  @RequestMapping(value = "/auth/reset/request", method = RequestMethod.POST, produces = "application/json")
  public @ResponseBody ResponseEntity authResetRequest(@RequestBody final String data) {
      try {
        Gson gson = new GsonBuilder().create();
        final AuthRequest ar = gson.fromJson(data, AuthRequest.class);

        /* Validation */
        final String user = ar.user.toLowerCase();
        final String email = ar.email.trim();
        
        /* Username */
        if(Validation.validUserName(user) != null) {
          return new ResponseEntity("{\"message\":\"Invalid user/email.\"}", HttpStatus.CONFLICT);
        }
        /* Email */
        if(Validation.validEmail(email) != null) {
          return new ResponseEntity("{\"message\":\"Invalid user/email.\"}", HttpStatus.CONFLICT);
        }
        
        /* Get User */
        final User usr = dao.getUserDao().getUserByName(ar.user);

        /* Validate */
        if(usr == null || !usr.email.equals(email)) {
          return new ResponseEntity("{\"message\":\"Invalid user/email.\"}", HttpStatus.CONFLICT);
        }

        /* Send Email */
        final String vc = ID.generate6();
        final String emcHTML = RESET_EMAIL_CONTENT_HTML.replace("$$USER$$", usr.name).replace("$$CODE$$", vc);
        final String emcTEXT = RESET_EMAIL_CONTENT_TEXT.replace("$$USER$$", usr.name).replace("$$CODE$$", vc);
        if(dao.getMailDao().send(usr.email, RESET_EMAIL_SUBJECT, emcHTML, emcTEXT)) {
          dao.getUserDao().createReset(user, email, vc);
          return new ResponseEntity(HttpStatus.OK);
        }
        else { return new ResponseEntity("{\"message\":\"Failed to send reset email.\"}", HttpStatus.CONFLICT); }
      }
      catch(Exception ex) {
          return new ResponseEntity("{\"message\":\"Unknown exception while requesting reset.\"}", HttpStatus.CONFLICT);
      }
  }
  
  /* Request Password Reset */
  @RequestMapping(value = "/auth/reset/process", method = RequestMethod.POST, produces = "application/json")
  public @ResponseBody ResponseEntity authResetProcess(@RequestBody final String data) {
      try {
        Gson gson = new GsonBuilder().create();
        final AuthReset ar = gson.fromJson(data, AuthReset.class);

        /* Validation */
        final String verification = ar.verification;
        final String hash = ar.hash;
        
        /* Password Hash */
        String res;
        if((res = Validation.validHash(hash)) != null) {
          return new ResponseEntity("{\"message\":\"" + res + "\"}", HttpStatus.CONFLICT);
        }
        
        final UserDao.PendingReset pr = dao.getUserDao().getReset(verification);
        if(pr == null) { return new ResponseEntity("{\"message\":\"Invalid verification.\"}", HttpStatus.CONFLICT); }
        
        final User usr = dao.getUserDao().getUserByName(pr.name);
        dao.getUserDao().changeUserPassword(usr, hash);
        
        return new ResponseEntity(HttpStatus.OK);
      }
      catch(Exception ex) {
        return new ResponseEntity("{\"message\":\"Unknown exception while processing reset.\"}", HttpStatus.CONFLICT);
      }
  }
  
  public static class AuthCreate {
    public final String user, hash, email;
    public AuthCreate(String user, String hash, String email) {
      this.user = user; this.hash = hash; this.email = email;
    }
  }
  
  public static class AuthRequest {
    public final String user, email;
    public AuthRequest(String user, String email) {
      this.user = user; this.email = email;
    }
  }
  
  public static class AuthReset {
    public final String verification, hash;
    public AuthReset(String verification, String hash) {
      this.verification = verification; this.hash = hash;
    }
  }
  
  /* @TODO: Cleanup html messages, this is messy. Move to seperate static class? */
  private static final String CREATE_EMAIL_SUBJECT = "Welcome to 20xx.io";
  private static final String CREATE_EMAIL_CONTENT_HTML = "<html>\n" +
  "<head>\n" +
  "  <title>20XX.io</title>\n" +
  "</head>\n" +
  "<body>\n" +
  "<div style='width: 512px; font-family:Arial,Helvetica,sans-serif;'>\n" +
  " <div style='background-color:#0d1e33; color:#c6d4df;'>\n" +
  " <div style='background-color:#28323a; color:#c6d4df; font-size:32px; padding:8px 8px 0px 8px'>The Year Is 20XX . . .</div>\n" +
  "  <p style='font-size:18px; padding:0px 8px 0px 8px; color:#c6d4df;'>\n" +
  "  Thanks for joining 20XX.io.\n" +
  "  <div style='font-size:18px; padding:0px 8px 0px 8px; color:#c6d4df;'>Click this link to verify your account:</div>\n" +
  "  <span style='font-size:32px;background-color:#6c6e70; color:#c6d4df; font-weight: bold; margin:0px 8px 0px 8px;'>" +
  "    <a style='color:#c6d4df;' href='https://www.20xx.io/nxc/auth/verify/$$USER$$/$$CODE$$'>$$CODE$$</a></span>\n" +
  "  <div style='font-size:18px; padding:0px 8px 0px 8px; color:#c6d4df;'>Your username is:</div>\n" +
  "  <span style='font-size:32px;background-color:#6c6e70; color:#c6d4df; font-weight: bold; margin:0px 8px 0px 8px;'>$$USER$$</span>\n" +
  "  <div style='font-size:12px; padding:0px 8px 0px 8px; color:#c6d4df;'>By activating your account you agree to our terms of service which can be found at 20xx.io/nxc/tos.html</div>\n" +
  "  <div style='background-color:#0d1e33; color:#0d1e33; font-size:32px;'>_</div>\n" +
  " </div>\n" +
  "</div>\n" +
  "</body>\n" +
  "</html>\n" +
  "";
  private static final String CREATE_EMAIL_CONTENT_TEXT = "The Year Is 20XX . . .\n" +
  "Thanks for joining 20XX.io. To finish creating your account copy the code below and enter it on the site.\n" +
  "\n" +
  "Your username is: $$USER$$\n" +
  "Copy this link to verify your account: https://www.20xx.io/nxc/auth/verify/$$USER$$/$$CODE$$" +
  "Now get out there and get destrudled!";

  private static final String RESET_EMAIL_SUBJECT = "20xx.io Password Reset";
  private static final String RESET_EMAIL_CONTENT_HTML = "<html>\n" +
  "<head>\n" +
  "  <title>20XX.io</title>\n" +
  "</head>\n" +
  "<body>\n" +
  "<div style='width: 512px; font-family:Arial,Helvetica,sans-serif;'>\n" +
  " <div style='background-color:#0d1e33; color:#c6d4df;'>\n" +
  " <div style='background-color:#28323a; color:#c6d4df; font-size:32px; padding:8px 8px 0px 8px'>Password Reset Request</div>\n" +
  "  <p style='font-size:18px; padding:0px 8px 0px 8px; color:#c6d4df;'>\n" +
  "  Forgot something?\n</p>" +
  "  <div style='font-size:18px; padding:0px 8px 0px 8px; color:#c6d4df;'>Your code is:</div>\n" +
  "  <span style='font-size:32px;background-color:#6c6e70; color:#c6d4df; font-weight: bold; margin:0px 8px 0px 8px;'>$$CODE$$</span>\n" +
  "  <div style='background-color:#0d1e33; color:#0d1e33; font-size:32px;'>_</div>\n" +
  " </div>\n" +
  "</div>\n" +
  "</body>\n" +
  "</html>\n" +
  "";
  private static final String RESET_EMAIL_CONTENT_TEXT = "Password Reset Request\n" +
  "Forgot something?\n" +
  "\n" +
  "Your code is: $$CODE$$";
}
