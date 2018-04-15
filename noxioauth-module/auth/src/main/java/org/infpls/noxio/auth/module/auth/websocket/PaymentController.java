package org.infpls.noxio.auth.module.auth.websocket;

import com.google.gson.*;
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import org.infpls.noxio.auth.module.auth.dao.DaoContainer;
import org.infpls.noxio.auth.module.auth.dao.pay.PaymentDao;
import org.infpls.noxio.auth.module.auth.dao.user.User;
import org.infpls.noxio.auth.module.auth.session.NoxioSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class PaymentController {
  @Autowired
  private DaoContainer dao;
  
  @RequestMapping(value = "/pay/process", method = RequestMethod.POST, produces = "application/json")
  public @ResponseBody ResponseEntity process(HttpServletRequest request, @RequestBody final String data) {
    /* Validate */
    final Gson gson = new GsonBuilder().create();
    final PaymentParams pp = gson.fromJson(data, PaymentParams.class);
    
    if(pp.paymentId == null || pp.payerId == null) {
      return new ResponseEntity("Missing parameters.", HttpStatus.BAD_REQUEST);
    }
    
    /* do */
    try {
      PaymentDao.NoxioTransaction nt = dao.getPaymentDao().processPayment(pp.paymentId, pp.payerId);
      if(nt != null) {
        switch(nt.getItem()) {
          case SPEC : { dao.getUserDao().setUserType(nt.uid, User.Type.SPEC); break; }
          case FULL : { dao.getUserDao().setUserType(nt.uid, User.Type.FULL); break; }
          default : { throw new IOException("Item ENUM missing function case -> PaymentController::process()"); }
        }
        final User user = dao.getUserDao().getUserByUid(nt.uid);
        if(user == null) { throw new IOException("Account does not exist."); }
        final NoxioSession session = dao.getUserDao().getSessionByUser(user.name);
        if(session != null) { session.postPayment(); }
        return new ResponseEntity(HttpStatus.OK);
      }
    }
    catch(IOException ex) {
      return new ResponseEntity(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    catch(Exception ex) {
      return new ResponseEntity(ex.getClass() + " thrown while processing payment.", HttpStatus.BAD_REQUEST);
    }
    return new ResponseEntity("Error while processing payment.", HttpStatus.BAD_REQUEST);
  }
  
  @RequestMapping(value = "/pay/cancel", method = RequestMethod.POST, produces = "application/json")
  public @ResponseBody ResponseEntity cancel(HttpServletRequest request, @RequestBody final String data) {
    /* Validate */
    final Gson gson = new GsonBuilder().create();
    final PaymentParams pp = gson.fromJson(data, PaymentParams.class);
    
    if(pp.token == null) {
      return new ResponseEntity("Missing parameters.", HttpStatus.BAD_REQUEST);
    }
    
    try {
      if(dao.getPaymentDao().cancelPayment(pp.token)) {
        return new ResponseEntity(HttpStatus.OK);
      }
    }
    catch(IOException ex) {
      return new ResponseEntity(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    catch(Exception ex) {
      return new ResponseEntity(ex.getClass() + " thrown while canecling payment.", HttpStatus.BAD_REQUEST);
    }
    return new ResponseEntity("Error while canceling payment.", HttpStatus.BAD_REQUEST);
  }
  
  public class PaymentParams {
    public final String paymentId, payerId, token;
    public PaymentParams(String paymentId, String payerId, String token) {
      this.paymentId = paymentId;
      this.payerId = payerId;
      this.token = token;
    }
  }
}
