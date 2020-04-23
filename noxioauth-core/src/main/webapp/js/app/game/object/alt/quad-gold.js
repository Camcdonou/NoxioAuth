"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerQuad */

/* Define PlayerQuadGold Class */
function PlayerQuadGold(game, oid, pos, team, color) {
  PlayerQuad.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.quad.gold");
};

PlayerQuadGold.prototype.update = PlayerQuad.prototype.update;
PlayerQuadGold.prototype.parseUpd = PlayerQuad.prototype.parseUpd;
PlayerQuadGold.prototype.effectSwitch = PlayerQuad.prototype.effectSwitch;
PlayerQuadGold.prototype.timers = PlayerQuad.prototype.timers;
PlayerQuadGold.prototype.ui = PlayerQuad.prototype.ui;

PlayerQuadGold.prototype.air  = PlayerQuad.prototype.air;
PlayerQuadGold.prototype.jump = PlayerQuad.prototype.jump;
PlayerQuadGold.prototype.land = PlayerQuad.prototype.land;
PlayerQuadGold.prototype.toss = PlayerObject.prototype.toss;
PlayerQuadGold.prototype.pickup = PlayerObject.prototype.pickup;

PlayerQuadGold.prototype.stun = PlayerQuad.prototype.stun;
PlayerQuadGold.prototype.stunGeneric = PlayerQuad.prototype.stunGeneric;
PlayerQuadGold.prototype.stunSlash = PlayerQuad.prototype.stunSlash;
PlayerQuadGold.prototype.stunElectric = PlayerQuad.prototype.stunElectric;
PlayerQuadGold.prototype.stunFire = PlayerQuad.prototype.stunFire;
PlayerQuadGold.prototype.criticalHit = PlayerQuad.prototype.criticalHit;
PlayerQuadGold.prototype.explode = PlayerQuad.prototype.explode;
PlayerQuadGold.prototype.fall = PlayerQuad.prototype.fall;

PlayerQuadGold.prototype.slash = function() {
  this.effects.push(NxFx.quad.alt.gold.light.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.look, 0.0)));
  this.slashCooldown = PlayerQuad.SLASH_COOLDOWN_LENGTH;
};

PlayerQuadGold.prototype.slashHit = function() {
  this.comboCounter++;
  this.comboTimer = PlayerQuad.SLASH_COMBO_DEGEN;
};

PlayerQuadGold.prototype.ready = function() {
  this.effects.push(NxFx.quad.alt.gold.combo.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.comboCounter = PlayerQuad.SLASH_COMBO_LENGTH;
};

PlayerQuadGold.prototype.combo = function() {
  this.effects.push(NxFx.quad.alt.gold.heavy.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.look, 0.0)));
  this.comboCounter = 0;
};

PlayerQuadGold.prototype.comboHit = function() {
  this.comboCounter++;
  this.comboTimer = PlayerQuad.SLASH_COMBO_DEGEN;
};

PlayerQuadGold.prototype.counter = function() {
  this.effects.push(NxFx.quad.alt.gold.counter.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.counterTimer = PlayerQuad.COUNTER_ACTIVE_LENGTH;
  this.counterCooldown = PlayerQuad.COUNTER_COOLDOWN_LENGTH;
};

PlayerQuadGold.prototype.riposte = function() {
  this.effects.push(NxFx.quad.alt.gold.riposte.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.counterDir, 0.0)));
  this.counterCooldown = 5;
};

PlayerQuadGold.prototype.riposteHit = PlayerQuad.prototype.riposteHit;

PlayerQuadGold.prototype.taunt = PlayerQuad.prototype.taunt;

PlayerQuadGold.prototype.setPos = PlayerQuad.prototype.setPos;
PlayerQuadGold.prototype.setVel = PlayerQuad.prototype.setVel;
PlayerQuadGold.prototype.setHeight = PlayerQuad.prototype.setHeight;

PlayerQuadGold.prototype.setLook = PlayerQuad.prototype.setLook;
PlayerQuadGold.prototype.setSpeed = PlayerQuad.prototype.setSpeed;

PlayerQuadGold.prototype.getColor = PlayerObject.prototype.getColor;
PlayerQuadGold.prototype.getDraw = PlayerQuad.prototype.getDraw;

PlayerQuadGold.prototype.destroy = PlayerQuad.prototype.destroy;

PlayerQuadGold.prototype.type = PlayerQuad.prototype.type;
