"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerQuad */

/* Define PlayerQuadVoice Class */
function PlayerQuadVoice(game, oid, pos, team, color) {
  PlayerQuad.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.quad.reverse");
};

PlayerQuadVoice.prototype.update = PlayerQuad.prototype.update;
PlayerQuadVoice.prototype.parseUpd = PlayerQuad.prototype.parseUpd;
PlayerQuadVoice.prototype.effectSwitch = PlayerQuad.prototype.effectSwitch;
PlayerQuadVoice.prototype.timers = PlayerQuad.prototype.timers;
PlayerQuadVoice.prototype.ui = PlayerQuad.prototype.ui;

PlayerQuadVoice.prototype.air  = function() {
  PlayerQuad.prototype.air.call(this);
  this.effects.push(NxFx.quad.alt.voice.jump.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerQuadVoice.prototype.jump = function() {
  PlayerQuad.prototype.jump.call(this);
  this.effects.push(NxFx.quad.alt.voice.jump.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerQuadVoice.prototype.land = PlayerQuad.prototype.land;
PlayerQuadVoice.prototype.toss = PlayerObject.prototype.toss;
PlayerQuadVoice.prototype.pickup = PlayerObject.prototype.pickup;

PlayerQuadVoice.prototype.stun = function() {
  PlayerQuad.prototype.stun.call(this);
  this.effects.push(NxFx.quad.alt.voice.hit.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerQuadVoice.prototype.stunGeneric = PlayerQuad.prototype.stunGeneric;
PlayerQuadVoice.prototype.stunSlash = PlayerQuad.prototype.stunSlash;
PlayerQuadVoice.prototype.stunElectric = PlayerQuad.prototype.stunElectric;
PlayerQuadVoice.prototype.stunFire = PlayerQuad.prototype.stunFire;
PlayerQuadVoice.prototype.criticalHit = PlayerQuad.prototype.criticalHit;

PlayerQuadVoice.prototype.explode = function() {
  PlayerQuad.prototype.explode.call(this);
  this.game.putEffect(NxFx.quad.alt.voice.explode.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};
PlayerQuadVoice.prototype.fall = function() {
  PlayerQuad.prototype.fall.call(this);
  this.effects.push(NxFx.quad.alt.voice.fall.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerQuadVoice.prototype.slash = function() {
  PlayerQuad.prototype.slash.call(this);
};

PlayerQuadVoice.prototype.slashHit = function() {
  PlayerQuad.prototype.slashHit.call(this);
};

PlayerQuadVoice.prototype.ready = function() {
  PlayerQuad.prototype.ready.call(this);
};

PlayerQuadVoice.prototype.combo = function() {
  PlayerQuad.prototype.combo.call(this);
  this.effects.push(NxFx.quad.alt.voice.heavy.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerQuadVoice.prototype.comboHit = function() {
  PlayerQuad.prototype.comboHit.call(this);
};

PlayerQuadVoice.prototype.counter = function() {
  PlayerQuad.prototype.counter.call(this);
};

PlayerQuadVoice.prototype.riposte = function() {
  PlayerQuad.prototype.riposte.call(this);
  this.effects.push(NxFx.quad.alt.voice.riposte.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerQuadVoice.prototype.taunt = function() {
  PlayerQuad.prototype.taunt.call(this);
  this.effects.push(NxFx.quad.alt.voice.taunt.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerQuadVoice.prototype.setPos = PlayerQuad.prototype.setPos;
PlayerQuadVoice.prototype.setVel = PlayerQuad.prototype.setVel;
PlayerQuadVoice.prototype.setHeight = PlayerQuad.prototype.setHeight;

PlayerQuadVoice.prototype.setLook = PlayerQuad.prototype.setLook;
PlayerQuadVoice.prototype.setSpeed = PlayerQuad.prototype.setSpeed;

PlayerQuadVoice.prototype.getColor = PlayerObject.prototype.getColor;
PlayerQuadVoice.prototype.getDraw = PlayerQuad.prototype.getDraw;

PlayerQuadVoice.prototype.destroy = PlayerQuad.prototype.destroy;

PlayerQuadVoice.prototype.type = PlayerQuad.prototype.type;
