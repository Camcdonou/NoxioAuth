package org.infpls.noxio.auth.module.testOne;

import java.util.Date;

public class TestMessageOne {
  private final int id;
  private final String author, message, date;
  
  public TestMessageOne(int id, String author, String message) {
    this.id = id;
    this.author = author; this.message = message; this.date = new Date().toString();
  }
  
  public int getId() { return id; }
  public String getAuthor() { return author; }
  public String getMessage() { return message; }
  public String getDate() { return date; }
}
