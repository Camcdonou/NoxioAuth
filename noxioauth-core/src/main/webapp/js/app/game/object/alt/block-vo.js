"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerBlock */

/* Define PlayerBlockVoice Class */
function PlayerBlockVoice(game, oid, pos, team, color) {
  PlayerBlock.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.block.reverse");
};

PlayerBlockVoice.prototype.update = PlayerBlock.prototype.update;
PlayerBlockVoice.prototype.parseUpd = PlayerBlock.prototype.parseUpd;
PlayerBlockVoice.prototype.effectSwitch = PlayerBlock.prototype.effectSwitch;
PlayerBlockVoice.prototype.timers = PlayerBlock.prototype.timers;
PlayerBlockVoice.prototype.ui = PlayerBlock.prototype.ui;

PlayerBlockVoice.prototype.air = function() {
  PlayerBlock.prototype.air.call(this);
  this.effects.push(NxFx.block.alt.voice.jump.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerBlockVoice.prototype.jump = function() {
  PlayerBlock.prototype.jump.call(this);
  this.effects.push(NxFx.block.alt.voice.jump.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerBlockVoice.prototype.recover = PlayerObject.prototype.recover;
PlayerBlockVoice.prototype.recoverJump = PlayerObject.prototype.recoverJump;

PlayerBlockVoice.prototype.land = PlayerBlock.prototype.land;
PlayerBlockVoice.prototype.toss = PlayerObject.prototype.toss;
PlayerBlockVoice.prototype.pickup = PlayerObject.prototype.pickup;

PlayerBlockVoice.prototype.stun = function() {
  PlayerBlock.prototype.stun.call(this);
  this.effects.push(NxFx.block.alt.voice.hit.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerBlockVoice.prototype.stunGeneric = PlayerBlock.prototype.stunGeneric;
PlayerBlockVoice.prototype.stunSlash = PlayerBlock.prototype.stunSlash;
PlayerBlockVoice.prototype.stunElectric = PlayerBlock.prototype.stunElectric;
PlayerBlockVoice.prototype.stunFire = PlayerBlock.prototype.stunFire;
PlayerBlockVoice.prototype.criticalHit = PlayerBlock.prototype.criticalHit;

PlayerBlockVoice.prototype.explode = function() {
  PlayerBlock.prototype.explode.call(this);
  this.game.putEffect(NxFx.block.alt.voice.explode.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerBlockVoice.prototype.fall = function() {
  PlayerBlock.prototype.fall.call(this);
  this.game.putEffect(NxFx.block.alt.voice.fall.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerBlockVoice.prototype.rest = function() {
  this.restEffect =   NxFx.block.alt.voice.rest.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.restEffect);
  this.effects.push(NxFx.block.wave.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec3.make(0, 0, 0)));
  this.restCooldown = PlayerBlock.REST_SLEEP_LENGTH;
};

PlayerBlockVoice.prototype.restHit = PlayerBlock.prototype.restHit;

PlayerBlockVoice.prototype.wake = function() {
  this.effects.push(NxFx.block.alt.voice.wake.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerBlockVoice.prototype.poundChannel = PlayerBlock.prototype.poundChannel;

PlayerBlockVoice.prototype.poundDash = function() {
  PlayerBlock.prototype.poundDash.call(this);
  this.effects.push(NxFx.block.alt.voice.pound.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerBlockVoice.prototype.pound = PlayerBlock.prototype.pound;

PlayerBlockVoice.prototype.poundHit = PlayerBlock.prototype.poundHit;

PlayerBlockVoice.prototype.taunt = function() {
  PlayerBlock.prototype.taunt.call(this);
  this.effects.push(NxFx.block.alt.voice.taunt.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerBlockVoice.prototype.setPos = PlayerBlock.prototype.setPos;
PlayerBlockVoice.prototype.setVel = PlayerBlock.prototype.setVel;
PlayerBlockVoice.prototype.setHeight = PlayerBlock.prototype.setHeight;

PlayerBlockVoice.prototype.setLook = PlayerBlock.prototype.setLook;
PlayerBlockVoice.prototype.setSpeed = PlayerBlock.prototype.setSpeed;

PlayerBlockVoice.prototype.getColor = PlayerObject.prototype.getColor;
PlayerBlockVoice.prototype.getDraw = PlayerBlock.prototype.getDraw;

PlayerBlockVoice.prototype.destroy = PlayerBlock.prototype.destroy;

PlayerBlockVoice.prototype.type = PlayerBlock.prototype.type;
