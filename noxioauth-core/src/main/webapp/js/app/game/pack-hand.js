"use strict";
/* global main */
/* global util */
/* global Function */
/* global PlayerFox, PlayerFalco, PlayerShiek, PlayerMarth, PlayerPuff, PlayerInferno, PlayerCaptain */

/* Define Game Packet Handler Class */
function PackHand(game) {
  this.game = game;
}

/* PacketG10 */
PackHand.prototype.gameDataUpdate = function(packet) {
  var data = packet.data.split(";");
  while(data.length>1) {
    var field = data.shift();
    switch(field) {
      /* NoxioGame::GenerateUpdatePackets() */
      case "crt" : { this.createObject(data); break; }
      case "del" : { this.deleteObject(data); break; }
      case "scr" : { this.scores(data); break; }
      case "msg" : { this.message(data); break; }
      case "snd" : { this.loadCustomSoundFile(data); break; }
      case "tim" : { this.setTimer(data); break; }
      case "end" : { this.gameOver(data); break; }
      case "tck" : { this.tick(data); break; }
      case "anc" : { this.announce(data); break; }
      /* Controller::GenerateUpdateData() */
      case "obj" : { this.updateObject(data); break; }
      case "hid" : { this.hideObject(data);   break; }
      case "ctl" : { this.control(data); break; }
      case "rst" : { this.respawnTimer(data); break; }
      case "rnd" : { this.roundInfo(data); break; }
      case "frc" : { this.forceRespawn(data); break; }
      case "wsp" : { this.whisper(data); break; }
      case "crd" : { this.credits(data); break; }
      default : { main.menu.warning.show("Game data parsing interupted unexpectedly on '" + field + "' with " + data.length + " fields remaining."); break; }
    }
  }
  
};

/* OBJ::CREATE | crt */
PackHand.prototype.createObject = function(data) {
  var oid = parseInt(data.shift());
  var type = data.shift();
  var pos = util.vec2.parse(data.shift());
  var permutation = parseInt(data.shift());
  var team = parseInt(data.shift());
  var color = parseInt(data.shift());
  
  var obj = this.game.getObject(oid);
  if(obj !== undefined) { main.menu.warning.show("Desync: Tried to create OBJ that already exists '" + oid + "::" + type + "'."); return; }
  
  /* If user has alt characters or custom colors disabled when we switch the value to 0 */
  if(main.settings.toggle.disableAlts) { permutation = 0; }
  if(main.settings.toggle.disableColor) { color = 0; }
  
  var objs = this.game.objects;
  switch(type) {
    /* Player Classes :: These use permutation dictionaries */
    case "box" : { objs.push(new (Function.prototype.bind.apply(PlayerFox.classByPermutation(permutation),[null, this.game, oid, pos, team, color]))); break; }
    case "crt" : { objs.push(new (Function.prototype.bind.apply(PlayerFalco.classByPermutation(permutation),[null, this.game, oid, pos, team, color]))); break; }
    case "qua" : { objs.push(new (Function.prototype.bind.apply(PlayerMarth.classByPermutation(permutation),[null, this.game, oid, pos, team, color]))); break; }
    case "vox" : { objs.push(new (Function.prototype.bind.apply(PlayerShiek.classByPermutation(permutation),[null, this.game, oid, pos, team, color]))); break; }
    case "blk" : { objs.push(new (Function.prototype.bind.apply(PlayerPuff.classByPermutation(permutation),[null, this.game, oid, pos, team, color]))); break; }
    case "crg" : { objs.push(new (Function.prototype.bind.apply(PlayerCaptain.classByPermutation(permutation),[null, this.game, oid, pos, team, color]))); break; }
    case "inf" : { objs.push(new (Function.prototype.bind.apply(PlayerInferno.classByPermutation(permutation),[null, this.game, oid, pos, team, color]))); break; }
    /* Gameplay Object Classes :: These do not use permutation dictionaries */
    case "flg" : { this.game.objects.push(new FlagObject(this.game, oid, pos, permutation, team, color)); break; }
    case "hil" : { this.game.objects.push(new HillObject(this.game, oid, pos, permutation, team, color)); break; }
    case "flz" : { this.game.objects.push(new FlagZoneObject(this.game, oid, pos, permutation, team, color)); break; }
    case "zon" : { this.game.objects.push(new ZoneObject(this.game, oid, pos, permutation, team, color)); break; }
    case "bmb" : { this.game.objects.push(new BombObject(this.game, oid, pos, permutation, team, color)); break; }
    default : { main.menu.error.showErrorException("Game Exception", "Recieved object creation for '" + type + "' which does not exist.", JSON.stringify(data)); main.close(); break; }
  }
};

