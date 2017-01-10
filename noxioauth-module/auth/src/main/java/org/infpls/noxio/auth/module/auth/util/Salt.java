package org.infpls.noxio.auth.module.auth.util;

import java.util.UUID;

public class Salt {
  public static String generate() {
    return UUID.randomUUID().toString().replaceAll("-", "");
  }
}
