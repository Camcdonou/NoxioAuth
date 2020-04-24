"use strict";
/* global main */

function Announcer(game) {
  this.game = game;
  this.announcements = [];
}

  /* Annouce Codes;
    mk,# :: Multikill <# 2 to 18>
    sp,# :: Spree     <# 5, 10, 15, 20, 25, 30>
    oc,@ :: Out of control <@ name of killer> 
    kj   :: Killjoy
    er,@,&  :: Ended Reign  <@ name of player> <& name of killed>
    fb,@ :: First Blood <@ name of player>
    gl   :: Gained the lead
    ll   :: Lost the lead
    btd  :: Betrayed   
    btl  :: Betrayl
    dm   :: Deathmatch
    em   :: Elimination
    kh   :: King
    rab  :: Rabbit
    tag  :: Tag
    tkh  :: Team King
    ult  :: Ultimate Lifeform
    tdm  :: Team Deathmatch
    tem  :: Team Elimination
    ctf  :: Capture the Flag
    fsf  :: Freestyle Flag
    ass  :: Assault
    cst  :: Custom Game
    khm  :: Hill Moved
    nu   :: New Ultimate Lifeform
    pow  :: Your Power Is Maximum
    it   :: You Are It
    lms  :: Last Man Standing
    fc   :: Flag Captured
    fl   :: Flag Lost
    ff   :: Flag Reset
    fr   :: Flag Return
    fs   :: Flag Stolen
    ft   :: Flag Taken
    off  :: Offense
    def  :: Defense
    rnd  :: Round Over
    t60  :: 1 Minute Remaining
    t30  :: 30 Seconds Reamining
    t10  :: 10 Seconds Remaining
    pf   :: Perfect
    hu   :: Humiliation
    go   :: Game Over
  */
