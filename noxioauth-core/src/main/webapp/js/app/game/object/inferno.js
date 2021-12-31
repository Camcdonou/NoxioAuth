"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject, NxFx */

/* Define PlayerInferno Class */
function PlayerInferno(game, oid, pos, team, color) {
  PlayerObject.call(this, game, oid, pos, 0, team, color);
  
  this.model = this.game.display.getModel("character.generic.generic");
  this.material = this.game.display.getMaterial("character.inferno.inferno");
  this.icon = this.game.display.getMaterial("character.inferno.ui.iconsmall");
  
  /* Constants */
  this.GEN_COOLDOWN_LENGTH = 10;
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.725;
  this.moveSpeed = 0.0350; this.jumpHeight = 0.250; this.cullRadius = 1.0;
  
  /* State */

  /* Timers */
  this.genCooldown = 0;

  /* UI */
  this.uiMeters = [
    {type: "bar", iconMat: this.game.display.getMaterial("character.generic.ui.metera"), length: 16, scalar: 1.0}
  ];
};

PlayerInferno.GROWTH_RATE = 1.05;

PlayerInferno.prototype.update = PlayerObject.prototype.update;
PlayerInferno.prototype.parseUpd = PlayerObject.prototype.parseUpd;

PlayerInferno.prototype.effectSwitch = function(e) {
  switch(e) {
    case "atk" : { return true; }
    case "mov" : { return true; }
    case "scr" : { this.specialCrit(); return true; }
    case "gro" : { this.grow(); return true; }
    default : { return PlayerObject.prototype.effectSwitch.call(this, e); }
  }
};

PlayerInferno.prototype.timers = function() {
  if(this.genCooldown > 0) { this.genCooldown--; }
};

PlayerInferno.prototype.ui = function() {
  this.uiMeters[0].scalar = 1.0-(this.genCooldown/this.GEN_COOLDOWN_LENGTH);
};

PlayerInferno.prototype.ouch = function() {
  this.genCooldown = this.GEN_COOLDOWN_LENGTH;
};

PlayerInferno.prototype.specialCrit = function() {
  var crt = NxFx.hit.critical.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.game.putEffect(crt);
};

PlayerInferno.prototype.grow = function() {
  this.radius *= PlayerInferno.GROWTH_RATE;
  this.cullRadius *= PlayerInferno.GROWTH_RATE;
  this.scale *= PlayerInferno.GROWTH_RATE;
};

PlayerInferno.prototype.taunt = function() {
  this.effects.push(NxFx.inferno.taunt.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerInferno.prototype.air  = PlayerObject.prototype.air;
PlayerInferno.prototype.recover = PlayerObject.prototype.recover;
PlayerInferno.prototype.recoverJump = PlayerObject.prototype.recoverJump;
PlayerInferno.prototype.jump = function() {
  PlayerObject.prototype.jump.call(this);
  this.effects.push(NxFx.inferno.jump.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerInferno.prototype.land = PlayerObject.prototype.land;
PlayerInferno.prototype.toss = PlayerObject.prototype.toss;
PlayerInferno.prototype.pickup = PlayerObject.prototype.pickup;

PlayerInferno.prototype.stun = function() {
  PlayerObject.prototype.stun.call(this);
  this.effects.push(NxFx.inferno.hit.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerInferno.prototype.stunGeneric = PlayerObject.prototype.stunGeneric;
PlayerInferno.prototype.stunSlash = PlayerObject.prototype.stunSlash;
PlayerInferno.prototype.stunElectric = PlayerObject.prototype.stunElectric;
PlayerInferno.prototype.stunFire = PlayerObject.prototype.stunFire;
PlayerInferno.prototype.criticalHit = PlayerObject.prototype.criticalHit;

PlayerInferno.prototype.explode = function() {
  PlayerObject.prototype.explode.call(this);
  this.game.putEffect(NxFx.inferno.explode.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};
PlayerInferno.prototype.fall = function() {
  PlayerObject.prototype.fall.call(this);
  this.effects.push(NxFx.inferno.fall.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerInferno.prototype.setPos = PlayerObject.prototype.setPos;
PlayerInferno.prototype.setVel = PlayerObject.prototype.setVel;
PlayerInferno.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerInferno.prototype.setLook = PlayerObject.prototype.setLook;
PlayerInferno.prototype.setSpeed = PlayerObject.prototype.setSpeed;

PlayerInferno.prototype.getColor = PlayerObject.prototype.getColor;
PlayerInferno.prototype.getDraw = PlayerObject.prototype.getDraw;

PlayerInferno.prototype.destroy = PlayerObject.prototype.destroy;

PlayerInferno.prototype.type = function() { return "inf"; };

/* Permutation dictionary */
PlayerInferno.classByPermutation = function(perm) {
  switch(perm) {
    default : { return PlayerInferno; }      
  }
};