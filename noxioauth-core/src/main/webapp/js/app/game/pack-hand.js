"use strict";
/* global main */
/* global util */

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
      case "end" : { this.gameOver(data); break; }
      case "tck" : { this.tick(data); break; }
      case "anc" : { this.announce(data); break; }
      /* Controller::GenerateUpdateData() */
      case "obj" : { this.updateObject(data); break; }
      case "hid" : { this.hideObject(data);   break; }
      case "ctl" : { this.control(data); break; }
      case "rst" : { this.respawnTimer(data); break; }
      case "wsp" : { this.whisper(data); break; }
      default : { main.menu.warning.show("Game data parsing interupted unexpectedly on '" + field + "' with " + data.length + " fields remaining."); break; }
    }
  }
  
};

/* OBJ::CREATE | crt */
PackHand.prototype.createObject = function(data) {
  var oid = parseInt(data.shift());
  var type = data.shift();
  var pos = util.vec2.parse(data.shift());
  var vel = util.vec2.parse(data.shift());
  
  var obj = this.game.getObject(oid);
  if(obj !== undefined) { main.menu.warning.show("Desync: Tried to create OBJ that already exists '" + oid + "::" + type + "'."); return; } 
  
  switch(type) {
    case "obj" : { main.menu.error.showErrorException("Game Exception", "Recieved object creation for abstract type '" + type + "'.", JSON.stringify(data)); main.close(); break; }
    case "obj.mobile" : { main.menu.error.showErrorException("Game Exception", "Recieved object creation for abstract type '" + type + "'.", JSON.stringify(data)); main.close(); break; }
    case "obj.mobile.player" : { main.menu.error.showErrorException("Game Exception", "Recieved object creation for abstract type '" + type + "'.", JSON.stringify(data)); main.close(); }
    case "obj.mobile.player.inferno" : { this.game.objects.push(new PlayerInferno(this.game, oid, pos, vel)); break; }
    case "obj.mobile.player.fox" : { this.game.objects.push(new PlayerFox(this.game, oid, pos, vel)); break; }
    case "obj.mobile.player.falco" : { this.game.objects.push(new PlayerFalco(this.game, oid, pos, vel)); break; }
    case "obj.mobile.player.marth" : { this.game.objects.push(new PlayerMarth(this.game, oid, pos, vel)); break; }
    case "obj.mobile.player.shiek" : { this.game.objects.push(new PlayerShiek(this.game, oid, pos, vel)); break; }
    case "obj.mobile.player.puff" : { this.game.objects.push(new PlayerPuff(this.game, oid, pos, vel)); break; }
    case "obj.mobile.player.captain" : { this.game.objects.push(new PlayerCaptain(this.game, oid, pos, vel)); break; }
    case "obj.mobile.flag" : { this.game.objects.push(new FlagObject(this.game, oid, pos, vel)); break; }
    case "obj.mobile.bomb" : { this.game.objects.push(new BombObject(this.game, oid, pos, vel)); break; }
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

/* SYS::GAMEOVER | end */
PackHand.prototype.gameOver = function(data) {
  var msg = data.shift();
  
  this.game.ui.end.setTexts(msg, "Bottom Text~");
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

/* SYS::WHISPER | wsp */
PackHand.prototype.whisper = function(data) {
  var msg = data.shift();
  this.game.ui.log.addMessage(msg);
};