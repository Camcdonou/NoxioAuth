package org.infpls.noxio.auth.module.auth.util;

import java.util.UUID;

public class ID {
  public static String generate32() {
    return UUID.randomUUID().toString().replaceAll("-", "");
  }
  
  public static String generate6() {
    return UUID.randomUUID().toString().replaceAll("-", "").substring(0,6);
  }
}
