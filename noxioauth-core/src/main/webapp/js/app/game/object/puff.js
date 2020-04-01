"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */

/* Define PlayerPuff Class */
function PlayerPuff(game, oid, pos, team, color) {
  PlayerObject.call(this, game, oid, pos, 0, team, color);
  
  this.model = this.game.display.getModel("character.generic.generic");
  this.material = this.game.display.getMaterial("character.puff.puff");
  this.icon = this.game.display.getMaterial("character.puff.ui.iconlarge");
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.725;
  this.moveSpeed = 0.0375; this.jumpHeight = 0.175; this.cullRadius = 1.0;
  
  /* State */
  this.poundDirection = util.vec2.make(1, 0);

  /* Timers */
  this.restCooldown = 0;
  this.poundCooldown = 0;

  /* UI */
  this.uiMeters = [
    {type: "bar", iconMat: this.game.display.getMaterial("character.puff.ui.meterrest"), length: 16, scalar: 1.0},
    {type: "bar", iconMat: this.game.display.getMaterial("character.puff.ui.meterpound"), length: 14, scalar: 1.0}
  ];
};

/* Constants */
PlayerPuff.REST_SLEEP_LENGTH = 99;
PlayerPuff.POUND_COOLDOWN_LENGTH = 30;
PlayerPuff.POUND_RADIUS = 0.45;
PlayerPuff.POUND_OFFSET = 0.33;
PlayerPuff.REST_LIGHT = util.vec4.make(1.0, 1.0, 1.0, 0.25);
PlayerPuff.COLORA = util.vec4.make(1.0, 1.0, 1.0, 1.0);
PlayerPuff.COLORB = util.vec4.make(1.0, 1.0, 1.0, 0.75);

PlayerPuff.prototype.update = PlayerObject.prototype.update;
PlayerPuff.prototype.parseUpd = PlayerObject.prototype.parseUpd;

PlayerPuff.prototype.effectSwitch = function(e) {
  switch(e) {
    case "atk" : { this.rest(); break; }
    case "wak" : { this.wake(); break; }
    case "mov" : { this.poundChannel(); break; }
    case "pnd" : { this.poundDash(); break; }
    case "pnh" : { this.pound(); break; }
    case "slp" : { this.poundHit(); break; }
    default : { return PlayerObject.prototype.effectSwitch.call(this, e); }
  }
};

PlayerPuff.prototype.timers = function() {
  if(this.restCooldown > 0) { this.restCooldown--; }
  if(this.poundCooldown > 0) { this.poundCooldown--; }
};

PlayerPuff.prototype.ui = function() {
  this.uiMeters[0].scalar = 1.0-(this.restCooldown/PlayerPuff.REST_SLEEP_LENGTH);
  this.uiMeters[1].scalar = 1.0-(this.poundCooldown/PlayerPuff.POUND_COOLDOWN_LENGTH);
};

PlayerPuff.prototype.air  = PlayerObject.prototype.air;
PlayerPuff.prototype.jump = PlayerObject.prototype.jump;
PlayerPuff.prototype.land = PlayerObject.prototype.land;

PlayerPuff.prototype.stun = function() {
  PlayerObject.prototype.stun.call(this);
  if(this.chargeEffect) { this.chargeEffect.destroy(); this.chargeEffect = undefined; }
  if(this.restEffect) { this.restEffect.destroy(); this.restEffect = undefined; }
  this.restCooldown = 0;
};

PlayerPuff.prototype.stunGeneric = PlayerObject.prototype.stunGeneric;
PlayerPuff.prototype.stunSlash = PlayerObject.prototype.stunSlash;
PlayerPuff.prototype.stunElectric = PlayerObject.prototype.stunElectric;
PlayerPuff.prototype.stunFire = PlayerObject.prototype.stunFire;
PlayerPuff.prototype.criticalHit = PlayerObject.prototype.criticalHit;
PlayerPuff.prototype.explode = PlayerObject.prototype.explode;
PlayerPuff.prototype.fall = PlayerObject.prototype.fall;
PlayerPuff.prototype.toss = PlayerObject.prototype.toss;
PlayerPuff.prototype.pickup = PlayerObject.prototype.pickup;

PlayerPuff.prototype.rest = function() {
  this.restEffect = NxFx.puff.rest.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.restEffect);
  this.effects.push(NxFx.puff.wave.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec3.make(0, 0, 0)));
  this.restCooldown = PlayerPuff.REST_SLEEP_LENGTH;
};

PlayerPuff.prototype.wake = function() {
  this.effects.push(NxFx.puff.wake.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerPuff.prototype.poundChannel = function() {
  this.poundCooldown = PlayerPuff.POUND_COOLDOWN_LENGTH;
  this.chargeEffect = NxFx.puff.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
};

PlayerPuff.prototype.poundDash = function() {
  this.effects.push(NxFx.puff.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.poundDirection = this.look;
};

PlayerPuff.prototype.pound = function() {
  this.effects.push(NxFx.puff.wave.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(util.vec2.scale(this.poundDirection, PlayerPuff.POUND_OFFSET*2.), 0.1)));
};

PlayerPuff.prototype.poundHit = function() {
  this.effects.push(NxFx.puff.slap.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(util.vec2.scale(this.poundDirection, PlayerPuff.POUND_OFFSET*2.), 0.1)));
};

PlayerPuff.prototype.taunt = function() {

};

PlayerPuff.prototype.setPos = PlayerObject.prototype.setPos;
PlayerPuff.prototype.setVel = PlayerObject.prototype.setVel;
PlayerPuff.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerPuff.prototype.setLook = PlayerObject.prototype.setLook;
PlayerPuff.prototype.setSpeed = PlayerObject.prototype.setSpeed;

PlayerPuff.prototype.getColor = PlayerObject.prototype.getColor;
PlayerPuff.prototype.getDraw = PlayerObject.prototype.getDraw;

PlayerPuff.prototype.destroy = PlayerObject.prototype.destroy;

PlayerPuff.prototype.type = function() { return "blk"; };

/* Permutation dictionary */
/* global PlayerPuffVoice */
/* global PlayerPuffGold */
/* global PlayerPuffRainbow */
/* global PlayerPuffDelta */
/* global PlayerPuffRound */
/* global PlayerPuffWindow */
PlayerPuff.classByPermutation = function(perm) {
  switch(perm) {
    case 1 : { return PlayerPuffVoice; }
    case 2 : { return PlayerPuffRainbow; }
    case 3 : { return PlayerPuffGold; }
    case 4 : { return PlayerPuffDelta; }
    case 5 : { return PlayerPuffRound; }
    case 6 : { return PlayerPuffWindow; }
    default : { return PlayerPuff; }
  }
};