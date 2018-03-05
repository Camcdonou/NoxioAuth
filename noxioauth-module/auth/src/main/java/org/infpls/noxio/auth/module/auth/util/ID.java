package org.infpls.noxio.auth.module.auth.util;

import java.util.UUID;

public class ID {
  public static String generate32() {
    return UUID.randomUUID().toString().replaceAll("-", "");
  }
}
