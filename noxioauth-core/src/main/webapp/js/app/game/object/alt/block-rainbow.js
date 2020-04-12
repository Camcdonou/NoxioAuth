"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerBlock */

/* Define PlayerBlockRainbow Class */
function PlayerBlockRainbow(game, oid, pos, team, color) {
  PlayerBlock.call(this, game, oid, pos, team, color);
};

PlayerBlockRainbow.prototype.update = PlayerBlock.prototype.update;
PlayerBlockRainbow.prototype.parseUpd = PlayerBlock.prototype.parseUpd;
PlayerBlockRainbow.prototype.effectSwitch = PlayerBlock.prototype.effectSwitch;
PlayerBlockRainbow.prototype.timers = PlayerBlock.prototype.timers;
PlayerBlockRainbow.prototype.ui = PlayerBlock.prototype.ui;

PlayerBlockRainbow.prototype.air  = PlayerBlock.prototype.air;
PlayerBlockRainbow.prototype.jump = PlayerBlock.prototype.jump;
PlayerBlockRainbow.prototype.land = PlayerBlock.prototype.land;
PlayerBlockRainbow.prototype.toss = PlayerObject.prototype.toss;
PlayerBlockRainbow.prototype.pickup = PlayerObject.prototype.pickup;

PlayerBlockRainbow.prototype.stun = PlayerBlock.prototype.stun;

PlayerBlockRainbow.prototype.stunGeneric = PlayerBlock.prototype.stunGeneric;
PlayerBlockRainbow.prototype.stunSlash = PlayerBlock.prototype.stunSlash;
PlayerBlockRainbow.prototype.stunElectric = PlayerBlock.prototype.stunElectric;
PlayerBlockRainbow.prototype.stunFire = PlayerBlock.prototype.stunFire;
PlayerBlockRainbow.prototype.criticalHit = PlayerBlock.prototype.criticalHit;
PlayerBlockRainbow.prototype.explode = PlayerBlock.prototype.explode;
PlayerBlockRainbow.prototype.fall = PlayerBlock.prototype.fall;

PlayerBlockRainbow.prototype.rest = function() {
  this.restEffect = NxFx.block.alt.rainbow.rest.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.restEffect);
  this.effects.push(NxFx.block.alt.gold.wave.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec3.make(0, 0, 0)));
  this.restCooldown = PlayerBlock.REST_SLEEP_LENGTH;
};

PlayerBlockRainbow.prototype.restHit = PlayerBlock.prototype.restHit;

PlayerBlockRainbow.prototype.wake = function() {
  this.effects.push(NxFx.block.alt.rainbow.wake.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerBlockRainbow.prototype.poundChannel = function() {
  this.poundCooldown = PlayerBlock.POUND_COOLDOWN_LENGTH;
  this.chargeEffect = NxFx.block.alt.rainbow.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
};

PlayerBlockRainbow.prototype.poundDash = function() {
  this.effects.push(NxFx.block.alt.rainbow.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.poundDirection = this.look;
};

PlayerBlockRainbow.prototype.pound = function() {
  this.effects.push(NxFx.block.alt.rainbow.wave.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(util.vec2.scale(this.poundDirection, PlayerBlock.POUND_OFFSET*2.), 0.1)));
};

PlayerBlockRainbow.prototype.poundHit = function() {
  this.effects.push(NxFx.block.alt.rainbow.slap.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(util.vec2.scale(this.poundDirection, PlayerBlock.POUND_OFFSET*2.), 0.1)));
};

PlayerBlockRainbow.prototype.taunt = PlayerBlock.prototype.taunt;

PlayerBlockRainbow.prototype.setPos = PlayerBlock.prototype.setPos;
PlayerBlockRainbow.prototype.setVel = PlayerBlock.prototype.setVel;
PlayerBlockRainbow.prototype.setHeight = PlayerBlock.prototype.setHeight;

PlayerBlockRainbow.prototype.setLook = PlayerBlock.prototype.setLook;
PlayerBlockRainbow.prototype.setSpeed = PlayerBlock.prototype.setSpeed;

PlayerBlockRainbow.prototype.getColor = PlayerObject.prototype.getColor;
PlayerBlockRainbow.prototype.getDraw = PlayerBlock.prototype.getDraw;

PlayerBlockRainbow.prototype.destroy = PlayerBlock.prototype.destroy;

PlayerBlockRainbow.prototype.type = PlayerBlock.prototype.type;
