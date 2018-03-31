package org.infpls.noxio.auth.module.auth.dao.user;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.lang.reflect.Field;
import java.sql.Timestamp;
import java.util.HashMap;

public class UserUnlocks { 
  public static enum Key {
      CHAR_BOX, CHAR_CRATE, CHAR_VOXEL, CHAR_CARGO, CHAR_BLOCK, CHAR_QUAD, CHAR_INFERNO,
      ALT_BOXGOLD, ALT_BOXRED, ALT_CRATEORANGE, ALT_VOXELGREEN, ALT_BLOCKROUND, ALT_QUADFIRE,
      FT_COLOR, FT_SOUND;
  }
  
  public static enum Type {
    CHARACTER, ALTERNATE, FEATURE
  }
  
  private static final List<Unlock> UNLOCKS = Arrays.asList(
    new Unlock(Key.CHAR_BOX, "Box", "So good that he even has a 60/40 matchup against himself.", Type.CHARACTER, 250, false),
    new Unlock(Key.CHAR_CRATE, "Crate", "Prefers the air.", Type.CHARACTER, 250, false),
    new Unlock(Key.CHAR_VOXEL, "Voxel", "Telefragging the competition.", Type.CHARACTER, 250, false),
    new Unlock(Key.CHAR_CARGO, "Cargo", "Punch.", Type.CHARACTER, 250, false),
    new Unlock(Key.CHAR_QUAD, "Quad", "Geometric concepts with swords.", Type.CHARACTER, 250, false),
    new Unlock(Key.CHAR_INFERNO, "InfernoPlus", "Unsubscribed.", Type.CHARACTER, 123456789, false),
    
    new Unlock(Key.ALT_BOXGOLD, "Golden Box", "Solid gold means you are always #1.", Type.ALTERNATE, 100000, false),
    new Unlock(Key.ALT_BOXRED, "Red Box", "Same old blip, shiney new color.", Type.ALTERNATE, 25000, false),
    new Unlock(Key.ALT_CRATEORANGE, "Orange Crate", "Same old blip, shiney new color.", Type.ALTERNATE, 25000, false),
    new Unlock(Key.ALT_VOXELGREEN, "Green Voxel", "Same old blip, shiney new color.", Type.ALTERNATE, 25000, false),
    new Unlock(Key.ALT_BLOCKROUND, "Curvy Block", "At least 7 polygons probably.", Type.ALTERNATE, 50000, false),
    new Unlock(Key.ALT_QUADFIRE, "Bad Quad", "Exactly the same character but really bad.", Type.ALTERNATE, 50000, false),
          
    new Unlock(Key.FT_COLOR, "Custom Colors", "Allows you to change the color of your character. Also allows you to create phasing colors.", Type.FEATURE, 50000, false),
    new Unlock(Key.FT_SOUND, "Custom Sounds", "Allows you to upload and and use a custom sound effect. Plays when you come in 1st place.", Type.FEATURE, 99999999, false)
  );
  
  public static List<Unlock> getUnlockList() {
    return UNLOCKS;
  }
  
  public static Unlock getUnlock(final Key key) {
    for(int i=0;i<UNLOCKS.size();i++) {
      final Unlock u = UNLOCKS.get(i);
      if(u.key == key) { return u; }
    }
    return null;
  }
  
  public static class Unlock {
    public final Key key;
    public final String name, description;
    public final Type type;
    public final int price;
    public final boolean hidden;
    public Unlock(Key key, String name, String description, Type type, int price, boolean hidden) {
      this.key = key;
      this.name = name; this.description = description; this.type = type;
      this.price = price;
      this.hidden = hidden;
    }
  }
  
  public final String uid;
  public final Timestamp updated;
  private final Map<Key, Boolean> unlocks;
  public UserUnlocks(final Map<String, Object> data) {
    unlocks = new HashMap();
    uid = (String)data.remove("uid");
    updated = (Timestamp)data.remove("updated");
   
    /* Uses reflection to map SQL databse names to enums that identify the unlocks */
    try {
      final String[] ks = data.keySet().toArray(new String[0]);
      for(int i=0;i<ks.length;i++) {
        final Field en = Key.class.getField(ks[i]);
        unlocks.put((Key)en.get(null), (boolean)data.get(ks[i]));
      }
    }
    catch(NoSuchFieldException | IllegalAccessException ex) {
      System.err.println("UserUnlocks::new - Error parsing unlock data from database.");
      ex.printStackTrace();
    }
  }
  
  public boolean has(Key key) {
    final Boolean r = unlocks.get(key);
    return r != null ? r : false;
  }
  
  public void unlock(Key key) {
    unlocks.put(key, true);
  }
}
