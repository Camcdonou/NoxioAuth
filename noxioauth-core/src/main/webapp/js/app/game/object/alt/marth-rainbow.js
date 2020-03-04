"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerMarth */

/* Define PlayerMarthRainbow Class */
function PlayerMarthRainbow(game, oid, pos, team, color) {
  PlayerMarth.call(this, game, oid, pos, team, color);
};

PlayerMarthRainbow.prototype.update = PlayerMarth.prototype.update;
PlayerMarthRainbow.prototype.parseUpd = PlayerMarth.prototype.parseUpd;
PlayerMarthRainbow.prototype.effectSwitch = PlayerMarth.prototype.effectSwitch;
PlayerMarthRainbow.prototype.timers = PlayerMarth.prototype.timers;
PlayerMarthRainbow.prototype.ui = PlayerMarth.prototype.ui;

PlayerMarthRainbow.prototype.air  = PlayerMarth.prototype.air;
PlayerMarthRainbow.prototype.jump = PlayerMarth.prototype.jump;
PlayerMarthRainbow.prototype.land = PlayerMarth.prototype.land;

PlayerMarthRainbow.prototype.stun = PlayerMarth.prototype.stun;
PlayerMarthRainbow.prototype.stunGeneric = PlayerMarth.prototype.stunGeneric;
PlayerMarthRainbow.prototype.stunSlash = PlayerMarth.prototype.stunSlash;
PlayerMarthRainbow.prototype.stunElectric = PlayerMarth.prototype.stunElectric;
PlayerMarthRainbow.prototype.stunFire = PlayerMarth.prototype.stunFire;
PlayerMarthRainbow.prototype.criticalHit = PlayerMarth.prototype.criticalHit;
PlayerMarthRainbow.prototype.explode = PlayerMarth.prototype.explode;
PlayerMarthRainbow.prototype.fall = PlayerMarth.prototype.fall;

PlayerMarthRainbow.prototype.slash = function() {
  this.effects.push(NxFx.marth.alt.rainbow.light.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.look, 0.0)));
  this.slashCooldown = PlayerMarth.SLASH_COOLDOWN_LENGTH;
};

PlayerMarthRainbow.prototype.slashHit = function() {
  this.comboCounter++;
  this.comboTimer = PlayerMarth.SLASH_COMBO_DEGEN;
};

PlayerMarthRainbow.prototype.ready = function() {
  this.effects.push(NxFx.marth.alt.rainbow.combo.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.comboCounter = PlayerMarth.SLASH_COMBO_LENGTH;
};

PlayerMarthRainbow.prototype.combo = function() {
  this.effects.push(NxFx.marth.alt.rainbow.heavy.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.look, 0.0)));
  this.comboCounter = 0;
};

PlayerMarthRainbow.prototype.comboHit = function() {
  this.comboCounter++;
  this.comboTimer = PlayerMarth.SLASH_COMBO_DEGEN;
};

PlayerMarthRainbow.prototype.counter = function() {
  this.effects.push(NxFx.marth.alt.rainbow.counter.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.counterTimer = PlayerMarth.COUNTER_ACTIVE_LENGTH;
  this.counterCooldown = PlayerMarth.COUNTER_COOLDOWN_LENGTH;
};

PlayerMarthRainbow.prototype.riposte = function() {
  this.effects.push(NxFx.marth.alt.rainbow.riposte.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.counterDir, 0.0)));
  this.counterCooldown = 5;
};

PlayerMarthRainbow.prototype.taunt = PlayerMarth.prototype.taunt;

PlayerMarthRainbow.prototype.setPos = PlayerMarth.prototype.setPos;
PlayerMarthRainbow.prototype.setVel = PlayerMarth.prototype.setVel;
PlayerMarthRainbow.prototype.setHeight = PlayerMarth.prototype.setHeight;

PlayerMarthRainbow.prototype.setLook = PlayerMarth.prototype.setLook;
PlayerMarthRainbow.prototype.setSpeed = PlayerMarth.prototype.setSpeed;

PlayerMarthRainbow.prototype.getColor = PlayerObject.prototype.getColor;
PlayerMarthRainbow.prototype.getDraw = PlayerMarth.prototype.getDraw;

PlayerMarthRainbow.prototype.destroy = PlayerMarth.prototype.destroy;

PlayerMarthRainbow.prototype.type = PlayerMarth.prototype.type;
