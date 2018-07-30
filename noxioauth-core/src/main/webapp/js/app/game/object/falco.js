"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */

/* Define PlayerFalco Class */
function PlayerFalco(game, oid, pos, team, color) {
  PlayerObject.call(this, game, oid, pos, 0, team, color);
  
  this.model = this.game.display.getModel("character.falco.falco");
  this.material = this.game.display.getMaterial("character.falco.falco");
  this.icon = this.game.display.getMaterial("character.falco.ui.iconlarge");

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
    {type: "bar", iconMat: this.game.display.getMaterial("character.falco.ui.meterblip"), length: 16, scalar: 1.0},
    {type: "bar", iconMat: this.game.display.getMaterial("character.falco.ui.meterdash"), length: 14, scalar: 1.0}
  ];
};

/* Constants */
PlayerFalco.BLIP_POWER_MAX = 30;
PlayerFalco.DASH_COOLDOWN_LENGTH = 45;
PlayerFalco.CHARGE_TIME_LENGTH = 20;
PlayerFalco.FIRE_COLOR_A = util.vec4.make(1.0, 0.956, 0.490, 1.0);
PlayerFalco.FIRE_COLOR_B = util.vec4.make(1.0, 0.654, 0.286, 1.0);
PlayerFalco.FIRE_COLOR_C = util.vec4.make(1.0, 0.462, 0.223, 1.0);


PlayerFalco.prototype.update = PlayerObject.prototype.update;
PlayerFalco.prototype.parseUpd = PlayerObject.prototype.parseUpd;

PlayerFalco.prototype.effectSwitch = function(e) {
  switch(e) {
    case "atk" : { this.blip(); break; }
    case "mov" : { this.dash(); break; }
    case "chr" : { this.charge(); break; }
    default : { return PlayerObject.prototype.effectSwitch.call(this, e); }
  }
};

PlayerFalco.prototype.timers = function() {
  if(this.blipCooldown > 0) { this.blipCooldown--; }
  if(this.dashCooldown > 0) { this.dashCooldown--; }
  if(this.channelTimer > 0) { this.channelTimer--; }
};

PlayerFalco.prototype.ui = function() {
  this.uiMeters[0].scalar = 1-(this.blipCooldown/PlayerFalco.BLIP_POWER_MAX);
  this.uiMeters[1].scalar = this.channelTimer>0?(this.channelTimer/PlayerFalco.CHARGE_TIME_LENGTH):(1-(this.dashCooldown/(PlayerFalco.DASH_COOLDOWN_LENGTH-PlayerFalco.CHARGE_TIME_LENGTH)));
};

PlayerFalco.prototype.air  = PlayerObject.prototype.air;
PlayerFalco.prototype.jump = PlayerObject.prototype.jump;
PlayerFalco.prototype.land = PlayerObject.prototype.land;

PlayerFalco.prototype.stun = function() {
  PlayerObject.prototype.stun.call(this);
  if(this.chargEffect) { this.chargeEffect.destory(); this.chargeEffect = undefined; }
  this.channelTimer = 0;
  this.dashCooldown = 0;
};

PlayerFalco.prototype.stunGeneric = PlayerObject.prototype.stunGeneric;
PlayerFalco.prototype.stunSlash = PlayerObject.prototype.stunSlash;
PlayerFalco.prototype.stunElectric = PlayerObject.prototype.stunElectric;
PlayerFalco.prototype.stunFire = PlayerObject.prototype.stunFire;
PlayerFalco.prototype.criticalHit = PlayerObject.prototype.criticalHit;
PlayerFalco.prototype.explode = PlayerObject.prototype.explode;
PlayerFalco.prototype.fall = PlayerObject.prototype.fall;

PlayerFalco.prototype.blip = function() {
  this.effects.push(NxFx.fox.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerFalco.BLIP_POWER_MAX;
};

PlayerFalco.prototype.dash = function() {
  this.effects.push(NxFx.falco.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  if(this.chargeEffect && this.chargeEffect.particles[0]) { this.chargeEffect.particles[0].attachment = false; }
};


PlayerFalco.prototype.charge = function() {
  this.chargeEffect = NxFx.falco.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.channelTimer = PlayerFalco.CHARGE_TIME_LENGTH;
  this.dashCooldown = PlayerFalco.DASH_COOLDOWN_LENGTH;
};

PlayerFalco.prototype.taunt = function() {

};

PlayerFalco.prototype.setPos = PlayerObject.prototype.setPos;
PlayerFalco.prototype.setVel = PlayerObject.prototype.setVel;
PlayerFalco.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerFalco.prototype.setLook = PlayerObject.prototype.setLook;
PlayerFalco.prototype.setSpeed = PlayerObject.prototype.setSpeed;
PlayerFalco.prototype.getDraw = PlayerObject.prototype.getDraw;

PlayerFalco.prototype.destroy = PlayerObject.prototype.destroy;

PlayerFalco.prototype.type = function() { return "crt"; };

/* Permutation dictionary */

/* global PlayerFalcoRainbow */
/* global PlayerFalcoGold */
/* global PlayerFalcoOrange */
/* global PlayerFalcoBlack */
PlayerFalco.classByPermutation = function(perm) {
  switch(perm) {
    case 2 : { return PlayerFalcoOrange; }
    case 3 : { return PlayerFalcoRainbow; }
    case 4 : { return PlayerFalcoGold; }
    case 6 : { return PlayerFalcoBlack; }
    default : { return PlayerFalco; }
  }
};