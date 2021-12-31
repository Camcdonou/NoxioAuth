"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerCrate */
/* global NxFx */

/* Define PlayerCrateVoice Class */
function PlayerCrateVoice(game, oid, pos, team, color) {
  PlayerCrate.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.crate.reverse");
};

PlayerCrateVoice.prototype.update = PlayerCrate.prototype.update;
PlayerCrateVoice.prototype.parseUpd = PlayerCrate.prototype.parseUpd;
PlayerCrateVoice.prototype.effectSwitch = PlayerCrate.prototype.effectSwitch;
PlayerCrateVoice.prototype.timers = PlayerCrate.prototype.timers;
PlayerCrateVoice.prototype.ui = PlayerCrate.prototype.ui;

PlayerCrateVoice.prototype.air  = function() {
  PlayerCrate.prototype.air.call(this);
  this.effects.push(NxFx.crate.alt.voice.jump.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerCrateVoice.prototype.jump = function() {
  PlayerCrate.prototype.jump.call(this);
  this.effects.push(NxFx.crate.alt.voice.jump.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerCrateVoice.prototype.recover = PlayerObject.prototype.recover;
PlayerCrateVoice.prototype.recoverJump = PlayerObject.prototype.recoverJump;

PlayerCrateVoice.prototype.land = PlayerCrate.prototype.land;
PlayerCrateVoice.prototype.toss = PlayerObject.prototype.toss;
PlayerCrateVoice.prototype.pickup = PlayerObject.prototype.pickup;

PlayerCrateVoice.prototype.stun = function() {
  PlayerCrate.prototype.stun.call(this);
  this.effects.push(NxFx.crate.alt.voice.hit.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerCrateVoice.prototype.stunGeneric = PlayerCrate.prototype.stunGeneric;
PlayerCrateVoice.prototype.stunSlash = PlayerCrate.prototype.stunSlash;
PlayerCrateVoice.prototype.stunElectric = PlayerCrate.prototype.stunElectric;
PlayerCrateVoice.prototype.stunFire = PlayerCrate.prototype.stunFire;
PlayerCrateVoice.prototype.criticalHit = PlayerCrate.prototype.criticalHit;

PlayerCrateVoice.prototype.explode = function() {
  PlayerCrate.prototype.explode.call(this);
  this.game.putEffect(NxFx.crate.alt.voice.explode.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerCrateVoice.prototype.fall = function() {
  PlayerCrate.prototype.fall.call(this);
  this.effects.push(NxFx.crate.alt.voice.fall.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerCrateVoice.prototype.blip = PlayerCrate.prototype.blip;

PlayerCrateVoice.prototype.dash = function() {
  PlayerCrate.prototype.dash.call(this);
  this.effects.push(NxFx.crate.alt.voice.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerCrateVoice.prototype.charge = PlayerCrate.prototype.charge;

PlayerCrateVoice.prototype.taunt = function() {
  PlayerCrate.prototype.taunt.call(this);
  this.effects.push(NxFx.crate.alt.voice.taunt.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerCrateVoice.prototype.setPos = PlayerCrate.prototype.setPos;
PlayerCrateVoice.prototype.setVel = PlayerCrate.prototype.setVel;
PlayerCrateVoice.prototype.setHeight = PlayerCrate.prototype.setHeight;

PlayerCrateVoice.prototype.setLook = PlayerCrate.prototype.setLook;
PlayerCrateVoice.prototype.setSpeed = PlayerCrate.prototype.setSpeed;

PlayerCrateVoice.prototype.getColor = PlayerObject.prototype.getColor;
PlayerCrateVoice.prototype.getDraw = PlayerCrate.prototype.getDraw;

PlayerCrateVoice.prototype.destroy = PlayerCrate.prototype.destroy;

PlayerCrateVoice.prototype.type = PlayerCrate.prototype.type;
