"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerBlock */

/* Define PlayerBlockWindow Class */
function PlayerBlockWindow(game, oid, pos, team, color) {
  PlayerBlock.call(this, game, oid, pos, team, color);
};

PlayerBlockWindow.prototype.update = PlayerBlock.prototype.update;
PlayerBlockWindow.prototype.parseUpd = PlayerBlock.prototype.parseUpd;
PlayerBlockWindow.prototype.effectSwitch = PlayerBlock.prototype.effectSwitch;
PlayerBlockWindow.prototype.timers = PlayerBlock.prototype.timers;
PlayerBlockWindow.prototype.ui = PlayerBlock.prototype.ui;

PlayerBlockWindow.prototype.air  = PlayerBlock.prototype.air;
PlayerBlockWindow.prototype.jump = PlayerBlock.prototype.jump;
PlayerBlockWindow.prototype.land = PlayerBlock.prototype.land;
PlayerBlockWindow.prototype.toss = PlayerObject.prototype.toss;
PlayerBlockWindow.prototype.pickup = PlayerObject.prototype.pickup;

PlayerBlockWindow.prototype.stun = function() {
  PlayerBlock.prototype.stun.call(this);
  this.restEffect = NxFx.block.alt.window.hit.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
};

PlayerBlockWindow.prototype.stunGeneric = PlayerBlock.prototype.stunGeneric;
PlayerBlockWindow.prototype.stunSlash = PlayerBlock.prototype.stunSlash;
PlayerBlockWindow.prototype.stunElectric = PlayerBlock.prototype.stunElectric;
PlayerBlockWindow.prototype.stunFire = PlayerBlock.prototype.stunFire;

PlayerBlockWindow.prototype.criticalHit = function() {
  PlayerBlock.prototype.explode.call(this);
  this.effects.push(NxFx.block.alt.window.hit.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerBlockWindow.prototype.explode = function() {
  PlayerBlock.prototype.explode.call(this);
  var deathSound = NxFx.block.alt.window.die.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.game.putEffect(deathSound);
};

PlayerBlockWindow.prototype.fall = function() {
  PlayerBlock.prototype.fall.call(this);
  this.effects.push(NxFx.block.alt.window.die.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerBlockWindow.prototype.rest = function() {
  this.restEffect = NxFx.block.alt.window.rest.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.restEffect);
  this.effects.push(NxFx.block.alt.window.wave.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec3.make(0, 0, 0)));
  this.restCooldown = PlayerBlock.REST_SLEEP_LENGTH;
};

PlayerBlockWindow.prototype.restHit = PlayerBlock.prototype.restHit;

PlayerBlockWindow.prototype.wake = function() {
  this.effects.push(NxFx.block.alt.window.wake.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerBlockWindow.prototype.poundChannel = function() {
  this.poundCooldown = PlayerBlock.POUND_COOLDOWN_LENGTH;
  this.chargeEffect = NxFx.block.alt.window.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
};

PlayerBlockWindow.prototype.poundDash = function() {
  this.effects.push(NxFx.block.alt.window.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.poundDirection = this.look;
};

PlayerBlockWindow.prototype.pound = function() {
  this.effects.push(NxFx.block.alt.window.wave.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(util.vec2.scale(this.poundDirection, PlayerBlock.POUND_OFFSET*2.), 0.1)));
};

PlayerBlockWindow.prototype.poundHit = function() {
  this.effects.push(NxFx.block.alt.window.slap.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(util.vec2.scale(this.poundDirection, PlayerBlock.POUND_OFFSET*2.), 0.1)));
};

PlayerBlockWindow.prototype.taunt = PlayerBlock.prototype.taunt;

PlayerBlockWindow.prototype.setPos = PlayerBlock.prototype.setPos;
PlayerBlockWindow.prototype.setVel = PlayerBlock.prototype.setVel;
PlayerBlockWindow.prototype.setHeight = PlayerBlock.prototype.setHeight;

PlayerBlockWindow.prototype.setLook = PlayerBlock.prototype.setLook;
PlayerBlockWindow.prototype.setSpeed = PlayerBlock.prototype.setSpeed;

PlayerBlockWindow.prototype.getColor = PlayerObject.prototype.getColor;
PlayerBlockWindow.prototype.getDraw = PlayerBlock.prototype.getDraw;

PlayerBlockWindow.prototype.destroy = PlayerBlock.prototype.destroy;

PlayerBlockWindow.prototype.type = PlayerBlock.prototype.type;
