package org.infpls.noxio.auth.module.auth.util;

import com.google.gson.*;
import java.io.IOException;
import java.util.*;

/* Global settings, read from file noxio.properties. */
/* This was used instead of spring config due to many minor issues caused by spring */
public class Settable {
  
  private static final String FILE = "noxio.properties";
  private static boolean INIT = false;
  
  private static String SQL_DRIVER, SQL_URL, SQL_USER, SQL_PASS;                // SQL settings
  private static String MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS;             // Mail settings
  private static String PAYPAL_ID, PAYPAL_SECRET, PAYPAL_CANCEL, PAYPAL_PROCESS;// Paypal settings
  private static String FILE_PATH;                                              // File Store settings
  private static List<ServerInfo> GAME_SERVERS;                                 // Game Server settings
  private static Set<String> WHITELIST;                                         // Whitelisted IP addresses

  /* Checks if the settings finle ( FILE ) has been changed or yet to be loaded and reads it into this class */
  public static synchronized void update() {
    if(!INIT) { read(); INIT = true; }
    /* @TODO: check and update */
  }
  
  /* Reads in all settings from the properties file to this class */
  private static void read() {
    try {
      final String data = Scung.readFile(FILE);
      final JsonElement json = new JsonParser().parse(data);

      final JsonObject sql = json.getAsJsonObject().getAsJsonObject("sql");
      final JsonObject mail = json.getAsJsonObject().getAsJsonObject("mail");
      final JsonObject pay = json.getAsJsonObject().getAsJsonObject("pay");
      final JsonObject file = json.getAsJsonObject().getAsJsonObject("file");
      final JsonArray gameServers = json.getAsJsonObject().getAsJsonObject("game").getAsJsonArray("servers");

      SQL_DRIVER = sql.get("driver").getAsString();
      SQL_URL = sql.get("url").getAsString();
      SQL_USER = sql.get("user").getAsString();
      SQL_PASS = sql.get("pass").getAsString();

      MAIL_HOST = mail.get("host").getAsString();
      MAIL_PORT = mail.get("port").getAsString();
      MAIL_USER = mail.get("user").getAsString();
      MAIL_PASS = mail.get("pass").getAsString();
      
      PAYPAL_ID = pay.get("id").getAsString();
      PAYPAL_SECRET = pay.get("secret").getAsString();
      PAYPAL_CANCEL = pay.get("cancel").getAsString();
      PAYPAL_PROCESS = pay.get("process").getAsString();

      FILE_PATH = file.get("path").getAsString();

      GAME_SERVERS = new ArrayList();
      WHITELIST = new HashSet<>();
      WHITELIST.add("127.0.0.1");
      WHITELIST.add("0:0:0:0:0:0:0:1");
      for(int i=0;i<gameServers.size();i++) {
        final JsonObject serv = gameServers.get(i).getAsJsonObject();
        final String name = serv.get("name").getAsString();
        final String domain = serv.get("domain").getAsString();
        final String address = serv.get("address").getAsString().trim();
        final int port = serv.get("port").getAsInt();
        GAME_SERVERS.add(new ServerInfo(name, domain, address, port));
        WHITELIST.add(address);
      }
    }
    catch(IOException ex) {
      System.err.println("Settable.read :: Failed to read settings file: " + FILE);
      ex.printStackTrace();
    }
    catch(JsonParseException | NumberFormatException ex) {
      System.err.println("Settable.read :: Failed to parse settings file: " + FILE);
      ex.printStackTrace();
    }
  }
  
  public static class ServerInfo {
    public final String name, domain, address;
    public final int port;
    public ServerInfo(final String name, final String domain, final String address, final int port) {
      this.name = name; this.domain = domain; this.address = address;
      this.port = port;
    }
  }
  
  public static String getSqlDriver() { return SQL_DRIVER; }
  public static String getSqlUrl() { return SQL_URL; }
  public static String getSqlUser() { return SQL_USER; }
  public static String getSqlPass() { return SQL_PASS; }
  public static String getMailHost() { return MAIL_HOST; }
  public static String getMailPort() { return MAIL_PORT; }
  public static String getMailUser() { return MAIL_USER; }
  public static String getMailPass() { return MAIL_PASS; }
  public static String getPayPalId() { return PAYPAL_ID; }
  public static String getPayPalSecret() { return PAYPAL_SECRET; }
  public static String getPayPalCancel() { return PAYPAL_CANCEL; }
  public static String getPayPalProcess() { return PAYPAL_PROCESS; }
  public static String getFilePath() { return FILE_PATH; }
  public static List<ServerInfo> getGameServerInfo() { return GAME_SERVERS; }
  
  public static boolean isWhiteListed(String addr) {
    if (addr == null) return false;
    String cleanAddr = addr.trim();
    if (cleanAddr.startsWith("::ffff:")) {
      cleanAddr = cleanAddr.substring(7);
    }
    if (cleanAddr.startsWith("172.18.0.") || cleanAddr.startsWith("172.17.0.")) {
      return true;
    }
    return WHITELIST != null && WHITELIST.contains(cleanAddr);
  }
}
