package org.infpls.noxio.auth.module.auth.util;

public class Validation {
  
  public static String validUserName(final String in) {
    if(!Validation.isAlphaNumeric(in)) { return "Username must be Alpha-Numeric characters only."; }
    if(in.length() < 4) { return "Username must be at least 4 characters."; }
    if(in.length() > 18) { return "Username cannot be longer than 18 characters."; }
    return null;
  }
  
  private static final String blankHash = Hash.sha256("");
  private static final String undefHash = Hash.sha256("undefined");
  private static final String xxblankHash = Hash.sha256("20xx");
  private static final String xxundefHash = Hash.sha256("20undefinedxx");
  public static String validHash(final String in) {
    if(in.length() != 64) { return "Invalid password hash."; }
    if(!Validation.isAlphaNumeric(in)) { return "Invalid password hash."; }
    if(blankHash.equals(in) || xxblankHash.equals(in)) { return "Password cannot be blank."; }
    if(undefHash.equals(in) || xxundefHash.equals(in)) { return "Don't use 'undefined' as a password, it's a bad idea."; }
    return null;
  }

  public static boolean isAlphaNumeric(final String in) {
    return in.matches("[a-zA-Z0-9]*");
  }
  
  public static String makeAlphaNumeric(final String in) {
    return in.replaceAll("[^A-Za-z0-9 ]", "");
  }
}
