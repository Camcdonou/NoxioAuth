
package org.infpls.noxio.auth.module.auth.dao.user;

import java.math.BigDecimal;
import java.util.Map;

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
    volume = new Volume(.9f, .5f, .75f, .75f, .75f);
    graphics = new Graphics(1f, 1f, 1f, 2048, false);
    control = new Control(false, 70, 68, 32, 84, 83, 192);
    game = new Game(0, 0, 0, false, null);
    toggle = new Toggle(false, false, false);
  }
  
  /* This constructor creates a usersettings with the values from a SQL querys Map<String, Object> */
  public UserSettings(final Map<String, Object> data) {
    this.uid = (String)data.get("UID");
    volume = new Volume(
      ((BigDecimal)data.get("VOLMASTER")).floatValue(),
      ((BigDecimal)data.get("VOLMUSIC")).floatValue(),
      ((BigDecimal)data.get("VOLVOICE")).floatValue(),
      ((BigDecimal)data.get("VOLANNOUNCER")).floatValue(),
      ((BigDecimal)data.get("VOLFX")).floatValue()
    );
    graphics = new Graphics(
      ((BigDecimal)data.get("GFXUPGAME")).floatValue(),
      ((BigDecimal)data.get("GFXUPUI")).floatValue(),
      ((BigDecimal)data.get("GFXUPSKY")).floatValue(),
      (int)data.get("GFXSHADOWSIZE"),
      (boolean)data.get("GFXSAFEMODE")
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
      (boolean)data.get("GAMUSECUSTOMSOUND"),
      (String)data.get("GAMCUSTOMSOUNDFILE")
    );
    toggle = new Toggle(
      (boolean)data.get("TOGDISABLEALTS"),
      (boolean)data.get("TOGDISABLECUSTOMSOUND"),
      (boolean)data.get("TOGDISABLECOLOR")
    );
  }
  
  /* This constructor creates a user settings that applys all changed settings from 'edited' to 'source' */
  /* Some fields are purposefully ignored such as uid, or customSoundFile */
  public UserSettings(final UserSettings source, final UserSettings edited) {
    this.uid = source.uid;
    volume = new Volume(edited.volume.master, edited.volume.music, edited.volume.voice, edited.volume.announcer, edited.volume.fx);
    graphics = new Graphics(edited.graphics.upGame, edited.graphics.upUi, edited.graphics.upSky, edited.graphics.shadowSize, edited.graphics.safeMode);
    control = new Control(edited.control.enableGamepad, edited.control.actionA, edited.control.actionB, edited.control.jump, edited.control.taunt, edited.control.toss, edited.control.scoreboard);
    game = new Game(edited.game.color, edited.game.redColor, edited.game.blueColor, edited.game.useCustomSound, source.game.customSoundFile);
    toggle = new Toggle(edited.toggle.disableAlts, edited.toggle.disableCustomSound, edited.toggle.disableColor);
  }
  
  public class Volume {
    public final float master, music, voice, announcer, fx;
    public Volume(float ma, float mu, float vo, float an, float f) {
      master = Math.min(1f, Math.max(0f, ma));
      music = Math.min(1f, Math.max(0f, mu));
      voice = Math.min(1f, Math.max(0f, vo));
      announcer = Math.min(1f, Math.max(0f, an));
      fx = Math.min(1f, Math.max(0f, f));
    }
  }
  
  public class Graphics {
    public final float upGame, upUi, upSky;
    public final int shadowSize;
    public final boolean safeMode;
    public Graphics(float ug, float uu, float us, int ss, boolean sm) {
      upGame = Math.min(8f, Math.max(.25f, ug));
      upUi = Math.min(8f, Math.max(.25f, uu));
      upSky = Math.min(8f, Math.max(.25f, us));
      shadowSize = Math.min(4096, Math.max(128, ss));
      safeMode = sm;
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
    public final boolean useCustomSound;
    public final String customSoundFile;
    public Game(int c, int rc, int bc, boolean ucs, String csf) {
      color = c;
      redColor = rc;
      blueColor = bc;
      useCustomSound = ucs;
      customSoundFile = csf;
    }
  }
  
  public class Toggle {
    public final boolean disableAlts, disableCustomSound, disableColor;
    public Toggle(boolean da, boolean dcs, boolean dc) {
      disableAlts = da;
      disableCustomSound = dcs;
      disableColor = dc;
    }
  }
}
