package org.infpls.noxio.auth.module.auth.dao.user;

import java.util.Map;

public class UserStats {
  public final String uid;                   // Unique ID linking this to the user
  
  public int credits, lifeCredits;
  public int kill, death, gameWin, gameLose, betrayed, betrayl;
  public int firstBlood, killJoy, endedReign, flagCapture, flagDefense, hillControl;
  public int perfect, humiliation;
  public int mkx02, mkx03, mkx04, mkx05, mkx06, mkx07, mkx08, mkx09, mkx10, mkx11, mkx12, mkx13, mkx14, mkx15, mkx16, mkx17, mkx18, mkx19, mkx20;
  public int ksx05, ksx10, ksx15, ksx20, ksx25, ksx30;
  public int cumRes;
  
  public UserStats(final Map<String, Object> data) {
    uid = (String)data.get("UID");
    
    credits = (int)data.get("CREDITS");
    lifeCredits = (int)data.get("LIFECREDITS");

    kill = (int)data.get("KEELL");
    death = (int)data.get("DEATH");
    gameWin = (int)data.get("GAMEWIN");
    gameLose = (int)data.get("GAMELOSE");
    betrayed = (int)data.get("BETRAYED");
    betrayl = (int)data.get("BETRAYL");

    firstBlood = (int)data.get("FIRSTBLOOD");
    killJoy = (int)data.get("KILLJOY");
    endedReign = (int)data.get("ENDEDREIGN");
    flagCapture = (int)data.get("FLAGCAPTURE");
    flagDefense = (int)data.get("FLAGDEFENSE");
    hillControl = (int)data.get("HILLCONTROL");

    perfect = (int)data.get("PERFECT");
    humiliation = (int)data.get("HUMILIATION");

    mkx02 = (int)data.get("MKX02");
    mkx03 = (int)data.get("MKX03");
    mkx04 = (int)data.get("MKX04");
    mkx05 = (int)data.get("MKX05");
    mkx06 = (int)data.get("MKX06");
    mkx07 = (int)data.get("MKX07");
    mkx08 = (int)data.get("MKX08");
    mkx09 = (int)data.get("MKX09");
    mkx10 = (int)data.get("MKX10");
    mkx11 = (int)data.get("MKX11");
    mkx12 = (int)data.get("MKX12");
    mkx13 = (int)data.get("MKX13");
    mkx14 = (int)data.get("MKX14");
    mkx15 = (int)data.get("MKX15");
    mkx16 = (int)data.get("MKX16");
    mkx17 = (int)data.get("MKX17");
    mkx18 = (int)data.get("MKX18");
    mkx19 = (int)data.get("MKX19");
    mkx20 = (int)data.get("MKX20");

    ksx05 = (int)data.get("KSX05");
    ksx10 = (int)data.get("KSX10");
    ksx15 = (int)data.get("KSX15");
    ksx20 = (int)data.get("KSX20");
    ksx25 = (int)data.get("KSX25");
    ksx30 = (int)data.get("KSX30");
    
    cumRes = (int)data.get("CUMRES");
  }
}
