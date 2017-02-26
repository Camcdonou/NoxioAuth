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
      case "crt" : { this.createObject(data); break; }
      case "del" : { this.deleteObject(data); break; }
      case "obj" : { this.updateObject(data); break; }
      case "msg" : { this.message(data); break; }
      default : { main.menu.warning.show("Game data parsing interupted unexpectedly on '" + field + "' with " + data.length + " fields remaining."); break; }
    }
  }
  
};

/* OBJ::CREATE | crt */
PackHand.prototype.createObject = function(data) {
  var oid = parseInt(data.shift());
  var type = data.shift();
  var pos = util.parseVec2(data.shift());
  var vel = util.parseVec2(data.shift());
  
  var obj = this.game.getObject(oid);
  if(obj !== undefined) { main.menu.warning.show("Desync: Tried to create OBJ that already exists '" + oid + "::" + type + "'."); return; } 
  
  switch(type) {
    case "obj" : { main.menu.error.showErrorException("Game Exception", "Recieved object creation for abstract type '" + type + "'.", JSON.stringify(data)); main.close(); break; }
    case "obj.player" : { this.game.objects.push(new PlayerObject(this.game, oid, pos, vel)); break; }
    default : { main.menu.error.showErrorException("Game Exception", "Recieved object creation for '" + type + "' which does not exist.", JSON.stringify(data)); main.close(); break; }
  }
};

/* OBJ::DELETE | del */
PackHand.prototype.deleteObject = function(data) {
  var oid = parseInt(data.shift());
  
  if(!this.game.deleteObject(oid)) { main.menu.warning.show("Desync: Tried to delete OBJ that does not exist '" + oid + "'."); }
};

/* OBJ::UPDATE | obj */
PackHand.prototype.updateObject = function(data) {
  var oid = parseInt(data.shift());
  
  var obj = this.game.getObject(oid);
  if(obj !== undefined) { obj.update(data); }
  else { main.menu.warning.show("Desync: Tried to update OBJ that does not exist '" + oid + "'."); }
};

/* SYS::MESSAGE | msg */
PackHand.prototype.message = function(data) {
  
};

/* PacketI03 */
PackHand.prototype.playerControl = function(packet) {
  this.game.control = packet.oid;
};

/* PacketG16 */
PackHand.prototype.gameOver = function(packet) {
  this.game.gameOver = true;
  this.game.gameWinner = packet.player;
};

/* PacketG18 */
PackHand.prototype.gameRules = function(packet) {
  this.game.settings = {scoreToWin: packet.score};
};