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
    tdm  :: Team Deathmatch
    ctf  :: Capture the Flag
    bs   :: Blue Team Score
    rs   :: Red Team Score
    bft  :: Blue Team Flag Taken
    bfr  :: Blue Team Flag Return
    rft  :: Red Team Flag Taken
    rfr  :: Red Team Flag Return
    1m   :: 1 Minute Remaining
    pf   :: Perfect
    go   :: Game Over
*/
Announcer.prototype.announce = function(code) {
  var longShort = function(path, msg) { 
    this.announcements.push(this.game.sound.getSound(path, 1.0));
  };
  
  var spl = code.split(",");
  switch(spl[0]) {
    case "mk" : {
        switch(spl[1]) {
          case "2" : { longShort("announcer/doublekill.wav"); break; }
          default : { main.menu.warning.show("Unknown announcer code: " + code); break; }
        }
        break;
    }
    case "sp" : {
        switch(spl[1]) {
          case "5" : { longShort("announcer/killingspree.wav"); break; }
          default : { main.menu.warning.show("Unknown announcer code: " + code); break; }
        }
        break;
    }
    case "kj"  : { longShort("announcer/killjoy.wav"); break; }
    case "btd" : { longShort("announcer/betrayed.wav"); break; }
    case "btl" : { longShort("announcer/betrayal.wav"); break; }
    case "rs"  : { longShort("announcer/redscore.wav"); break; }
    case "rft" : { longShort("announcer/bluehasflag.wav"); break; }
    case "rfr" : { longShort("announcer/redflagreturn.wav"); break; }
    case "bs"  : { longShort("announcer/bluescore.wav"); break; }
    case "bft" : { longShort("announcer/redhasflag.wav"); break; }
    case "bfr" : { longShort("announcer/blueflagreturn.wav"); break; }
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