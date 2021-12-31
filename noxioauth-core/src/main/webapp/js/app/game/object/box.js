"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */

/* Define PlayerBox Class */
function PlayerBox(game, oid, pos, team, color) {
  PlayerObject.call(this, game, oid, pos, 0, team, color);
  
  this.model = this.game.display.getModel("character.box.box");
  this.material = this.game.display.getMaterial("character.box.box");
  this.icon = this.game.display.getMaterial("character.box.ui.iconsmall");
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.725;
  this.moveSpeed = 0.0375; this.jumpHeight = 0.175; this.cullRadius = 1.0;
  
  /* State */

  /* Timers */
  this.blipCooldown = 0;
  this.dashCooldown = 0;
  
  /* UI */
  this.uiMeters = [
    {type: "bar", iconMat: this.game.display.getMaterial("character.generic.ui.metera"), length: 16, scalar: 1.0},
    {type: "bar", iconMat: this.game.display.getMaterial("character.generic.ui.meterb"), length: 14, scalar: 1.0}
  ];
};

/* Constants */
PlayerBox.BLIP_POWER_MAX = 35;
PlayerBox.BLIP_REFUND_POWER = 5;
PlayerBox.DASH_POWER_ADD = 35;
PlayerBox.DASH_POWER_MAX = 60;
PlayerBox.BLIP_COLOR_A = util.vec4.lerp(util.vec4.make(0.6666, 0.9058, 1.0, 1.0), util.vec4.make(1,1,1,1), 0.5);
PlayerBox.BLIP_COLOR_B = util.vec4.make(0.4, 0.5450, 1.0, 1.0);

PlayerBox.prototype.update = PlayerObject.prototype.update;
PlayerBox.prototype.parseUpd = PlayerObject.prototype.parseUpd;

PlayerBox.prototype.effectSwitch = function(e) {
  switch(e) {
    case "atk" : { this.blip(); return true; }
    case "mov" : { this.dash(); return true; }
    case "rfd" : { this.blipCooldown -= PlayerBox.BLIP_REFUND_POWER; return true; } /* @TODO: inline to save time */
    default : { return PlayerObject.prototype.effectSwitch.call(this, e); }
  }
};

PlayerBox.prototype.timers = function() {
  if(this.blipCooldown > 0) { this.blipCooldown--; }
  if(this.dashCooldown > 0) { this.dashCooldown--; }
};

PlayerBox.prototype.ui = function() {
  this.uiMeters[0].scalar = 1.0-(this.blipCooldown/PlayerBox.BLIP_POWER_MAX);
  this.uiMeters[1].scalar = Math.max(0, 1.0-(this.dashCooldown/PlayerBox.DASH_POWER_MAX));
};

PlayerBox.prototype.air  = PlayerObject.prototype.air;
PlayerBox.prototype.jump = PlayerObject.prototype.jump;
PlayerBox.prototype.recover = PlayerObject.prototype.recover;
PlayerBox.prototype.recoverJump = PlayerObject.prototype.recoverJump;
PlayerBox.prototype.land = PlayerObject.prototype.land;

PlayerBox.prototype.stun = PlayerObject.prototype.stun;
PlayerBox.prototype.stunGeneric = PlayerObject.prototype.stunGeneric;
PlayerBox.prototype.stunSlash = PlayerObject.prototype.stunSlash;
PlayerBox.prototype.stunElectric = PlayerObject.prototype.stunElectric;
PlayerBox.prototype.stunFire = PlayerObject.prototype.stunFire;
PlayerBox.prototype.criticalHit = PlayerObject.prototype.criticalHit;
PlayerBox.prototype.explode = PlayerObject.prototype.explode;
PlayerBox.prototype.fall = PlayerObject.prototype.fall;
PlayerBox.prototype.toss = PlayerObject.prototype.toss;
PlayerBox.prototype.pickup = PlayerObject.prototype.pickup;

PlayerBox.prototype.blip = function() {
  this.effects.push(NxFx.box.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerBox.BLIP_POWER_MAX;
};

PlayerBox.prototype.dash = function() {
  this.effects.push(NxFx.box.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.dashCooldown += PlayerBox.DASH_POWER_ADD;
};

PlayerBox.prototype.taunt = function() {
  
};

PlayerBox.prototype.setPos = PlayerObject.prototype.setPos;
PlayerBox.prototype.setVel = PlayerObject.prototype.setVel;
PlayerBox.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerBox.prototype.setLook = PlayerObject.prototype.setLook;
PlayerBox.prototype.setSpeed = PlayerObject.prototype.setSpeed;

PlayerBox.prototype.getColor = PlayerObject.prototype.getColor;
PlayerBox.prototype.getDraw = PlayerObject.prototype.getDraw;

PlayerBox.prototype.destroy = PlayerObject.prototype.destroy;

PlayerBox.prototype.type = function() { return "box"; };

/* Permutation dictionary */

/* global PlayerBoxVoice */
/* global PlayerBoxRed */
/* global PlayerBoxRainbow */
/* global PlayerBoxGold */
/* global PlayerBoxDelta */
/* global PlayerBoxFour */
/* global PlayerBoxHit */
PlayerBox.classByPermutation = function(perm) {
  switch(perm) {
    case 1 : { return PlayerBoxVoice; }
    case 2 : { return PlayerBoxRed; }
    case 3 : { return PlayerBoxRainbow; }
    case 4 : { return PlayerBoxGold; }
    case 5 : { return PlayerBoxDelta; }
    case 6 : { return PlayerBoxHit; }
    case 7 : { return PlayerBoxFour; }
    default : { return PlayerBox; }
  }
};