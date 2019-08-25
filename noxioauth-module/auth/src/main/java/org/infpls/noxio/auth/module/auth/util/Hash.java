package org.infpls.noxio.auth.module.auth.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import org.springframework.security.crypto.bcrypt.BCrypt;

public class Hash {
  public static String sha256(final String in) {
        try {
          MessageDigest digest = MessageDigest.getInstance("SHA-256");
          byte[] hash = digest.digest(in.getBytes(StandardCharsets.UTF_8));

          //convert the byte to hex format method 1
          StringBuffer sb = new StringBuffer();
          for (int i = 0; i < hash.length; i++) {
            sb.append(Integer.toString((hash[i] & 0xff) + 0x100, 16).substring(1));
          }

          return sb.toString();
        }
        catch(NoSuchAlgorithmException ex) {
          /* If this ever actually happens I'll be really upset */
          Oak.log(Oak.Type.SYSTEM, Oak.Level.CRIT, "Thinking Emoji", ex);
        }
        return null;
  }
  
  public static String bcrypt(final String pass) {
    return BCrypt.hashpw(pass, BCrypt.gensalt(12));
  }
}
