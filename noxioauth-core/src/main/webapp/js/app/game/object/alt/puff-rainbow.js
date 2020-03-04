"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerPuff */

/* Define PlayerPuffRainbow Class */
function PlayerPuffRainbow(game, oid, pos, team, color) {
  PlayerPuff.call(this, game, oid, pos, team, color);
};

PlayerPuffRainbow.prototype.update = PlayerPuff.prototype.update;
PlayerPuffRainbow.prototype.parseUpd = PlayerPuff.prototype.parseUpd;
PlayerPuffRainbow.prototype.effectSwitch = PlayerPuff.prototype.effectSwitch;
PlayerPuffRainbow.prototype.timers = PlayerPuff.prototype.timers;
PlayerPuffRainbow.prototype.ui = PlayerPuff.prototype.ui;

PlayerPuffRainbow.prototype.air  = PlayerPuff.prototype.air;
PlayerPuffRainbow.prototype.jump = PlayerPuff.prototype.jump;
PlayerPuffRainbow.prototype.land = PlayerPuff.prototype.land;

PlayerPuffRainbow.prototype.stun = PlayerPuff.prototype.stun;

PlayerPuffRainbow.prototype.stunGeneric = PlayerPuff.prototype.stunGeneric;
PlayerPuffRainbow.prototype.stunSlash = PlayerPuff.prototype.stunSlash;
PlayerPuffRainbow.prototype.stunElectric = PlayerPuff.prototype.stunElectric;
PlayerPuffRainbow.prototype.stunFire = PlayerPuff.prototype.stunFire;
PlayerPuffRainbow.prototype.criticalHit = PlayerPuff.prototype.criticalHit;
PlayerPuffRainbow.prototype.explode = PlayerPuff.prototype.explode;
PlayerPuffRainbow.prototype.fall = PlayerPuff.prototype.fall;

PlayerPuffRainbow.prototype.rest = function() {
  this.restEffect = NxFx.puff.alt.rainbow.rest.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.restEffect);
  this.effects.push(NxFx.puff.alt.gold.wave.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec3.make(0, 0, 0)));
  this.restCooldown = PlayerPuff.REST_SLEEP_LENGTH;
};

PlayerPuffRainbow.prototype.wake = function() {
  this.effects.push(NxFx.puff.alt.rainbow.wake.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerPuffRainbow.prototype.poundChannel = function() {
  this.poundCooldown = PlayerPuff.POUND_COOLDOWN_LENGTH;
  this.chargeEffect = NxFx.puff.alt.rainbow.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
};

PlayerPuffRainbow.prototype.poundDash = function() {
  this.effects.push(NxFx.puff.alt.rainbow.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.poundDirection = this.look;
};

PlayerPuffRainbow.prototype.pound = function() {
  this.effects.push(NxFx.puff.alt.rainbow.wave.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(util.vec2.scale(this.poundDirection, PlayerPuff.POUND_OFFSET*2.), 0.1)));
};

PlayerPuffRainbow.prototype.poundHit = function() {
  this.effects.push(NxFx.puff.alt.rainbow.slap.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(util.vec2.scale(this.poundDirection, PlayerPuff.POUND_OFFSET*2.), 0.1)));
};

PlayerPuffRainbow.prototype.taunt = PlayerPuff.prototype.taunt;

PlayerPuffRainbow.prototype.setPos = PlayerPuff.prototype.setPos;
PlayerPuffRainbow.prototype.setVel = PlayerPuff.prototype.setVel;
PlayerPuffRainbow.prototype.setHeight = PlayerPuff.prototype.setHeight;

PlayerPuffRainbow.prototype.setLook = PlayerPuff.prototype.setLook;
PlayerPuffRainbow.prototype.setSpeed = PlayerPuff.prototype.setSpeed;

PlayerPuffRainbow.prototype.getColor = PlayerObject.prototype.getColor;
PlayerPuffRainbow.prototype.getDraw = PlayerPuff.prototype.getDraw;

PlayerPuffRainbow.prototype.destroy = PlayerPuff.prototype.destroy;

PlayerPuffRainbow.prototype.type = PlayerPuff.prototype.type;
