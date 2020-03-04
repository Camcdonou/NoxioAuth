"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerPuff */

/* Define PlayerPuffVoice Class */
function PlayerPuffVoice(game, oid, pos, team, color) {
  PlayerPuff.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.puff.reverse");
};

PlayerPuffVoice.prototype.update = PlayerPuff.prototype.update;
PlayerPuffVoice.prototype.parseUpd = PlayerPuff.prototype.parseUpd;
PlayerPuffVoice.prototype.effectSwitch = PlayerPuff.prototype.effectSwitch;
PlayerPuffVoice.prototype.timers = PlayerPuff.prototype.timers;
PlayerPuffVoice.prototype.ui = PlayerPuff.prototype.ui;

PlayerPuffVoice.prototype.air = function() {
  PlayerPuff.prototype.air.call(this);
  this.effects.push(NxFx.puff.alt.voice.air.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerPuffVoice.prototype.jump = function() {
  PlayerPuff.prototype.jump.call(this);
  this.effects.push(NxFx.puff.alt.voice.jump.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerPuffVoice.prototype.land = PlayerPuff.prototype.land;

PlayerPuffVoice.prototype.stun = function() {
  PlayerPuff.prototype.stun.call(this);
  this.effects.push(NxFx.puff.alt.voice.hit.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerPuffVoice.prototype.stunGeneric = PlayerPuff.prototype.stunGeneric;
PlayerPuffVoice.prototype.stunSlash = PlayerPuff.prototype.stunSlash;
PlayerPuffVoice.prototype.stunElectric = PlayerPuff.prototype.stunElectric;
PlayerPuffVoice.prototype.stunFire = PlayerPuff.prototype.stunFire;
PlayerPuffVoice.prototype.criticalHit = PlayerPuff.prototype.criticalHit;

PlayerPuffVoice.prototype.explode = function() {
  PlayerPuff.prototype.explode.call(this);
  this.game.putEffect(NxFx.puff.alt.voice.explode.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerPuffVoice.prototype.fall = function() {
  PlayerPuff.prototype.fall.call(this);
  this.game.putEffect(NxFx.puff.alt.voice.fall.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerPuffVoice.prototype.rest = function() {
  this.restEffect =   NxFx.puff.alt.voice.rest.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.restEffect);
  this.effects.push(NxFx.puff.wave.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec3.make(0, 0, 0)));
  this.restCooldown = PlayerPuff.REST_SLEEP_LENGTH;
};

PlayerPuffVoice.prototype.wake = function() {
  this.effects.push(NxFx.puff.alt.voice.wake.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerPuffVoice.prototype.poundChannel = PlayerPuff.prototype.poundChannel;

PlayerPuffVoice.prototype.poundDash = function() {
  PlayerPuff.prototype.poundDash.call(this);
  this.effects.push(NxFx.puff.alt.voice.pound.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerPuffVoice.prototype.pound = PlayerPuff.prototype.pound;

PlayerPuffVoice.prototype.poundHit = PlayerPuff.prototype.poundHit;

PlayerPuffVoice.prototype.taunt = function() {
  PlayerPuff.prototype.taunt.call(this);
  this.effects.push(NxFx.puff.alt.voice.taunt.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerPuffVoice.prototype.setPos = PlayerPuff.prototype.setPos;
PlayerPuffVoice.prototype.setVel = PlayerPuff.prototype.setVel;
PlayerPuffVoice.prototype.setHeight = PlayerPuff.prototype.setHeight;

PlayerPuffVoice.prototype.setLook = PlayerPuff.prototype.setLook;
PlayerPuffVoice.prototype.setSpeed = PlayerPuff.prototype.setSpeed;

PlayerPuffVoice.prototype.getColor = PlayerObject.prototype.getColor;
PlayerPuffVoice.prototype.getDraw = PlayerPuff.prototype.getDraw;

PlayerPuffVoice.prototype.destroy = PlayerPuff.prototype.destroy;

PlayerPuffVoice.prototype.type = PlayerPuff.prototype.type;
