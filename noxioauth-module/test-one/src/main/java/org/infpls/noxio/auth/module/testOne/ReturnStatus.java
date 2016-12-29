package org.infpls.noxio.auth.module.testOne;

public class ReturnStatus {
  
  private final int code;
  /* - 0 :: Ok
     - 1 :: Info
     - 2 :: Error */
  private final String message, trace;

  public ReturnStatus(int code) {
    this.code = code;
    this.message = ""; this.trace = "";
  }
  
  public ReturnStatus(int code, String message) {
    this.code = code;
    this.message = message; this.trace = "";
  }
  
  public ReturnStatus(int code, String message, String trace) {
    this.code = code;
    this.message = message; this.trace = trace;
  }
  
  public int getCode() { return code; }
  public String getMessage() { return message; }
  public String getTrace() { return trace; }
}
