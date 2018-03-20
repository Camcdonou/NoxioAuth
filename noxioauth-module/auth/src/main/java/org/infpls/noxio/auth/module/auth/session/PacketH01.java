package org.infpls.noxio.auth.module.auth.session;

import org.infpls.noxio.auth.module.auth.dao.user.UserStats;

/* @TODO: falls under "shared" packets between auth and game. please make a package for this in the future. */

public class PacketH01 extends Packet {
  
  private final String user;
  private final Stats stats;
  public PacketH01(final String user, final Stats stats) {
    super("h01");
    this.user = user; this.stats = stats;
  }
  
  public String getUser() { return user; }
  public Stats getStats() { return stats; }
  
  public class Stats {
    public int credits;
    public int kill, death, gameWin, gameLose, betrayed, betrayl;
    public int firstBlood, killJoy, endedReign, flagCapture, flagDefense, hillControl;
    public int perfect, humiliation;
    public int mkx02, mkx03, mkx04, mkx05, mkx06, mkx07, mkx08, mkx09, mkx10, mkx11, mkx12, mkx13, mkx14, mkx15, mkx16, mkx17, mkx18, mkx19, mkx20;
    public int ksx05, ksx10, ksx15, ksx20, ksx25, ksx30;
    public int cumRes;
    
    public Stats() {
      credits = 0;
      kill = 0; death = 0; gameWin = 0; gameLose = 0; betrayed = 0; betrayl = 0;
      firstBlood = 0; killJoy = 0; endedReign = 0; flagCapture = 0; flagDefense = 0; hillControl = 0;
      perfect = 0; humiliation = 0;
      mkx02 = 0; mkx03 = 0; mkx04 = 0; mkx05 = 0; mkx06 = 0; mkx07 = 0; mkx08 = 0; mkx09 = 0; mkx10 = 0;
      mkx11 = 0; mkx12 = 0; mkx13 = 0; mkx14 = 0; mkx15 = 0; mkx16 = 0; mkx17 = 0; mkx18 = 0; mkx19 = 0; mkx20 = 0;
      ksx05 = 0; ksx10 = 0; ksx15 = 0; ksx20 = 0; ksx25 = 0; ksx30 = 0;
      cumRes = 0;
    }
  }
}
