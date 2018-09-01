"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerCaptain */

/* Define PlayerCaptainVoice Class */
function PlayerCaptainVoice(game, oid, pos, team, color) {
  PlayerCaptain.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.captain.reverse");
};

PlayerCaptainVoice.prototype.update = PlayerCaptain.prototype.update;
PlayerCaptainVoice.prototype.parseUpd = PlayerCaptain.prototype.parseUpd;
PlayerCaptainVoice.prototype.effectSwitch = PlayerCaptain.prototype.effectSwitch;
PlayerCaptainVoice.prototype.timers = PlayerCaptain.prototype.timers;
PlayerCaptainVoice.prototype.ui = PlayerCaptain.prototype.ui;

PlayerCaptainVoice.prototype.air  = function() {
  PlayerCaptain.prototype.air.call(this);
  this.effects.push(NxFx.captain.alt.voice.jump.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerCaptainVoice.prototype.jump = function() {
  PlayerCaptain.prototype.jump.call(this);
  this.effects.push(NxFx.captain.alt.voice.jump.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerCaptainVoice.prototype.land = PlayerCaptain.prototype.land;

PlayerCaptainVoice.prototype.stun = function() {
  PlayerCaptain.prototype.stun.call(this);
  this.effects.push(NxFx.captain.alt.voice.hit.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerCaptainVoice.prototype.stunGeneric = PlayerCaptain.prototype.stunGeneric;
PlayerCaptainVoice.prototype.stunSlash = PlayerCaptain.prototype.stunSlash;
PlayerCaptainVoice.prototype.stunElectric = PlayerCaptain.prototype.stunElectric;
PlayerCaptainVoice.prototype.stunFire = PlayerCaptain.prototype.stunFire;
PlayerCaptainVoice.prototype.criticalHit = PlayerCaptain.prototype.criticalHit;

PlayerCaptainVoice.prototype.explode = function() {
  PlayerCaptain.prototype.explode.call(this);
  this.effects.push(NxFx.captain.alt.voice.explode.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};
PlayerCaptainVoice.prototype.fall = function() {
  PlayerCaptain.prototype.fall.call(this);
  this.effects.push(NxFx.captain.alt.voice.fall.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerCaptainVoice.prototype.charge = function() {
  PlayerCaptain.prototype.charge.call(this);
  this.effects.push(NxFx.captain.alt.voice.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerCaptainVoice.prototype.punch = function() {
  PlayerCaptain.prototype.punch.call(this);
  this.effects.push(NxFx.captain.alt.voice.punch.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerCaptainVoice.prototype.kick = PlayerCaptain.prototype.kick;
PlayerCaptainVoice.prototype.kicking = PlayerCaptain.prototype.kicking;

PlayerCaptainVoice.prototype.taunt = function() {
  PlayerCaptain.prototype.taunt.call(this);
  this.effects.push(NxFx.captain.alt.voice.taunt.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerCaptainVoice.prototype.setPos = PlayerCaptain.prototype.setPos;
PlayerCaptainVoice.prototype.setVel = PlayerCaptain.prototype.setVel;
PlayerCaptainVoice.prototype.setHeight = PlayerCaptain.prototype.setHeight;

PlayerCaptainVoice.prototype.setLook = PlayerCaptain.prototype.setLook;
PlayerCaptainVoice.prototype.setSpeed = PlayerCaptain.prototype.setSpeed;
PlayerCaptainVoice.prototype.getDraw = PlayerCaptain.prototype.getDraw;

PlayerCaptainVoice.prototype.destroy = PlayerObject.prototype.destroy;

PlayerCaptainVoice.prototype.type = PlayerCaptain.prototype.type;