/* OBJ::DELETE | del */
PackHand.prototype.deleteObject = function(data) {
  var oid = parseInt(data.shift());
  var pos = util.vec2.parse(data.shift());
  
  var obj = this.game.getObject(oid);
  if(obj) { obj.setPos(pos); }
  if(!this.game.deleteObject(oid)) { main.menu.warning.show("Desync: Tried to delete OBJ that does not exist '" + oid + "'."); }
};

/* SYS::SCORE | scr */
PackHand.prototype.scores = function(data) {
  var teamScs = data.shift().split(",");
  
  var name = data.shift().split(",");
  var team = data.shift().split(",");
  var kill = data.shift().split(",");
  var death = data.shift().split(",");
  var objective = data.shift().split(",");
  
  var scs = [];
  for(var i=0;i<name.length;i++) {
    scs.push({name: name[i], team: parseInt(team[i]), kill: parseInt(kill[i]), death: parseInt(death[i]), objective: parseInt(objective[i])});
  }
  
  this.game.ui.score.setScores(teamScs, scs);
};

/* SYS::MESSAGE | msg */
PackHand.prototype.message = function(data) {
  var msg = data.shift();
  this.game.ui.log.addMessage(msg);
};

/* SYS::LOADSND | snd */
PackHand.prototype.loadCustomSoundFile = function(data) {
  var sound = data.shift();
  if(sound) { this.game.sound.createCustomSound(sound); }
};

/* SYS::TIMER | tim */
PackHand.prototype.setTimer = function(data) {
  var title = data.shift();
  var time = parseInt(data.shift());
  
  if(time < 0) { this.game.ui.objective.clearTimer(); }
  else { this.game.ui.objective.setTimer(title, time); }
};

/* SYS::GAMEOVER | end */
PackHand.prototype.gameOver = function(data) {
  var head = data.shift();
  var foot = data.shift();
  var sound = data.shift();
  
  this.game.ui.end.setTexts(head, foot);
  if(sound) { this.game.sound.getSound(sound, 0.5, 0.0, "music").play(); }
  this.game.gameOver = true;
};

/* DBG::TICK | tck */
PackHand.prototype.tick = function(data) {
  var tick = new Number(data.shift());
  
  this.game.update(tick);
};

/* SYS::ANNOUNCE | anc */
PackHand.prototype.announce = function(data) {
  var code = data.shift();
  
  this.game.announcer.announce(code);
};

/* OBJ::UPDATE | obj */
PackHand.prototype.updateObject = function(data) {
  var oid = parseInt(data.shift());
  
  var obj = this.game.getObject(oid);
  if(obj !== undefined) { obj.hide = false; obj.update(data); }
  else { main.menu.warning.show("Desync: Tried to update OBJ that does not exist '" + oid + "'."); }
};

/* OBJ::HIDE | hid */
PackHand.prototype.hideObject = function(data) {
  var oid = parseInt(data.shift());
  
  var obj = this.game.getObject(oid);
  if(obj !== undefined) { obj.hide = true; }
  else { main.menu.warning.show("Desync: Tried to hide OBJ that does not exist '" + oid + "'."); }
};

/* PLY::CONTROL | ctl */
PackHand.prototype.control = function(data) {
  var oid = parseInt(data.shift());
  
  this.game.control = oid;
};

/* PLY::RSPWNTMR | rst */
PackHand.prototype.respawnTimer = function(data) {
  var timer = parseInt(data.shift());
  
  this.game.respawnTimer = timer;
};

/* PLY::RNDINFO | rnd */
PackHand.prototype.roundInfo = function(data) {
  var msg = data.shift();
  
  if(!msg) { this.game.ui.respawn.clearRound(); this.game.forceSpawn = true; }
  else { this.game.ui.respawn.setRound(msg); }
  
};

/* GAM::FORCERSP | frc */
PackHand.prototype.forceRespawn = function(data) {
  this.game.forceSpawn = true;
};

/* SYS::WHISPER | wsp */
PackHand.prototype.whisper = function(data) {
  var msg = data.shift();
  this.game.ui.log.addMessage(msg);
};

/* SYS::ADDCRED | crd */
PackHand.prototype.credits = function(data) {
  var crds = parseInt(data.shift());
  var ssfxid = parseInt(data.shift());
  this.game.ui.credit.add(crds, ssfxid);
  main.stats.credits += crds;
};