package org.infpls.noxio.auth.module.auth.dao.pay;
       
import java.util.List;
import java.util.ArrayList;
import java.util.Iterator;

import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import com.paypal.api.payments.*;
import java.io.IOException;
import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Map;
import org.infpls.noxio.auth.module.auth.dao.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class PaymentDao {
  
  public static enum Item {
    FULL("Full game purchase for 20xx.io. Includes all content.", 5f),
    SPEC("Feature purchase for 20xx.io. Unlocks all extra features and customization options.", 3f);
    
    public final float price, tax;
    public final String description;
    Item(String description, float price) {
      this.description = description;
      this.price = new BigDecimal(price).setScale(2, BigDecimal.ROUND_HALF_UP).floatValue(); tax = new BigDecimal(price*TAX_RATE).setScale(2, BigDecimal.ROUND_HALF_UP).floatValue();
    }
  }
  
  /* @TODO: properties files */
  private final static String CLIENT_ID = "ATbnMRGYZ47hMEp6yQXWmJp_uI0U2cnwzcpEWTSl6E5vveUzBSggIp4y73gsoTuXAVw-TYRGl-G7lTsu";
  private final static String CLIENT_SECRET = "EPiz38XWeTBXWkZFweoWFMg5VYgGs0W6mdCiWZipBUTUf-58xw7FMeXqnuWBcO-ODFplzKEChRp_IBQD";
  private final static String CANCEL_URL = "http://localhost:7001/noxioauth/transaction/cancel.html";
  private final static String PROCESS_URL = "http://localhost:7001/noxioauth/transaction/process.html";
  
  private final static float TAX_RATE = 0.09f; /* cancer */
  private final static String CURRENCY = "USD", INTENT = "sale";
  
  @Autowired
  public JdbcTemplate jdbc;

  private final APIContext context;
  
  public PaymentDao() {
    context = new APIContext(CLIENT_ID, CLIENT_SECRET, "sandbox");
  }
  
  public String doPayment(final User user, final Item item) throws IOException {
    // Set payer details
    Payer payer = new Payer();
    payer.setPaymentMethod("paypal");

    // Set redirect URLs
    RedirectUrls redirectUrls = new RedirectUrls();
    redirectUrls.setCancelUrl(CANCEL_URL);
    redirectUrls.setReturnUrl(PROCESS_URL);

    // Set payment details
    Details details = new Details();
    details.setSubtotal(Float.toString(item.price));
    details.setTax(Float.toString(item.tax));

    // Payment amount
    Amount amount = new Amount();
    amount.setCurrency(CURRENCY);
    // Total must be equal to sum of shipping, tax and subtotal.
    amount.setTotal(Float.toString(item.price + item.tax));
    amount.setDetails(details);

    // Transaction information
    Transaction transaction = new Transaction();
    transaction.setAmount(amount);
    transaction.setDescription(item.description);

    // Add transaction to a list
    List<Transaction> transactions = new ArrayList();
    transactions.add(transaction);
    
    // Add payment details
    Payment payment = new Payment();
    payment.setIntent(INTENT);
    payment.setPayer(payer);
    payment.setRedirectUrls(redirectUrls);
    payment.setTransactions(transactions);
    
    /* --------------------- */
    
    // Create payment
    try {
      Payment createdPayment = payment.create(context);

      Iterator links = createdPayment.getLinks().iterator();
      while (links.hasNext()) {
        Links link = (Links)links.next();
        if (link.getRel().equalsIgnoreCase("approval_url")) {
          createTransaction(createdPayment.getId(), user, item);
          return link.getHref();
        }
      }
    } catch (PayPalRESTException e) {
        System.err.println(e.getDetails());
        e.printStackTrace();
    }
    return null;
  }
  
  /* Returns the completed NoxioTransaction if payment is valid and succeeds. Returns null is payment is invalid.
     Throws IOException if there is an error, exception message is returned to user */
  public NoxioTransaction processPayment(String paymentId, String payerId) throws IOException {
    Payment payment = new Payment();
    payment.setId(paymentId);

    PaymentExecution paymentExecution = new PaymentExecution();
    paymentExecution.setPayerId(payerId);
    try {
      Payment createdPayment = payment.execute(context, paymentExecution);
      completeTransaction(createdPayment.getId());
      final NoxioTransaction nt = getTransaction(createdPayment.getId());
      return nt;
    }
    catch (PayPalRESTException e) {
      throw new IOException(e.getDetails().getName() + " :: " + e.getDetails().getMessage());
    }
  }
  
  public boolean cancelPayment(String token) throws IOException {
    /* @TODO in the current paypal api it appears that this is done automatically after a
             few hours have passed. its odd. im leaving this method in place for future changes.
    */
    return true;
  }
  
  private void createTransaction(String tid, User user, Item item) throws IOException {
    try {
      jdbc.update(
        "INSERT into TRANSACTIONS ( TID, UID, ITEM, CREATED, UPDATED, COMPLETE ) VALUES ( ?, ?, ?, NOW(), NOW(), false )",
              tid, user.uid, item.name()
      );
    }
    catch(DataAccessException ex) {
      System.err.println("PaymentDao::createTransaction() - SQL Error!");
      ex.printStackTrace();
      throw new IOException("SQL Error during transaction creation.");
    }
  }
  
  private void completeTransaction(String tid) throws IOException {
    try {
      jdbc.update(
        "UPDATE TRANSACTIONS SET COMPLETE=true, UPDATED=NOW() WHERE TID=?",
              tid
      );
    }
    catch(DataAccessException ex) {
      System.err.println("PaymentDao::completeTransaction() - SQL Error!");
      ex.printStackTrace();
      throw new IOException("SQL Error during transaction update.");
    }
  }
  
  private NoxioTransaction getTransaction(String tid) throws IOException {
    try {
      final List<Map<String,Object>> results = jdbc.queryForList(
        "SELECT * FROM TRANSACTIONS WHERE TID=?",
        tid
      );
      if(results.size() > 0) {
        return new NoxioTransaction(results.get(0));
      }
    }
    catch(DataAccessException ex) {
      System.err.println("PaymentDao::getTransaction() - SQL Error!");
      ex.printStackTrace();
      throw new IOException("SQL Error during transaction retrieval.");
    }
    catch(ClassCastException | NullPointerException ex) {
      System.err.println("PaymentDao::getTransaction() - SQL Data Mapping Error!");
      ex.printStackTrace();
      throw new IOException("SQL Error during transaction retrieval.");
    }
    return null;
  }
  
  private void deleteTransaction(String tid) throws IOException {
    try {
      jdbc.update(
        "DELETE FROM TRANSACTIONS WHERE TID=?",
              tid
      );
    }
    catch(DataAccessException ex) {
      System.err.println("PaymentDao::deleteTransaction() - SQL Error!");
      ex.printStackTrace();
      throw new IOException("SQL Error during transaction deletion.");
    }
  }

  public static class NoxioTransaction {
    
    public final String tid, uid;
    private Item item;
    public final Timestamp created, updated;
    public final boolean complete;
    private NoxioTransaction(Map<String, Object> data) {
      tid = (String)data.get("TID");
      uid = (String)data.get("UID");
      created = (Timestamp)data.get("CREATED");
      updated = (Timestamp)data.get("UPDATED");
      complete = (boolean)data.get("COMPLETE");
      
      try {
        final String itm = (String)data.get("ITEM");
        final Field en = Item.class.getField(itm);
        item = ((Item)en.get(null));
      }
      catch(NoSuchFieldException | IllegalAccessException ex) {
        System.err.println("PaymentDao::new - Error parsing transaction data from database.");
        ex.printStackTrace();
      }
    }
    
    public Item getItem() { return item; }
  }
}
