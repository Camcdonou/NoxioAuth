"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */

/* Define PlayerCube Class */
function PlayerCube(game, oid, pos, team, color) {
  PlayerObject.call(this, game, oid, pos, 0, team, color);
  
  this.model = this.game.display.getModel("character.generic.generic");
  this.material = this.game.display.getMaterial("character.cube.cube");
  this.icon = this.game.display.getMaterial("character.cube.ui.iconsmall");
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.735;
  this.moveSpeed = 0.0380; this.jumpHeight = 0.175; this.cullRadius = 1.0;
  
  /* State */
  this.bombs = [];

  /* Timers */
  this.blipCooldown = 0;
  this.bombCooldown = 0;

  /* UI */
  this.uiMeters = [
    {type: "bar", iconMat: this.game.display.getMaterial("character.generic.ui.metera"), length: 16, scalar: 1.0},
    {type: "bar", iconMat: this.game.display.getMaterial("character.generic.ui.meterb"), length: 14, scalar: 0.0}
  ];
};

/* Constants */
PlayerCube.BLIP_POWER_MAX = 30;
PlayerCube.BLIP_REFUND_POWER = 5;
PlayerCube.BLIP_POWER_MAX = 30;
PlayerCube.BOMB_POWER_COST = 50;
PlayerCube.BOMB_POWER_MAX = 100;
PlayerCube.BOMB_FUSE_LENGTH = 65;
PlayerCube.BOMB_SHORTEN = 35;

PlayerCube.prototype.update = function(data) {
  PlayerObject.prototype.update.call(this, data);
};

PlayerCube.prototype.parseUpd = PlayerObject.prototype.parseUpd;

PlayerCube.prototype.effectSwitch = function(e) {
  switch(e) {
    case "atk" : { this.blip(); break; }
    case "bmb" : { this.bomb(); break; }
    case "rfd" : { this.blipCooldown -= PlayerCube.BLIP_REFUND_POWER; return true; } /* @TODO: inline to save time */
    default : { return PlayerObject.prototype.effectSwitch.call(this, e); }
  }
};

PlayerCube.prototype.timers = function() {
  if(this.blipCooldown > 0) { this.blipCooldown--; }
  if(this.bombCooldown > 0) { this.bombCooldown--; }
  
  for(var i=0;i<this.bombs.length;i++) {
    var b = this.bombs[i];
    if(--b.time <= 0) {
      this.bombs.splice(i, 1);
      i--;
      this.detonate(b);
    }
  }
};

PlayerCube.prototype.ui = function() {
  this.uiMeters[0].scalar = 1.0-(this.blipCooldown/PlayerCube.BLIP_POWER_MAX);
  this.uiMeters[1].scalar = 1.0-(this.bombCooldown/PlayerCube.BOMB_POWER_MAX);
};

PlayerCube.prototype.air  = PlayerObject.prototype.air;
PlayerCube.prototype.jump = PlayerObject.prototype.jump;
PlayerCube.prototype.recover = PlayerObject.prototype.recover;
PlayerCube.prototype.recoverJump = PlayerObject.prototype.recoverJump;
PlayerCube.prototype.land = PlayerObject.prototype.land;

PlayerCube.prototype.stun = PlayerObject.prototype.stun;

PlayerCube.prototype.stunGeneric = PlayerObject.prototype.stunGeneric;
PlayerCube.prototype.stunSlash = PlayerObject.prototype.stunSlash;
PlayerCube.prototype.stunElectric = PlayerObject.prototype.stunElectric;
PlayerCube.prototype.stunFire = PlayerObject.prototype.stunFire;
PlayerCube.prototype.criticalHit = PlayerObject.prototype.criticalHit;
PlayerCube.prototype.explode = PlayerObject.prototype.explode;
PlayerCube.prototype.fall = PlayerObject.prototype.fall;
PlayerCube.prototype.toss = PlayerObject.prototype.toss;
PlayerCube.prototype.pickup = PlayerObject.prototype.pickup;

PlayerCube.prototype.blip = function() {
  this.effects.push(NxFx.box.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerCube.BLIP_POWER_MAX;
};

PlayerCube.prototype.bomb = function() {
  this.effects.push(NxFx.cube.charge.trigger(this.game, util.vec2.toVec3(this.pos, 0), util.vec2.toVec3(util.vec2.create(), 0)));
  this.bombCooldown += PlayerCube.BOMB_POWER_COST;
  this.bombs.push({pos: this.pos, time: PlayerCube.BOMB_FUSE_LENGTH});
};

PlayerCube.prototype.detonate = function(bomb) {
  var det = NxFx.cube.detonate.trigger(this.game, util.vec2.toVec3(bomb.pos, 0), util.vec2.toVec3(util.vec2.create(), 0));
  this.game.putEffect(det);
};

PlayerCube.prototype.taunt = function() {
  this.effects.push(NxFx.cube.shorten.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  for(var i=0;i<this.bombs.length;i++) {
    this.bombs[i].time = Math.max(0, this.bombs[i].time-PlayerCube.BOMB_SHORTEN);
  }
};

PlayerCube.prototype.setPos = PlayerObject.prototype.setPos;
PlayerCube.prototype.setVel = PlayerObject.prototype.setVel;
PlayerCube.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerCube.prototype.setLook = PlayerObject.prototype.setLook;
PlayerCube.prototype.setSpeed = PlayerObject.prototype.setSpeed;

PlayerCube.prototype.getColor = PlayerObject.prototype.getColor;
PlayerCube.prototype.getDraw = PlayerObject.prototype.getDraw;

PlayerCube.prototype.destroy = PlayerObject.prototype.destroy;

PlayerCube.prototype.type = function() { return "cub"; };

/* Permutation dictionary */

/* global PlayerCubeVoice */
/* global PlayerCubeRainbow */
/* global PlayerCubeGold */
/* global PlayerCubeGreen */
/* global PlayerCubeBlack */
/* global PlayerCubeDelta */
PlayerCube.classByPermutation = function(perm) {
  switch(perm) {
    default : { return PlayerCube; }
  }
};