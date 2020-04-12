"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerQuad */

/* Define PlayerQuadFire Class */
function PlayerQuadFire(game, oid, pos, team, color) {
  PlayerQuad.call(this, game, oid, pos, team, color);
};

/* Constants */
PlayerQuadFire.COLOR_A = util.vec4.lerp(util.vec4.make(1.0, 0.462, 0.223, 1.0), util.vec4.make(1.0, 1.0, 1.0, 1.0), 0.95);
PlayerQuadFire.COLOR_B = util.vec4.make(1.0, 0.462, 0.223, 1.0);

PlayerQuadFire.prototype.update = PlayerQuad.prototype.update;
PlayerQuadFire.prototype.parseUpd = PlayerQuad.prototype.parseUpd;
PlayerQuadFire.prototype.effectSwitch = PlayerQuad.prototype.effectSwitch;
PlayerQuadFire.prototype.timers = PlayerQuad.prototype.timers;
PlayerQuadFire.prototype.ui = PlayerQuad.prototype.ui;

PlayerQuadFire.prototype.air  = PlayerQuad.prototype.air;
PlayerQuadFire.prototype.jump = PlayerQuad.prototype.jump;
PlayerQuadFire.prototype.land = PlayerQuad.prototype.land;
PlayerQuadFire.prototype.toss = PlayerObject.prototype.toss;
PlayerQuadFire.prototype.pickup = PlayerObject.prototype.pickup;

PlayerQuadFire.prototype.stun = PlayerQuad.prototype.stun;
PlayerQuadFire.prototype.stunGeneric = PlayerQuad.prototype.stunGeneric;
PlayerQuadFire.prototype.stunSlash = PlayerQuad.prototype.stunSlash;
PlayerQuadFire.prototype.stunElectric = PlayerQuad.prototype.stunElectric;
PlayerQuadFire.prototype.stunFire = PlayerQuad.prototype.stunFire;
PlayerQuadFire.prototype.criticalHit = PlayerQuad.prototype.criticalHit;
PlayerQuadFire.prototype.explode = PlayerQuad.prototype.explode;
PlayerQuadFire.prototype.fall = PlayerQuad.prototype.fall;

PlayerQuadFire.prototype.slash = function() {
  this.effects.push(NxFx.quad.alt.fire.light.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.look, 0.0)));
  this.slashCooldown = PlayerQuad.SLASH_COOLDOWN_LENGTH;
};

PlayerQuadFire.prototype.slashHit = function() {
  this.comboCounter++;
  this.comboTimer = PlayerQuad.SLASH_COMBO_DEGEN;
};

PlayerQuadFire.prototype.ready = function() {
  this.effects.push(NxFx.quad.alt.fire.combo.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.comboCounter = PlayerQuad.SLASH_COMBO_LENGTH;
};

PlayerQuadFire.prototype.combo = function() {
  this.effects.push(NxFx.quad.alt.fire.heavy.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.look, 0.0)));
  this.comboCounter = 0;
};

PlayerQuadFire.prototype.comboHit = function() {
  this.comboCounter++;
  this.comboTimer = PlayerQuad.SLASH_COMBO_DEGEN;
};

PlayerQuadFire.prototype.counter = function() {
  this.effects.push(NxFx.quad.alt.fire.counter.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.counterTimer = PlayerQuad.COUNTER_ACTIVE_LENGTH;
  this.counterCooldown = PlayerQuad.COUNTER_COOLDOWN_LENGTH;
};

PlayerQuadFire.prototype.riposte = function() {
  this.effects.push(NxFx.quad.alt.fire.riposte.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.counterDir, 0.0)));
  this.counterCooldown = 5;
};

PlayerQuadFire.prototype.taunt = PlayerQuad.prototype.taunt;

PlayerQuadFire.prototype.setPos = PlayerQuad.prototype.setPos;
PlayerQuadFire.prototype.setVel = PlayerQuad.prototype.setVel;
PlayerQuadFire.prototype.setHeight = PlayerQuad.prototype.setHeight;

PlayerQuadFire.prototype.setLook = PlayerQuad.prototype.setLook;
PlayerQuadFire.prototype.setSpeed = PlayerQuad.prototype.setSpeed;

PlayerQuadFire.prototype.getColor = PlayerObject.prototype.getColor;
PlayerQuadFire.prototype.getDraw = PlayerQuad.prototype.getDraw;

PlayerQuadFire.prototype.destroy = PlayerQuad.prototype.destroy;

PlayerQuadFire.prototype.type = PlayerQuad.prototype.type;
