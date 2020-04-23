"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerQuad */

/* Define PlayerQuadRainbow Class */
function PlayerQuadRainbow(game, oid, pos, team, color) {
  PlayerQuad.call(this, game, oid, pos, team, color);
};

PlayerQuadRainbow.prototype.update = PlayerQuad.prototype.update;
PlayerQuadRainbow.prototype.parseUpd = PlayerQuad.prototype.parseUpd;
PlayerQuadRainbow.prototype.effectSwitch = PlayerQuad.prototype.effectSwitch;
PlayerQuadRainbow.prototype.timers = PlayerQuad.prototype.timers;
PlayerQuadRainbow.prototype.ui = PlayerQuad.prototype.ui;

PlayerQuadRainbow.prototype.air  = PlayerQuad.prototype.air;
PlayerQuadRainbow.prototype.jump = PlayerQuad.prototype.jump;
PlayerQuadRainbow.prototype.land = PlayerQuad.prototype.land;
PlayerQuadRainbow.prototype.toss = PlayerObject.prototype.toss;
PlayerQuadRainbow.prototype.pickup = PlayerObject.prototype.pickup;

PlayerQuadRainbow.prototype.stun = PlayerQuad.prototype.stun;
PlayerQuadRainbow.prototype.stunGeneric = PlayerQuad.prototype.stunGeneric;
PlayerQuadRainbow.prototype.stunSlash = PlayerQuad.prototype.stunSlash;
PlayerQuadRainbow.prototype.stunElectric = PlayerQuad.prototype.stunElectric;
PlayerQuadRainbow.prototype.stunFire = PlayerQuad.prototype.stunFire;
PlayerQuadRainbow.prototype.criticalHit = PlayerQuad.prototype.criticalHit;
PlayerQuadRainbow.prototype.explode = PlayerQuad.prototype.explode;
PlayerQuadRainbow.prototype.fall = PlayerQuad.prototype.fall;

PlayerQuadRainbow.prototype.slash = function() {
  this.effects.push(NxFx.quad.alt.rainbow.light.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.look, 0.0)));
  this.slashCooldown = PlayerQuad.SLASH_COOLDOWN_LENGTH;
};

PlayerQuadRainbow.prototype.slashHit = function() {
  this.comboCounter++;
  this.comboTimer = PlayerQuad.SLASH_COMBO_DEGEN;
};

PlayerQuadRainbow.prototype.ready = function() {
  this.effects.push(NxFx.quad.alt.rainbow.combo.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.comboCounter = PlayerQuad.SLASH_COMBO_LENGTH;
};

PlayerQuadRainbow.prototype.combo = function() {
  this.effects.push(NxFx.quad.alt.rainbow.heavy.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.look, 0.0)));
  this.comboCounter = 0;
};

PlayerQuadRainbow.prototype.comboHit = function() {
  this.comboCounter++;
  this.comboTimer = PlayerQuad.SLASH_COMBO_DEGEN;
};

PlayerQuadRainbow.prototype.counter = function() {
  this.effects.push(NxFx.quad.alt.rainbow.counter.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.counterTimer = PlayerQuad.COUNTER_ACTIVE_LENGTH;
  this.counterCooldown = PlayerQuad.COUNTER_COOLDOWN_LENGTH;
};

PlayerQuadRainbow.prototype.riposte = function() {
  this.effects.push(NxFx.quad.alt.rainbow.riposte.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.counterDir, 0.0)));
  this.counterCooldown = 5;
};

PlayerQuadRainbow.prototype.riposteHit = PlayerQuad.prototype.riposteHit;

PlayerQuadRainbow.prototype.taunt = PlayerQuad.prototype.taunt;

PlayerQuadRainbow.prototype.setPos = PlayerQuad.prototype.setPos;
PlayerQuadRainbow.prototype.setVel = PlayerQuad.prototype.setVel;
PlayerQuadRainbow.prototype.setHeight = PlayerQuad.prototype.setHeight;

PlayerQuadRainbow.prototype.setLook = PlayerQuad.prototype.setLook;
PlayerQuadRainbow.prototype.setSpeed = PlayerQuad.prototype.setSpeed;

PlayerQuadRainbow.prototype.getColor = PlayerObject.prototype.getColor;
PlayerQuadRainbow.prototype.getDraw = PlayerQuad.prototype.getDraw;

PlayerQuadRainbow.prototype.destroy = PlayerQuad.prototype.destroy;

PlayerQuadRainbow.prototype.type = PlayerQuad.prototype.type;
