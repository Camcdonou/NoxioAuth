"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerPuff */

/* Define PlayerPuffWindow Class */
function PlayerPuffWindow(game, oid, pos, team, color) {
  PlayerPuff.call(this, game, oid, pos, team, color);
};

PlayerPuffWindow.prototype.update = PlayerPuff.prototype.update;
PlayerPuffWindow.prototype.parseUpd = PlayerPuff.prototype.parseUpd;
PlayerPuffWindow.prototype.effectSwitch = PlayerPuff.prototype.effectSwitch;
PlayerPuffWindow.prototype.timers = PlayerPuff.prototype.timers;
PlayerPuffWindow.prototype.ui = PlayerPuff.prototype.ui;

PlayerPuffWindow.prototype.air  = PlayerPuff.prototype.air;
PlayerPuffWindow.prototype.jump = PlayerPuff.prototype.jump;
PlayerPuffWindow.prototype.land = PlayerPuff.prototype.land;

PlayerPuffWindow.prototype.stun = function() {
  PlayerPuff.prototype.stun.call(this);
  this.restEffect = NxFx.puff.alt.window.hit.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
};

PlayerPuffWindow.prototype.stunGeneric = PlayerPuff.prototype.stunGeneric;
PlayerPuffWindow.prototype.stunSlash = PlayerPuff.prototype.stunSlash;
PlayerPuffWindow.prototype.stunElectric = PlayerPuff.prototype.stunElectric;
PlayerPuffWindow.prototype.stunFire = PlayerPuff.prototype.stunFire;

PlayerPuffWindow.prototype.criticalHit = function() {
  this.effects.push(NxFx.hit.alt.critical.window.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerPuffWindow.prototype.explode = PlayerPuff.prototype.explode;
PlayerPuffWindow.prototype.fall = PlayerPuff.prototype.fall;

PlayerPuffWindow.prototype.rest = function() {
  this.restEffect = NxFx.puff.alt.window.rest.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.restEffect);
  this.effects.push(NxFx.puff.alt.window.wave.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec3.make(0, 0, 0)));
  this.restCooldown = PlayerPuff.REST_SLEEP_LENGTH;
};

PlayerPuffWindow.prototype.wake = function() {
  this.effects.push(NxFx.puff.alt.window.wake.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerPuffWindow.prototype.poundChannel = function() {
  this.poundCooldown = PlayerPuff.POUND_COOLDOWN_LENGTH;
  this.chargeEffect = NxFx.puff.alt.window.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
};

PlayerPuffWindow.prototype.poundDash = function() {
  this.effects.push(NxFx.puff.alt.window.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.poundDirection = this.look;
};

PlayerPuffWindow.prototype.pound = function() {
  this.effects.push(NxFx.puff.alt.window.wave.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(util.vec2.scale(this.poundDirection, PlayerPuff.POUND_OFFSET*2.), 0.1)));
};

PlayerPuffWindow.prototype.poundHit = function() {
  this.effects.push(NxFx.puff.alt.window.slap.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(util.vec2.scale(this.poundDirection, PlayerPuff.POUND_OFFSET*2.), 0.1)));
};

PlayerPuffWindow.prototype.taunt = PlayerPuff.prototype.taunt;

PlayerPuffWindow.prototype.setPos = PlayerPuff.prototype.setPos;
PlayerPuffWindow.prototype.setVel = PlayerPuff.prototype.setVel;
PlayerPuffWindow.prototype.setHeight = PlayerPuff.prototype.setHeight;

PlayerPuffWindow.prototype.setLook = PlayerPuff.prototype.setLook;
PlayerPuffWindow.prototype.setSpeed = PlayerPuff.prototype.setSpeed;

PlayerPuffWindow.prototype.getColor = PlayerObject.prototype.getColor;
PlayerPuffWindow.prototype.getDraw = PlayerPuff.prototype.getDraw;

PlayerPuffWindow.prototype.destroy = PlayerPuff.prototype.destroy;

PlayerPuffWindow.prototype.type = PlayerPuff.prototype.type;
