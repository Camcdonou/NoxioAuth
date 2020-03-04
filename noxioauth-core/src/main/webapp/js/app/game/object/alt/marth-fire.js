"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerMarth */

/* Define PlayerMarthFire Class */
function PlayerMarthFire(game, oid, pos, team, color) {
  PlayerMarth.call(this, game, oid, pos, team, color);
};

/* Constants */
PlayerMarthFire.COLOR_A = util.vec4.lerp(util.vec4.make(1.0, 0.462, 0.223, 1.0), util.vec4.make(1.0, 1.0, 1.0, 1.0), 0.95);
PlayerMarthFire.COLOR_B = util.vec4.make(1.0, 0.462, 0.223, 1.0);

PlayerMarthFire.prototype.update = PlayerMarth.prototype.update;
PlayerMarthFire.prototype.parseUpd = PlayerMarth.prototype.parseUpd;
PlayerMarthFire.prototype.effectSwitch = PlayerMarth.prototype.effectSwitch;
PlayerMarthFire.prototype.timers = PlayerMarth.prototype.timers;
PlayerMarthFire.prototype.ui = PlayerMarth.prototype.ui;

PlayerMarthFire.prototype.air  = PlayerMarth.prototype.air;
PlayerMarthFire.prototype.jump = PlayerMarth.prototype.jump;
PlayerMarthFire.prototype.land = PlayerMarth.prototype.land;

PlayerMarthFire.prototype.stun = PlayerMarth.prototype.stun;
PlayerMarthFire.prototype.stunGeneric = PlayerMarth.prototype.stunGeneric;
PlayerMarthFire.prototype.stunSlash = PlayerMarth.prototype.stunSlash;
PlayerMarthFire.prototype.stunElectric = PlayerMarth.prototype.stunElectric;
PlayerMarthFire.prototype.stunFire = PlayerMarth.prototype.stunFire;
PlayerMarthFire.prototype.criticalHit = PlayerMarth.prototype.criticalHit;
PlayerMarthFire.prototype.explode = PlayerMarth.prototype.explode;
PlayerMarthFire.prototype.fall = PlayerMarth.prototype.fall;

PlayerMarthFire.prototype.slash = function() {
  this.effects.push(NxFx.marth.alt.fire.light.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.look, 0.0)));
  this.slashCooldown = PlayerMarth.SLASH_COOLDOWN_LENGTH;
};

PlayerMarthFire.prototype.slashHit = function() {
  this.comboCounter++;
  this.comboTimer = PlayerMarth.SLASH_COMBO_DEGEN;
};

PlayerMarthFire.prototype.ready = function() {
  this.effects.push(NxFx.marth.alt.fire.combo.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.comboCounter = PlayerMarth.SLASH_COMBO_LENGTH;
};

PlayerMarthFire.prototype.combo = function() {
  this.effects.push(NxFx.marth.alt.fire.heavy.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.look, 0.0)));
  this.comboCounter = 0;
};

PlayerMarthFire.prototype.comboHit = function() {
  this.comboCounter++;
  this.comboTimer = PlayerMarth.SLASH_COMBO_DEGEN;
};

PlayerMarthFire.prototype.counter = function() {
  this.effects.push(NxFx.marth.alt.fire.counter.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.counterTimer = PlayerMarth.COUNTER_ACTIVE_LENGTH;
  this.counterCooldown = PlayerMarth.COUNTER_COOLDOWN_LENGTH;
};

PlayerMarthFire.prototype.riposte = function() {
  this.effects.push(NxFx.marth.alt.fire.riposte.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.counterDir, 0.0)));
  this.counterCooldown = 5;
};

PlayerMarthFire.prototype.taunt = PlayerMarth.prototype.taunt;

PlayerMarthFire.prototype.setPos = PlayerMarth.prototype.setPos;
PlayerMarthFire.prototype.setVel = PlayerMarth.prototype.setVel;
PlayerMarthFire.prototype.setHeight = PlayerMarth.prototype.setHeight;

PlayerMarthFire.prototype.setLook = PlayerMarth.prototype.setLook;
PlayerMarthFire.prototype.setSpeed = PlayerMarth.prototype.setSpeed;

PlayerMarthFire.prototype.getColor = PlayerObject.prototype.getColor;
PlayerMarthFire.prototype.getDraw = PlayerMarth.prototype.getDraw;

PlayerMarthFire.prototype.destroy = PlayerMarth.prototype.destroy;

PlayerMarthFire.prototype.type = PlayerMarth.prototype.type;
