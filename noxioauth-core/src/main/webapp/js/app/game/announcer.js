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
    btl  :: Betrayal
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
    rts  :: Red Team Score (BALL)
    bts  :: Blue Team Score (BALL)
    brs  :: Ball Reset (BALL)
    spb  :: Sports Ball (BALL)
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
        case "2" : { longShort("announcer/mk2.mp3", "Double Kill!", true); break; }
        case "3" : { longShort("announcer/mk3.mp3", "Triple Kill!", true); break; }
        case "4" : { longShort("announcer/mk4.mp3", "Quadra Kill!", true); break; }
        case "5" : { longShort("announcer/mk5.mp3", "Ultra Kill!", true); break; }
        case "6" : { longShort("announcer/mk6.mp3", "Mega Kill!", true); break; }
        case "7" : { longShort("announcer/mk7.mp3", "Giga Kill!", true); break; }
        case "8" : { longShort("announcer/mk8.mp3", "Killamity!", true); break; }
        case "9" : { longShort("announcer/mk9.mp3", "Killtrocity!", true); break; }
        case "10" : { longShort("announcer/mk10.mp3", "Killtastrophe!", true); break; }
        case "11" : { longShort("announcer/mk11.mp3", "Killpocalypse!", true); break; }
        case "12" : { longShort("announcer/mk12.mp3", "Killsplosion!", true); break; }
        case "13" : { longShort("announcer/mk13.mp3", "Killnado!", true); break; }
        case "14" : { longShort("announcer/mk14.mp3", "Killcumcision!", true); break; }
        case "15" : { longShort("announcer/mk15.mp3", "Kill... Uh...", true); break; }
        case "16" : { longShort("announcer/mk16.mp3", "Please Stop...", true); break; }
        case "17" : { longShort("announcer/mk17.mp3", "Think of the Children!", true); break; }
        case "18" : { longShort("announcer/mk18.mp3", "You Monster!", true); break; }
        default : { main.menu.warning.show("Unknown announcer code: " + code); break; }
      }
      break;
    }
    case "sp" : {
        switch(spl[1]) {
          case "5" : { longShort("announcer/ks5.mp3", "Rampage!", true); break; }
          case "10" : { longShort("announcer/ks10.mp3", "Untouchable!", true); break; }
          case "15" : { longShort("announcer/ks15.mp3", "Impossible!", true); break; }
          case "20" : { longShort("announcer/ks20.mp3", "Invincible!", true); break; }
          case "25" : { longShort("announcer/ks25.mp3", "Inconceivable!", true); break; }
          case "30" : { longShort("announcer/ks30.mp3", "Godlike!", true); break; }
          default : { main.menu.warning.show("Unknown announcer code: " + code); break; }
        }
        break;
    }
    case "oc" : {
      longShort("announcer/stop.mp3", "(" + spl[1] + ") is out of control!", false);
      break;
    }
    case "er" : {
      longShort("announcer/reign.mp3", "(" + spl[1] + ") has ended the reign of terror of (" + spl[2] + ")", false);
      break;
    }
    case "fb" : {
      longShort("announcer/firstblood.mp3", "First Blood (" + spl[1] + ")", false);
      break;
    }
    case "dm"  : { longShort("announcer/dm.mp3", "Deathmatch", false); break; }
    case "em"  : { longShort("announcer/em.mp3", "Elimination", false); break; }
    case "kh"  : { longShort("announcer/kh.mp3", "King of the Hill", false); break; }
    case "ult"  : { longShort("announcer/ult.mp3", "Ultimate Lifeform", false); break; }
    case "rab"  : { longShort("announcer/rab.mp3", "Rabbit", false); break; }
    case "tag"  : { longShort("announcer/tag.mp3", "Tag", false); break; }
    case "tdm" : { longShort("announcer/tdm.mp3", "Team Deathmatch", false); break; }
    case "tem" : { longShort("announcer/tem.mp3", "Team Elimination", false); break; }
    case "tkh"  : { longShort("announcer/tkh.mp3", "Team King", false); break; }
    case "ctf" : { longShort("announcer/ctf.mp3", "Capture the Flag", false); break; }
    case "fsf" : { longShort("announcer/fsf.mp3", "Freestyle Flag", false); break; }
    case "ass" : { longShort("announcer/ass.mp3", "Assault", false); break; }
    case "cst" : { longShort("announcer/cst.mp3", "Custom Game", false); break; }
    
    case "kj"  : { longShort("announcer/killjoy.mp3", "Killjoy!", false); break; }
    case "gl" : { longShort("announcer/gainlead.mp3"); break; }
    case "ll" : { longShort("announcer/lostlead.mp3"); break; }
    case "btd" : { longShort("announcer/betrayed.mp3"); break; }
    case "btl" : { longShort("announcer/betrayal.mp3"); break; }
    case "khm"  : { longShort("announcer/hillmove.mp3", "Hill Moved", false); break; }
    case "nu"  : { longShort("announcer/newultimate.mp3", "New Ultimate Lifeform", false); break; }
    case "pow"  : { longShort("announcer/power.mp3", "Your Power Is Maximum", true); break; }
    case "it"  : { longShort("announcer/it.mp3", "You Are It", true); break; }
    case "lms"  : { longShort("announcer/lastman.mp3", "Last Man Standing", true); break; }
    
    case "off"  : { longShort("announcer/offense.mp3", "Offense", false); break; }
    case "def" : { longShort("announcer/defense.mp3", "Defense", false); break; }
    case "rnd"  : { longShort("announcer/round.mp3", "Round Over", false); break; }
    
    case "fc"  : { longShort("announcer/flagcaptured.mp3", "Your Team Scored", true); break; }
    case "fl" : { longShort("announcer/flaglost.mp3", "Enemy Team Scored", true); break; }
    case "ff" : { longShort("announcer/flagreset.mp3"); break; }
    case "fr"  : { longShort("announcer/flagreturn.mp3"); break; }
    case "fs" : { longShort("announcer/flagstolen.mp3"); break; }
    case "ft" : { longShort("announcer/flagtaken.mp3"); break; }
    
    case "rts" : { longShort("announcer/ballred.mp3", "Red Team Scored"); break; }
    case "bts"  : { longShort("announcer/ballblue.mp3", "Blue Team Scored"); break; }
    case "brs" : { longShort("announcer/ballreset.mp3"); break; }
    case "spb" : { longShort("announcer/sportsball.mp3", "Sports Ball"); break; }
    
    case "t60" : { longShort("announcer/oneminute.mp3", "1 Minute Remaining", false); break; }
    case "t30" : { longShort("announcer/thirtyseconds.mp3", "30 Seconds Remaining", false); break; }
    case "t10" : { longShort("announcer/tenseconds.mp3", "10 Seconds Remaining", false); break; }
    
    case "pf" : { longShort("announcer/perfect.mp3", "Perfection!", true); break; }
    case "hu"  : { longShort("announcer/humiliation.mp3", "Humiliation!", true); break; }
    case "go"  : { longShort("announcer/gameover.mp3"); break; }
    default : { main.menu.warning.show("Unknown announcer code: " + code); break; }
  }
};

Announcer.prototype.step = function() {
  if(this.announcements.length > 0) {
    if(!this.announcements[0].played) { this.announcements[0].play(); }
    if(!this.announcements[0].playing) { this.announcements.shift(); }
  }
};