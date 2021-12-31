"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */

/* Define PlayerCrate Class */
function PlayerCrate(game, oid, pos, team, color) {
  PlayerObject.call(this, game, oid, pos, 0, team, color);
  
  this.model = this.game.display.getModel("character.crate.crate");
  this.material = this.game.display.getMaterial("character.crate.crate");
  this.icon = this.game.display.getMaterial("character.crate.ui.iconsmall");

  /* Settings */
  this.radius = 0.5; this.weight = 1.1; this.friction = 0.725;
  this.moveSpeed = 0.0375; this.jumpHeight = 0.175; this.cullRadius = 1.0;
  
  /* State */

  /* Timers */
  this.channelTimer = 0;
  this.blipCooldown = 0;
  this.dashCooldown = 0;

  /* UI */
  this.uiMeters = [
    {type: "bar", iconMat: this.game.display.getMaterial("character.generic.ui.metera"), length: 16, scalar: 1.0},
    {type: "bar", iconMat: this.game.display.getMaterial("character.generic.ui.meterb"), length: 14, scalar: 1.0}
  ];
};

/* Constants */
PlayerCrate.BLIP_POWER_MAX = 30;
PlayerCrate.BLIP_REFUND_POWER = 5;
PlayerCrate.DASH_COOLDOWN_LENGTH = 45;
PlayerCrate.CHARGE_TIME_LENGTH = 20;
PlayerCrate.FIRE_COLOR_A = util.vec4.make(1.0, 0.956, 0.490, 1.0);
PlayerCrate.FIRE_COLOR_B = util.vec4.make(1.0, 0.654, 0.286, 1.0);
PlayerCrate.FIRE_COLOR_C = util.vec4.make(1.0, 0.462, 0.223, 1.0);


PlayerCrate.prototype.update = PlayerObject.prototype.update;
PlayerCrate.prototype.parseUpd = PlayerObject.prototype.parseUpd;

PlayerCrate.prototype.effectSwitch = function(e) {
  switch(e) {
    case "atk" : { this.blip(); break; }
    case "mov" : { this.dash(); break; }
    case "chr" : { this.charge(); break; }
    case "rfd" : { this.blipCooldown -= PlayerCrate.BLIP_REFUND_POWER; return true; } /* @TODO: inline to save time */
    default : { return PlayerObject.prototype.effectSwitch.call(this, e); }
  }
};

PlayerCrate.prototype.timers = function() {
  if(this.blipCooldown > 0) { this.blipCooldown--; }
  if(this.dashCooldown > 0) { this.dashCooldown--; }
  if(this.channelTimer > 0) { this.channelTimer--; }
};

PlayerCrate.prototype.ui = function() {
  this.uiMeters[0].scalar = 1-(this.blipCooldown/PlayerCrate.BLIP_POWER_MAX);
  this.uiMeters[1].scalar = this.channelTimer>0?(this.channelTimer/PlayerCrate.CHARGE_TIME_LENGTH):(1-(this.dashCooldown/(PlayerCrate.DASH_COOLDOWN_LENGTH-PlayerCrate.CHARGE_TIME_LENGTH)));
};

PlayerCrate.prototype.air  = PlayerObject.prototype.air;
PlayerCrate.prototype.jump = PlayerObject.prototype.jump;
PlayerCrate.prototype.recover = PlayerObject.prototype.recover;
PlayerCrate.prototype.recoverJump = PlayerObject.prototype.recoverJump;
PlayerCrate.prototype.land = PlayerObject.prototype.land;

PlayerCrate.prototype.stun = function() {
  PlayerObject.prototype.stun.call(this);
  if(this.chargEffect) { this.chargeEffect.destory(); this.chargeEffect = undefined; }
  this.channelTimer = 0;
  this.dashCooldown = 0;
};

PlayerCrate.prototype.stunGeneric = PlayerObject.prototype.stunGeneric;
PlayerCrate.prototype.stunSlash = PlayerObject.prototype.stunSlash;
PlayerCrate.prototype.stunElectric = PlayerObject.prototype.stunElectric;
PlayerCrate.prototype.stunFire = PlayerObject.prototype.stunFire;
PlayerCrate.prototype.criticalHit = PlayerObject.prototype.criticalHit;
PlayerCrate.prototype.explode = PlayerObject.prototype.explode;
PlayerCrate.prototype.fall = PlayerObject.prototype.fall;
PlayerCrate.prototype.toss = PlayerObject.prototype.toss;
PlayerCrate.prototype.pickup = PlayerObject.prototype.pickup;

PlayerCrate.prototype.blip = function() {
  this.effects.push(NxFx.box.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerCrate.BLIP_POWER_MAX;
};

PlayerCrate.prototype.dash = function() {
  this.effects.push(NxFx.crate.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  if(this.chargeEffect && this.chargeEffect.particles[0]) { this.chargeEffect.particles[0].attachment = false; }
};


PlayerCrate.prototype.charge = function() {
  this.chargeEffect = NxFx.crate.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.channelTimer = PlayerCrate.CHARGE_TIME_LENGTH;
  this.dashCooldown = PlayerCrate.DASH_COOLDOWN_LENGTH;
};

PlayerCrate.prototype.taunt = function() {

};

PlayerCrate.prototype.setPos = PlayerObject.prototype.setPos;
PlayerCrate.prototype.setVel = PlayerObject.prototype.setVel;
PlayerCrate.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerCrate.prototype.setLook = PlayerObject.prototype.setLook;
PlayerCrate.prototype.setSpeed = PlayerObject.prototype.setSpeed;

PlayerCrate.prototype.getColor = PlayerObject.prototype.getColor;
PlayerCrate.prototype.getDraw = PlayerObject.prototype.getDraw;

PlayerCrate.prototype.destroy = PlayerObject.prototype.destroy;

PlayerCrate.prototype.type = function() { return "crt"; };

/* Permutation dictionary */

/* global PlayerCrateVoice */
/* global PlayerCrateRainbow */
/* global PlayerCrateGold */
/* global PlayerCrateOrange */
/* global PlayerCrateBlack */
/* global PlayerCrateDelta */
PlayerCrate.classByPermutation = function(perm) {
  switch(perm) {
    case 1 : { return PlayerCrateVoice; }
    case 2 : { return PlayerCrateOrange; }
    case 3 : { return PlayerCrateRainbow; }
    case 4 : { return PlayerCrateGold; }
    case 5 : { return PlayerCrateDelta; }
    case 7 : { return PlayerCrateBlack; }
    default : { return PlayerCrate; }
  }
};