
package org.infpls.noxio.auth.module.auth.dao.user;

import java.math.BigDecimal;
import java.util.Map;
import org.infpls.noxio.auth.module.auth.util.Validation;

public class UserSettings {
  public final String uid;                   // Unique ID linking this to the user
  
  public final Volume volume;
  public final Graphics graphics;
  public final Control control;
  public final Game game;
  public final Toggle toggle;
  
  /* This constructor creates a usersettings with all default values. */
  public UserSettings(final String uid) {
    this.uid = uid;
    volume = new Volume(.9f, .5f, .75f, .75f, .75f, .75f);
    graphics = new Graphics(1f, 1f, 1f, 2048, false, false);
    control = new Control(false, 70, 68, 32, 84, 83, 81);
    game = new Game(0, 0, 0, null, null, false, null, 1);
    toggle = new Toggle(false, false, false, false, false);
  }
  
  /* This constructor creates a usersettings with the values from a SQL querys Map<String, Object> */
  public UserSettings(final Map<String, Object> data) {
    this.uid = (String)data.get("UID");
    volume = new Volume(
      ((BigDecimal)data.get("VOLMASTER")).floatValue(),
      ((BigDecimal)data.get("VOLMUSIC")).floatValue(),
      ((BigDecimal)data.get("VOLVOICE")).floatValue(),
      ((BigDecimal)data.get("VOLANNOUNCER")).floatValue(),
      ((BigDecimal)data.get("VOLUI")).floatValue(),
      ((BigDecimal)data.get("VOLFX")).floatValue()
    );
    graphics = new Graphics(
      ((BigDecimal)data.get("GFXUPGAME")).floatValue(),
      ((BigDecimal)data.get("GFXUPUI")).floatValue(),
      ((BigDecimal)data.get("GFXUPSKY")).floatValue(),
      (int)data.get("GFXSHADOWSIZE"),
      (boolean)data.get("GFXSAFEMODE"),
      (boolean)data.get("GFXBLOOM")
    );
    control = new Control(
      (boolean)data.get("CONENABLEGAMEPAD"),
      (int)data.get("CONACTIONA"),
      (int)data.get("CONACTIONB"),
      (int)data.get("CONJUMP"),
      (int)data.get("CONTAUNT"),
      (int)data.get("CONTOSS"),
      (int)data.get("CONSCOREBOARD")
    );
    game = new Game(
      (int)data.get("GAMCOLOR"),
      (int)data.get("GAMREDCOLOR"),
      (int)data.get("GAMBLUECOLOR"),
      (String)data.get("GAMCUSTOMMESSAGEA"),
      (String)data.get("GAMCUSTOMMESSAGEB"),
      (boolean)data.get("GAMUSECUSTOMSOUND"),
      (String)data.get("GAMCUSTOMSOUNDFILE"),
      (int)data.get("GAMLAGCOMP")
    );
    toggle = new Toggle(
      (boolean)data.get("TOGDISABLEALTS"),
      (boolean)data.get("TOGDISABLECUSTOMSOUND"),
      (boolean)data.get("TOGDISABLECOLOR"),
      (boolean)data.get("TOGDISABLELOG"),
      (boolean)data.get("TOGDISABLEMETER")
    );
  }
  
  /* This constructor creates a user settings that applys all changed settings from 'edited' to 'source' */
  /* Some fields are purposefully ignored such as uid, or customSoundFile */
  public UserSettings(final UserSettings source, final UserSettings edited) {
    this.uid = source.uid;
    volume = new Volume(edited.volume.master, edited.volume.music, edited.volume.voice, edited.volume.announcer, edited.volume.ui, edited.volume.fx);
    graphics = new Graphics(edited.graphics.upGame, edited.graphics.upUi, edited.graphics.upSky, edited.graphics.shadowSize, edited.graphics.safeMode, edited.graphics.bloom);
    control = new Control(edited.control.enableGamepad, edited.control.actionA, edited.control.actionB, edited.control.jump, edited.control.taunt, edited.control.toss, edited.control.scoreboard);
    game = new Game(edited.game.color, edited.game.redColor, edited.game.blueColor, edited.game.customMessageA, edited.game.customMessageB, edited.game.useCustomSound, source.game.customSoundFile, edited.game.lagComp);
    toggle = new Toggle(edited.toggle.disableAlts, edited.toggle.disableCustomSound, edited.toggle.disableColor, edited.toggle.disableLog, edited.toggle.disableMeter);
  }
  
  public class Volume {
    public final float master, music, voice, announcer, ui, fx;
    public Volume(float ma, float mu, float vo, float an, float u, float f) {
      master = Math.min(1f, Math.max(0f, ma));
      music = Math.min(1f, Math.max(0f, mu));
      voice = Math.min(1f, Math.max(0f, vo));
      announcer = Math.min(1f, Math.max(0f, an));
      ui = Math.min(1f, Math.max(0f, u));
      fx = Math.min(1f, Math.max(0f, f));
    }
  }
  
  public class Graphics {
    public final float upGame, upUi, upSky;
    public final int shadowSize;
    public final boolean safeMode, bloom;
    public Graphics(float ug, float uu, float us, int ss, boolean sm, boolean bl) {
      upGame = Math.min(8f, Math.max(.25f, ug));
      upUi = Math.min(8f, Math.max(.25f, uu));
      upSky = Math.min(8f, Math.max(.25f, us));
      shadowSize = Math.min(4096, Math.max(16, ss));
      safeMode = sm;
      bloom = bl;
    }
  }
  
  public class Control {
    public final boolean enableGamepad;
    public final int actionA, actionB, jump, taunt, toss, scoreboard;
    public Control(boolean eg, int aa, int ab, int jm, int ta, int to, int sb) {
      enableGamepad = eg;
      actionA = Math.max(0, aa);
      actionB = Math.max(0, ab);
      jump = Math.max(0, jm);
      taunt = Math.max(0, ta);
      toss = Math.max(0, to);
      scoreboard = Math.max(0, sb);
    }
  }
  
  public class Game {
    public final int color, redColor, blueColor;
    public final String customMessageA, customMessageB;
    public final boolean useCustomSound;
    private String customSoundFile;
    public final int lagComp;
    public Game(int c, int rc, int bc, String cma, String cmb, boolean ucs, String csf, int lc) {
      color = c;
      redColor = rc;
      blueColor = bc;
      customMessageA = cma!=null?Validation.makeAlphaNumeric(cma.substring(0, Math.min(64, cma.length()))):null;
      customMessageB = cmb!=null?Validation.makeAlphaNumeric(cmb.substring(0, Math.min(64, cmb.length()))):null;
      useCustomSound = ucs;
      customSoundFile = csf;
      lagComp = Math.min(4, Math.max(0, lc));
    }
    public void setCustomSoundFile(String fn) { customSoundFile = fn; }
    public String getCustomSoundFile() { return customSoundFile; }
  }
  
  public class Toggle {
    public final boolean disableAlts, disableCustomSound, disableColor, disableLog, disableMeter;
    public Toggle(boolean da, boolean dcs, boolean dc, boolean dl, boolean dm) {
      disableAlts = da;
      disableCustomSound = dcs;
      disableColor = dc;
      disableLog = dl;
      disableMeter = dm;
    }
  }
}
