"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerMarth */

/* Define PlayerMarthGold Class */
function PlayerMarthGold(game, oid, pos, team, color) {
  PlayerMarth.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.marth.gold");
};

PlayerMarthGold.prototype.update = PlayerMarth.prototype.update;
PlayerMarthGold.prototype.parseUpd = PlayerMarth.prototype.parseUpd;
PlayerMarthGold.prototype.effectSwitch = PlayerMarth.prototype.effectSwitch;
PlayerMarthGold.prototype.timers = PlayerMarth.prototype.timers;
PlayerMarthGold.prototype.ui = PlayerMarth.prototype.ui;

PlayerMarthGold.prototype.air  = PlayerMarth.prototype.air;
PlayerMarthGold.prototype.jump = PlayerMarth.prototype.jump;
PlayerMarthGold.prototype.land = PlayerMarth.prototype.land;

PlayerMarthGold.prototype.stun = PlayerMarth.prototype.stun;
PlayerMarthGold.prototype.stunGeneric = PlayerMarth.prototype.stunGeneric;
PlayerMarthGold.prototype.stunSlash = PlayerMarth.prototype.stunSlash;
PlayerMarthGold.prototype.stunElectric = PlayerMarth.prototype.stunElectric;
PlayerMarthGold.prototype.stunFire = PlayerMarth.prototype.stunFire;
PlayerMarthGold.prototype.criticalHit = PlayerMarth.prototype.criticalHit;
PlayerMarthGold.prototype.explode = PlayerMarth.prototype.explode;
PlayerMarthGold.prototype.fall = PlayerMarth.prototype.fall;

PlayerMarthGold.prototype.slash = function() {
  this.effects.push(NxFx.marth.alt.gold.light.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.look, 0.0)));
  this.slashCooldown = PlayerMarth.SLASH_COOLDOWN_LENGTH;
};

PlayerMarthGold.prototype.slashHit = function() {
  this.comboCounter++;
  this.comboTimer = PlayerMarth.SLASH_COMBO_DEGEN;
};

PlayerMarthGold.prototype.ready = function() {
  this.effects.push(NxFx.marth.alt.gold.combo.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.comboCounter = PlayerMarth.SLASH_COMBO_LENGTH;
};

PlayerMarthGold.prototype.combo = function() {
  this.effects.push(NxFx.marth.alt.gold.heavy.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.look, 0.0)));
  this.comboCounter = 0;
};

PlayerMarthGold.prototype.comboHit = function() {
  this.comboCounter++;
  this.comboTimer = PlayerMarth.SLASH_COMBO_DEGEN;
};

PlayerMarthGold.prototype.counter = function() {
  this.effects.push(NxFx.marth.alt.gold.counter.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.counterTimer = PlayerMarth.COUNTER_ACTIVE_LENGTH;
  this.counterCooldown = PlayerMarth.COUNTER_COOLDOWN_LENGTH;
};

PlayerMarthGold.prototype.riposte = function() {
  this.effects.push(NxFx.marth.alt.gold.riposte.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.counterDir, 0.0)));
  this.counterCooldown = 5;
};

PlayerMarthGold.prototype.taunt = PlayerMarth.prototype.taunt;

PlayerMarthGold.prototype.setPos = PlayerMarth.prototype.setPos;
PlayerMarthGold.prototype.setVel = PlayerMarth.prototype.setVel;
PlayerMarthGold.prototype.setHeight = PlayerMarth.prototype.setHeight;

PlayerMarthGold.prototype.setLook = PlayerMarth.prototype.setLook;
PlayerMarthGold.prototype.setSpeed = PlayerMarth.prototype.setSpeed;

PlayerMarthGold.prototype.getColor = PlayerObject.prototype.getColor;
PlayerMarthGold.prototype.getDraw = PlayerMarth.prototype.getDraw;

PlayerMarthGold.prototype.destroy = PlayerMarth.prototype.destroy;

PlayerMarthGold.prototype.type = PlayerMarth.prototype.type;
