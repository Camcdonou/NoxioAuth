"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerFoxRed */
/* global NxFx */

/* Define PlayerFox Class */
function PlayerFox(game, oid, pos, team, color) {
  PlayerObject.call(this, game, oid, pos, 0, team, color);
  
  this.model = this.game.display.getModel("character.fox.fox");
  this.material = this.game.display.getMaterial("character.fox.fox");
  this.icon = this.game.display.getMaterial("character.fox.ui.iconlarge");
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.725;
  this.moveSpeed = 0.0375; this.jumpHeight = 0.175; this.cullRadius = 1.0;
  
  /* State */

  /* Timers */
  this.blipCooldown = 0;
  this.dashCooldown = 0;
  
  /* UI */
  this.uiMeters = [
    {type: "bar", iconMat: this.game.display.getMaterial("character.fox.ui.meterblip"), length: 16, scalar: 1.0},
    {type: "bar", iconMat: this.game.display.getMaterial("character.fox.ui.meterdash"), length: 14, scalar: 1.0}
  ];
};

/* Constants */
PlayerFox.BLIP_POWER_MAX = 30;
PlayerFox.DASH_POWER_ADD = 30;
PlayerFox.DASH_POWER_MAX = 60;
PlayerFox.BLIP_COLOR_A = util.vec4.lerp(util.vec4.make(0.6666, 0.9058, 1.0, 1.0), util.vec4.make(1,1,1,1), 0.5);
PlayerFox.BLIP_COLOR_B = util.vec4.make(0.4, 0.5450, 1.0, 1.0);

PlayerFox.prototype.update = PlayerObject.prototype.update;
PlayerFox.prototype.parseUpd = PlayerObject.prototype.parseUpd;

PlayerFox.prototype.effectSwitch = function(e) {
  switch(e) {
    case "atk" : { this.blip(); return true; }
    case "mov" : { this.dash(); return true; }
    default : { return PlayerObject.prototype.effectSwitch.call(this, e); }
  }
};

PlayerFox.prototype.timers = function() {
  if(this.blipCooldown > 0) { this.blipCooldown--; }
  if(this.dashCooldown > 0) { this.dashCooldown--; }
};

PlayerFox.prototype.ui = function() {
  this.uiMeters[0].scalar = 1.0-(this.blipCooldown/PlayerFox.BLIP_POWER_MAX);
  this.uiMeters[1].scalar = Math.max(0, 1.0-(this.dashCooldown/PlayerFox.DASH_POWER_MAX));
};

PlayerFox.prototype.air  = PlayerObject.prototype.air;
PlayerFox.prototype.jump = PlayerObject.prototype.jump;
PlayerFox.prototype.land = PlayerObject.prototype.land;

PlayerFox.prototype.stun = PlayerObject.prototype.stun;
PlayerFox.prototype.stunGeneric = PlayerObject.prototype.stunGeneric;
PlayerFox.prototype.stunSlash = PlayerObject.prototype.stunSlash;
PlayerFox.prototype.stunElectric = PlayerObject.prototype.stunElectric;
PlayerFox.prototype.stunFire = PlayerObject.prototype.stunFire;
PlayerFox.prototype.criticalHit = PlayerObject.prototype.criticalHit;
PlayerFox.prototype.explode = PlayerObject.prototype.explode;
PlayerFox.prototype.fall = PlayerObject.prototype.fall;

PlayerFox.prototype.blip = function() {
  this.effects.push(NxFx.fox.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerFox.BLIP_POWER_MAX;
};

PlayerFox.prototype.dash = function() {
  this.effects.push(NxFx.fox.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.dashCooldown += PlayerFox.DASH_POWER_ADD;
};

PlayerFox.prototype.taunt = function() {
  
};

PlayerFox.prototype.setPos = PlayerObject.prototype.setPos;
PlayerFox.prototype.setVel = PlayerObject.prototype.setVel;
PlayerFox.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerFox.prototype.setLook = PlayerObject.prototype.setLook;
PlayerFox.prototype.setSpeed = PlayerObject.prototype.setSpeed;
PlayerFox.prototype.getDraw = PlayerObject.prototype.getDraw;

PlayerFox.prototype.destroy = PlayerObject.prototype.destroy;

PlayerFox.prototype.type = function() { return "box"; };

/* Permutation dictionary */
PlayerFox.classByPermutation = function(perm) {
  switch(perm) {
    case 1 : { return PlayerFoxRed; }
    default : { return PlayerFox; }
  }
};