Announcer.prototype.announce = function(code) {
  var parent = this;
  var longShort = function(path, msg, inv) { 
    parent.announcements.push(parent.game.sound.getSound(path, 0.175, 0.0, "announcer"));
    if(msg) { parent.game.ui.announce.addLine(msg, inv); }
  };
  
  var spl = code.split(",");
  switch(spl[0]) {
    case "mk" : {
      switch(spl[1]) {
        case "2" : { longShort("announcer/mk2.wav", "Double Kill!", true); break; }
        case "3" : { longShort("announcer/mk3.wav", "Triple Kill!", true); break; }
        case "4" : { longShort("announcer/mk4.wav", "Quadra Kill!", true); break; }
        case "5" : { longShort("announcer/mk5.wav", "Ultra Kill!", true); break; }
        case "6" : { longShort("announcer/mk6.wav", "Mega Kill!", true); break; }
        case "7" : { longShort("announcer/mk7.wav", "Giga Kill!", true); break; }
        case "8" : { longShort("announcer/mk8.wav", "Killamity!", true); break; }
        case "9" : { longShort("announcer/mk9.wav", "Killtrocity!", true); break; }
        case "10" : { longShort("announcer/mk10.wav", "Killtastrophe!", true); break; }
        case "11" : { longShort("announcer/mk11.wav", "Killpocalypse!", true); break; }
        case "12" : { longShort("announcer/mk12.wav", "Killsplosion!", true); break; }
        case "13" : { longShort("announcer/mk13.wav", "Killnado!", true); break; }
        case "14" : { longShort("announcer/mk14.wav", "Killcumcision!", true); break; }
        case "15" : { longShort("announcer/mk15.wav", "Kill... Uh...", true); break; }
        case "16" : { longShort("announcer/mk16.wav", "Please Stop...", true); break; }
        case "17" : { longShort("announcer/mk17.wav", "Think of the Children!", true); break; }
        case "18" : { longShort("announcer/mk18.wav", "You Monster!", true); break; }
        default : { main.menu.warning.show("Unknown announcer code: " + code); break; }
      }
      break;
    }
    case "sp" : {
        switch(spl[1]) {
          case "5" : { longShort("announcer/ks5.wav", "Rampage!", true); break; }
          case "10" : { longShort("announcer/ks10.wav", "Untouchable!", true); break; }
          case "15" : { longShort("announcer/ks15.wav", "Impossible!", true); break; }
          case "20" : { longShort("announcer/ks20.wav", "Invincible!", true); break; }
          case "25" : { longShort("announcer/ks25.wav", "Inconceivable!", true); break; }
          case "30" : { longShort("announcer/ks30.wav", "Godlike!", true); break; }
          default : { main.menu.warning.show("Unknown announcer code: " + code); break; }
        }
        break;
    }
    case "oc" : {
      longShort("announcer/stop.wav", "(" + spl[1] + ") is out of control!", false);
      break;
    }
    case "er" : {
      longShort("announcer/reign.wav", "(" + spl[1] + ") has ended the reign of terror of (" + spl[2] + ")", false);
      break;
    }
    case "fb" : {
      longShort("announcer/firstblood.wav", "First Blood (" + spl[1] + ")", false);
      break;
    }
    case "dm"  : { longShort("announcer/dm.wav", "Deathmatch", false); break; }
    case "em"  : { longShort("announcer/em.wav", "Elimination", false); break; }
    case "kh"  : { longShort("announcer/kh.wav", "King of the Hill", false); break; }
    case "ult"  : { longShort("announcer/ult.wav", "Ultimate Lifeform", false); break; }
    case "rab"  : { longShort("announcer/rab.wav", "Rabbit", false); break; }
    case "tag"  : { longShort("announcer/tag.wav", "Tag", false); break; }
    case "tdm" : { longShort("announcer/tdm.wav", "Team Deathmatch", false); break; }
    case "tem" : { longShort("announcer/tem.wav", "Team Elimination", false); break; }
    case "tkh"  : { longShort("announcer/tkh.wav", "Team King", false); break; }
    case "ctf" : { longShort("announcer/ctf.wav", "Capture the Flag", false); break; }
    case "fsf" : { longShort("announcer/fsf.wav", "Freestyle Flag", false); break; }
    case "ass" : { longShort("announcer/ass.wav", "Assault", false); break; }
    case "cst" : { longShort("announcer/cst.wav", "Custom Game", false); break; }
    
    case "kj"  : { longShort("announcer/killjoy.wav", "Killjoy!", false); break; }
    case "gl" : { longShort("announcer/gainlead.wav"); break; }
    case "ll" : { longShort("announcer/lostlead.wav"); break; }
    case "btd" : { longShort("announcer/betrayed.wav"); break; }
    case "btl" : { longShort("announcer/betrayal.wav"); break; }
    case "khm"  : { longShort("announcer/hillmove.wav", "Hill Moved", false); break; }
    case "nu"  : { longShort("announcer/newultimate.wav", "New Ultimate Lifeform", false); break; }
    case "pow"  : { longShort("announcer/power.wav", "Your Power Is Maximum", true); break; }
    case "it"  : { longShort("announcer/it.wav", "You Are It", true); break; }
    case "lms"  : { longShort("announcer/lastman.wav", "Last Man Standing", true); break; }
    
    case "off"  : { longShort("announcer/offense.wav", "Offense", false); break; }
    case "def" : { longShort("announcer/defense.wav", "Defense", false); break; }
    case "rnd"  : { longShort("announcer/round.wav", "Round Over", false); break; }
    
    case "fc"  : { longShort("announcer/flagcaptured.wav", "Your Team Scored", true); break; }
    case "fl" : { longShort("announcer/flaglost.wav", "Enemy Team Scored", true); break; }
    case "ff" : { longShort("announcer/flagreset.wav"); break; }
    case "fr"  : { longShort("announcer/flagreturn.wav"); break; }
    case "fs" : { longShort("announcer/flagstolen.wav"); break; }
    case "ft" : { longShort("announcer/flagtaken.wav"); break; }
    
    case "t60" : { longShort("announcer/oneminute.wav", "1 Minute Remaining", false); break; }
    case "t30" : { longShort("announcer/thirtyseconds.wav", "30 Seconds Remaining", false); break; }
    case "t10" : { longShort("announcer/tenseconds.wav", "10 Seconds Remaining", false); break; }
    
    case "pf" : { longShort("announcer/perfect.wav", "Perfection!", true); break; }
    case "hu"  : { longShort("announcer/humiliation.wav", "Humiliation!", true); break; }
    case "go"  : { longShort("announcer/gameover.wav"); break; }
    default : { main.menu.warning.show("Unknown announcer code: " + code); break; }
  }
};

Announcer.prototype.step = function() {
  if(this.announcements.length > 0) {
    if(!this.announcements[0].played) { this.announcements[0].play(); }
    if(!this.announcements[0].playing) { this.announcements.shift(); }
  }
};