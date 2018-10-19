"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerMarth */

/* Define PlayerMarthVoice Class */
function PlayerMarthVoice(game, oid, pos, team, color) {
  PlayerMarth.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.marth.reverse");
};

PlayerMarthVoice.prototype.update = PlayerMarth.prototype.update;
PlayerMarthVoice.prototype.parseUpd = PlayerMarth.prototype.parseUpd;
PlayerMarthVoice.prototype.effectSwitch = PlayerMarth.prototype.effectSwitch;
PlayerMarthVoice.prototype.timers = PlayerMarth.prototype.timers;
PlayerMarthVoice.prototype.ui = PlayerMarth.prototype.ui;

PlayerMarthVoice.prototype.air  = function() {
  PlayerMarth.prototype.air.call(this);
  this.effects.push(NxFx.marth.alt.voice.jump.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerMarthVoice.prototype.jump = function() {
  PlayerMarth.prototype.jump.call(this);
  this.effects.push(NxFx.marth.alt.voice.jump.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerMarthVoice.prototype.land = PlayerMarth.prototype.land;

PlayerMarthVoice.prototype.stun = function() {
  PlayerMarth.prototype.stun.call(this);
  this.effects.push(NxFx.marth.alt.voice.hit.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerMarthVoice.prototype.stunGeneric = PlayerMarth.prototype.stunGeneric;
PlayerMarthVoice.prototype.stunSlash = PlayerMarth.prototype.stunSlash;
PlayerMarthVoice.prototype.stunElectric = PlayerMarth.prototype.stunElectric;
PlayerMarthVoice.prototype.stunFire = PlayerMarth.prototype.stunFire;
PlayerMarthVoice.prototype.criticalHit = PlayerMarth.prototype.criticalHit;

PlayerMarthVoice.prototype.explode = function() {
  PlayerMarth.prototype.explode.call(this);
  this.effects.push(NxFx.marth.alt.voice.explode.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};
PlayerMarthVoice.prototype.fall = function() {
  PlayerMarth.prototype.fall.call(this);
  this.effects.push(NxFx.marth.alt.voice.fall.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerMarthVoice.prototype.slash = function() {
  PlayerMarth.prototype.slash.call(this);
};

PlayerMarthVoice.prototype.slashHit = function() {
  PlayerMarth.prototype.slashHit.call(this);
};

PlayerMarthVoice.prototype.ready = function() {
  PlayerMarth.prototype.ready.call(this);
};

PlayerMarthVoice.prototype.combo = function() {
  PlayerMarth.prototype.combo.call(this);
  this.effects.push(NxFx.marth.alt.voice.heavy.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerMarthVoice.prototype.comboHit = function() {
  PlayerMarth.prototype.comboHit.call(this);
};

PlayerMarthVoice.prototype.counter = function() {
  PlayerMarth.prototype.counter.call(this);
};

PlayerMarthVoice.prototype.riposte = function() {
  PlayerMarth.prototype.riposte.call(this);
  this.effects.push(NxFx.marth.alt.voice.riposte.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerMarthVoice.prototype.taunt = function() {
  PlayerMarth.prototype.taunt.call(this);
  this.effects.push(NxFx.marth.alt.voice.taunt.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerMarthVoice.prototype.setPos = PlayerMarth.prototype.setPos;
PlayerMarthVoice.prototype.setVel = PlayerMarth.prototype.setVel;
PlayerMarthVoice.prototype.setHeight = PlayerMarth.prototype.setHeight;

PlayerMarthVoice.prototype.setLook = PlayerMarth.prototype.setLook;
PlayerMarthVoice.prototype.setSpeed = PlayerMarth.prototype.setSpeed;
PlayerMarthVoice.prototype.getDraw = PlayerMarth.prototype.getDraw;

PlayerMarthVoice.prototype.destroy = PlayerMarth.prototype.destroy;

PlayerMarthVoice.prototype.type = PlayerMarth.prototype.type;
