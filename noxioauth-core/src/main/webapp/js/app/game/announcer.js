"use strict";
/* global main */

function Announcer(game) {
  this.game = game;
  this.announcements = [];
}

/* Annouce Codes (copied from NoxioGame.java);
    mk,# :: Multikill <# 0 to 9>
    sp,# :: Spree     <# 5, 10, 15, 20, 25>
    oc,@ :: Out of control <@ name of killer> 
    kj   :: Killjoy
    er,@,&  :: Ended Reign  <@ name of player> <& name of killed>
    fb,@ :: First Blood <@ name of player>
    gl   :: Gained the lead
    ll   :: Lost the lead
    btd  :: Betrayed   
    btl  :: Betrayl
    dm   :: Deathmatch
    kh   :: King
    tkh  :: Team King
    ulf  :: Ultimate Lifeform
    tdm  :: Team Deathmatch
    ctf  :: Capture the Flag
    khm  :: Hill Moved
    hc   :: New Ultimate Lifeform
    bs   :: Blue Team Score
    rs   :: Red Team Score
    bft  :: Blue Team Flag Taken
    bfr  :: Blue Team Flag Return
    rft  :: Red Team Flag Taken
    rfr  :: Red Team Flag Return
    1m   :: 1 Minute Remaining
    pf   :: Perfect
    hu   :: Humiliation
    go   :: Game Over
  */
Announcer.prototype.announce = function(code) {
  var parent = this;
  var longShort = function(path, msg, inv) { 
    parent.announcements.push(parent.game.sound.getSound(path, 1.0));
    if(msg) { parent.game.ui.announce.addLine(msg, inv); }
  };
  
  var spl = code.split(",");
  switch(spl[0]) {
    case "mk" : {
      switch(spl[1]) {
        case "2" : { longShort("announcer/mk2.wav", "Double Kill!", true); break; }
        case "3" : { longShort("announcer/mk3.wav", "Triple Kill!", true); break; }
        case "4" : { longShort("announcer/mk4.wav", "Overkill!", true); break; }
        case "5" : { longShort("announcer/mk5.wav", "Killtacular!", true); break; }
        case "6" : { longShort("announcer/mk6.wav", "Text Go Here", true); break; }
        case "7" : { longShort("announcer/mk7.wav", "Text Go Here", true); break; }
        case "8" : { longShort("announcer/mk8.wav", "Text Go Here", true); break; }
        case "9" : { longShort("announcer/mk9.wav", "Text Go Here", true); break; }
        default : { main.menu.warning.show("Unknown announcer code: " + code); break; }
      }
      break;
    }
    case "sp" : {
        switch(spl[1]) {
          case "5" : { longShort("announcer/ks5.wav", "Killing Spree!", true); break; }
          case "10" : { longShort("announcer/ks10.wav", "Running Riot!", true); break; }
          case "15" : { longShort("announcer/ks15.wav", "Unstoppable!", true); break; }
          case "20" : { longShort("announcer/ks20.wav", "Untouchable!", true); break; }
          case "25" : { longShort("announcer/ks25.wav", "Invincible!", true); break; }
          default : { main.menu.warning.show("Unknown announcer code: " + code); break; }
        }
        break;
    }
    case "oc" : {
      longShort("announcer/outofcontrol.wav", "(" + spl[1] + ") is out of control!", false);
      break;
    }
    case "er" : {
      longShort("announcer/endedreign.wav", "(" + spl[1] + ") has ended the reign of terror of (" + spl[2] + ")", false);
      break;
    }
    case "fb" : {
      longShort("announcer/firstblood.wav", "First Blood (" + spl[1] + ")", false);
      break;
    }
    case "dm"  : { longShort("announcer/dm.wav", "Deathmatch", false); break; }
    case "kh"  : { longShort("announcer/kh.wav", "Deathmatch", false); break; }
    case "tkh"  : { longShort("announcer/tkh.wav", "Deathmatch", false); break; }
    case "ulf"  : { longShort("announcer/ulf.wav", "Deathmatch", false); break; }
    case "tdm" : { longShort("announcer/tdm.wav", "Team Deathmatch", false); break; }
    case "ctf" : { longShort("announcer/ctf.wav", "Capture the Flag", false); break; }
    case "kj"  : { longShort("announcer/killjoy.wav", "Killjoy!", true); break; }
    case "gl" : { longShort("announcer/gainlead.wav"); break; }
    case "ll" : { longShort("announcer/lostlead.wav"); break; }
    case "btd" : { longShort("announcer/betrayed.wav"); break; }
    case "btl" : { longShort("announcer/betrayal.wav"); break; }
    case "khm"  : { longShort("announcer/hillmoved.wav", "Hill Moved", false); break; }
    case "hc"  : { longShort("announcer/newultimate.wav", "You are the Ultimate Lifeform!", true); break; }
    case "rs"  : { longShort("announcer/redscore.wav", "Red Team Scored!", false); break; }
    case "rft" : { longShort("announcer/bluehasflag.wav"); break; }
    case "rfr" : { longShort("announcer/redflagreturn.wav"); break; }
    case "bs"  : { longShort("announcer/bluescore.wav", "Blue Team Scored!", false); break; }
    case "bft" : { longShort("announcer/redhasflag.wav"); break; }
    case "bfr" : { longShort("announcer/blueflagreturn.wav"); break; }
    case "1m" : { longShort("announcer/1minute.wav", "1 Minute Remaining", false); break; }
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