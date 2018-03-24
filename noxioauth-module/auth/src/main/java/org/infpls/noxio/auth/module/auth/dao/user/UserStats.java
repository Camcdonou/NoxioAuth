package org.infpls.noxio.auth.module.auth.dao.user;

import java.util.Map;
import org.infpls.noxio.auth.module.auth.session.PacketH01; /* @TODO: noxio shared package for this bit as well */

public class UserStats {
  public final String uid;                   // Unique ID linking this to the user
  
  private int credits;
  public final long rank, globalCount;
  public final int lifeCredits;
  public final int kill, death, gameWin, gameLose, betrayed, betrayl;
  public final int firstBlood, killJoy, endedReign, flagCapture, flagDefense, hillControl;
  public final int perfect, humiliation;
  public final int mkx02, mkx03, mkx04, mkx05, mkx06, mkx07, mkx08, mkx09, mkx10, mkx11, mkx12, mkx13, mkx14, mkx15, mkx16, mkx17, mkx18, mkx19, mkx20;
  public final int ksx05, ksx10, ksx15, ksx20, ksx25, ksx30;
  public final int cumRes;
  
  public UserStats(final Map<String, Object> data) {
    uid = (String)data.get("UID");
    
    rank = (long)((double)data.get("RANK")); /* @TODO: I have no fucking clue y mysql returns the row number as a double. it make me angry. low priority bugfix */
    globalCount = (long)data.get("GLOBALCOUNT");
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
  
  public UserStats(final UserStats a, final PacketH01.Stats b) {
    uid = a.uid;
    
    rank = a.rank; globalCount = a.globalCount;
    credits = Math.max(0, a.getCredits() + b.credits);
    lifeCredits = a.lifeCredits + b.credits;
    
    kill = a.kill + b.kill;
    death = a.death + b.death;
    gameWin = a.gameWin + b.gameWin;
    gameLose = a.gameLose + b.gameLose;
    betrayed = a.betrayed + b.betrayed;
    betrayl = a.betrayl + b.betrayl;
    
    firstBlood = a.firstBlood + b.firstBlood;
    killJoy = a.killJoy + b.killJoy;
    endedReign = a.endedReign + b.endedReign;
    flagCapture = a.flagCapture + b.flagCapture;
    flagDefense = a.flagDefense + b.flagDefense;
    hillControl = a.hillControl + b.hillControl;
    
    perfect = a.perfect + b.perfect;
    humiliation = a.humiliation + b.humiliation;
    
    mkx02 = a.mkx02 + b.mkx02;
    mkx03 = a.mkx03 + b.mkx03;
    mkx04 = a.mkx04 + b.mkx04;
    mkx05 = a.mkx05 + b.mkx05;
    mkx06 = a.mkx06 + b.mkx06;
    mkx07 = a.mkx07 + b.mkx07;
    mkx08 = a.mkx08 + b.mkx08;
    mkx09 = a.mkx09 + b.mkx09;
    mkx10 = a.mkx10 + b.mkx10;
    mkx11 = a.mkx11 + b.mkx11;
    mkx12 = a.mkx12 + b.mkx12;
    mkx13 = a.mkx13 + b.mkx13;
    mkx14 = a.mkx14 + b.mkx14;
    mkx15 = a.mkx15 + b.mkx15;
    mkx16 = a.mkx16 + b.mkx16;
    mkx17 = a.mkx17 + b.mkx17;
    mkx18 = a.mkx18 + b.mkx18;
    mkx19 = a.mkx19 + b.mkx19;
    mkx20 = a.mkx20 + b.mkx20;
    
    ksx05 = a.ksx05 + b.ksx05;
    ksx10 = a.ksx10 + b.ksx10;
    ksx15 = a.ksx15 + b.ksx15;
    ksx20 = a.ksx20 + b.ksx20;
    ksx25 = a.ksx25 + b.ksx25;
    ksx30 = a.ksx30 + b.ksx30;
    
    cumRes = Math.max(0, a.cumRes + b.cumRes);
  }
  
  public UserStats add(final PacketH01.Stats b) {
    return new UserStats(this, b);
  }
  
  public int getCredits() { return credits; }
  public void subtractCredits(int sub) { credits = Math.max(0, credits-sub); }
}
