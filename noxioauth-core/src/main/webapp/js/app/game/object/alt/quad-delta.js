"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerQuad */

/* Define PlayerQuadDelta Class */
function PlayerQuadDelta(game, oid, pos, team, color) {
  PlayerQuad.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.quad.delta");
};

PlayerQuadDelta.prototype.update = PlayerQuad.prototype.update;
PlayerQuadDelta.prototype.parseUpd = PlayerQuad.prototype.parseUpd;
PlayerQuadDelta.prototype.effectSwitch = PlayerQuad.prototype.effectSwitch;
PlayerQuadDelta.prototype.timers = PlayerQuad.prototype.timers;
PlayerQuadDelta.prototype.ui = PlayerQuad.prototype.ui;

PlayerQuadDelta.prototype.air  = PlayerQuad.prototype.air;
PlayerQuadDelta.prototype.jump = PlayerQuad.prototype.jump;
PlayerQuadDelta.prototype.land = PlayerQuad.prototype.land;
PlayerQuadDelta.prototype.toss = PlayerObject.prototype.toss;
PlayerQuadDelta.prototype.pickup = PlayerObject.prototype.pickup;

PlayerQuadDelta.prototype.stun = PlayerQuad.prototype.stun;
PlayerQuadDelta.prototype.stunGeneric = PlayerQuad.prototype.stunGeneric;
PlayerQuadDelta.prototype.stunSlash = PlayerQuad.prototype.stunSlash;
PlayerQuadDelta.prototype.stunElectric = PlayerQuad.prototype.stunElectric;
PlayerQuadDelta.prototype.stunFire = PlayerQuad.prototype.stunFire;
PlayerQuadDelta.prototype.criticalHit = PlayerQuad.prototype.criticalHit;
PlayerQuadDelta.prototype.explode = PlayerQuad.prototype.explode;
PlayerQuadDelta.prototype.fall = PlayerQuad.prototype.fall;

PlayerQuadDelta.prototype.slash = function() {
  this.effects.push(NxFx.quad.alt.delta.light.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.look, 0.0)));
  this.slashCooldown = PlayerQuad.SLASH_COOLDOWN_LENGTH;
};

PlayerQuadDelta.prototype.slashHit = function() {
  this.comboCounter++;
  this.comboTimer = PlayerQuad.SLASH_COMBO_DEGEN;
};

PlayerQuadDelta.prototype.ready = function() {
  this.effects.push(NxFx.quad.alt.delta.combo.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.comboCounter = PlayerQuad.SLASH_COMBO_LENGTH;
};

PlayerQuadDelta.prototype.combo = function() {
  this.effects.push(NxFx.quad.alt.delta.heavy.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.look, 0.0)));
  this.comboCounter = 0;
};

PlayerQuadDelta.prototype.comboHit = function() {
  this.comboCounter++;
  this.comboTimer = PlayerQuad.SLASH_COMBO_DEGEN;
};

PlayerQuadDelta.prototype.counter = function() {
  this.effects.push(NxFx.quad.alt.delta.counter.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.counterTimer = PlayerQuad.COUNTER_ACTIVE_LENGTH;
  this.counterCooldown = PlayerQuad.COUNTER_COOLDOWN_LENGTH;
};

PlayerQuadDelta.prototype.riposte = function() {
  this.effects.push(NxFx.quad.alt.delta.riposte.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.counterDir, 0.0)));
  this.counterCooldown = 5;
};

PlayerQuadDelta.prototype.riposteHit = PlayerQuad.prototype.riposteHit;

PlayerQuadDelta.prototype.taunt = PlayerQuad.prototype.taunt;

PlayerQuadDelta.prototype.setPos = PlayerQuad.prototype.setPos;
PlayerQuadDelta.prototype.setVel = PlayerQuad.prototype.setVel;
PlayerQuadDelta.prototype.setHeight = PlayerQuad.prototype.setHeight;

PlayerQuadDelta.prototype.setLook = PlayerQuad.prototype.setLook;
PlayerQuadDelta.prototype.setSpeed = PlayerQuad.prototype.setSpeed;

PlayerQuadDelta.prototype.getColor = PlayerObject.prototype.getColor;
PlayerQuadDelta.prototype.getDraw = PlayerQuad.prototype.getDraw;

PlayerQuadDelta.prototype.destroy = PlayerQuad.prototype.destroy;

PlayerQuadDelta.prototype.type = PlayerQuad.prototype.type;
