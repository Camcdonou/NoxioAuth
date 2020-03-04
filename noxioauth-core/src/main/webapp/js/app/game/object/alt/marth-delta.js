"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerMarth */

/* Define PlayerMarthDelta Class */
function PlayerMarthDelta(game, oid, pos, team, color) {
  PlayerMarth.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.marth.delta");
};

PlayerMarthDelta.prototype.update = PlayerMarth.prototype.update;
PlayerMarthDelta.prototype.parseUpd = PlayerMarth.prototype.parseUpd;
PlayerMarthDelta.prototype.effectSwitch = PlayerMarth.prototype.effectSwitch;
PlayerMarthDelta.prototype.timers = PlayerMarth.prototype.timers;
PlayerMarthDelta.prototype.ui = PlayerMarth.prototype.ui;

PlayerMarthDelta.prototype.air  = PlayerMarth.prototype.air;
PlayerMarthDelta.prototype.jump = PlayerMarth.prototype.jump;
PlayerMarthDelta.prototype.land = PlayerMarth.prototype.land;

PlayerMarthDelta.prototype.stun = PlayerMarth.prototype.stun;
PlayerMarthDelta.prototype.stunGeneric = PlayerMarth.prototype.stunGeneric;
PlayerMarthDelta.prototype.stunSlash = PlayerMarth.prototype.stunSlash;
PlayerMarthDelta.prototype.stunElectric = PlayerMarth.prototype.stunElectric;
PlayerMarthDelta.prototype.stunFire = PlayerMarth.prototype.stunFire;
PlayerMarthDelta.prototype.criticalHit = PlayerMarth.prototype.criticalHit;
PlayerMarthDelta.prototype.explode = PlayerMarth.prototype.explode;
PlayerMarthDelta.prototype.fall = PlayerMarth.prototype.fall;

PlayerMarthDelta.prototype.slash = function() {
  this.effects.push(NxFx.marth.alt.delta.light.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.look, 0.0)));
  this.slashCooldown = PlayerMarth.SLASH_COOLDOWN_LENGTH;
};

PlayerMarthDelta.prototype.slashHit = function() {
  this.comboCounter++;
  this.comboTimer = PlayerMarth.SLASH_COMBO_DEGEN;
};

PlayerMarthDelta.prototype.ready = function() {
  this.effects.push(NxFx.marth.alt.delta.combo.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.comboCounter = PlayerMarth.SLASH_COMBO_LENGTH;
};

PlayerMarthDelta.prototype.combo = function() {
  this.effects.push(NxFx.marth.alt.delta.heavy.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.look, 0.0)));
  this.comboCounter = 0;
};

PlayerMarthDelta.prototype.comboHit = function() {
  this.comboCounter++;
  this.comboTimer = PlayerMarth.SLASH_COMBO_DEGEN;
};

PlayerMarthDelta.prototype.counter = function() {
  this.effects.push(NxFx.marth.alt.delta.counter.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.counterTimer = PlayerMarth.COUNTER_ACTIVE_LENGTH;
  this.counterCooldown = PlayerMarth.COUNTER_COOLDOWN_LENGTH;
};

PlayerMarthDelta.prototype.riposte = function() {
  this.effects.push(NxFx.marth.alt.delta.riposte.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.counterDir, 0.0)));
  this.counterCooldown = 5;
};

PlayerMarthDelta.prototype.taunt = PlayerMarth.prototype.taunt;

PlayerMarthDelta.prototype.setPos = PlayerMarth.prototype.setPos;
PlayerMarthDelta.prototype.setVel = PlayerMarth.prototype.setVel;
PlayerMarthDelta.prototype.setHeight = PlayerMarth.prototype.setHeight;

PlayerMarthDelta.prototype.setLook = PlayerMarth.prototype.setLook;
PlayerMarthDelta.prototype.setSpeed = PlayerMarth.prototype.setSpeed;

PlayerMarthDelta.prototype.getColor = PlayerObject.prototype.getColor;
PlayerMarthDelta.prototype.getDraw = PlayerMarth.prototype.getDraw;

PlayerMarthDelta.prototype.destroy = PlayerMarth.prototype.destroy;

PlayerMarthDelta.prototype.type = PlayerMarth.prototype.type;
