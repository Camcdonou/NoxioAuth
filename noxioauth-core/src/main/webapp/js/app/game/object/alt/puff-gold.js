"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerPuff */

/* Define PlayerPuffGold Class */
function PlayerPuffGold(game, oid, pos, team, color) {
  PlayerPuff.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.puff.gold");
};

PlayerPuffGold.prototype.update = PlayerPuff.prototype.update;
PlayerPuffGold.prototype.parseUpd = PlayerPuff.prototype.parseUpd;
PlayerPuffGold.prototype.effectSwitch = PlayerPuff.prototype.effectSwitch;
PlayerPuffGold.prototype.timers = PlayerPuff.prototype.timers;
PlayerPuffGold.prototype.ui = PlayerPuff.prototype.ui;

PlayerPuffGold.prototype.air  = PlayerPuff.prototype.air;
PlayerPuffGold.prototype.jump = PlayerPuff.prototype.jump;
PlayerPuffGold.prototype.land = PlayerPuff.prototype.land;

PlayerPuffGold.prototype.stun = PlayerPuff.prototype.stun;

PlayerPuffGold.prototype.stunGeneric = PlayerPuff.prototype.stunGeneric;
PlayerPuffGold.prototype.stunSlash = PlayerPuff.prototype.stunSlash;
PlayerPuffGold.prototype.stunElectric = PlayerPuff.prototype.stunElectric;
PlayerPuffGold.prototype.stunFire = PlayerPuff.prototype.stunFire;
PlayerPuffGold.prototype.criticalHit = PlayerPuff.prototype.criticalHit;
PlayerPuffGold.prototype.explode = PlayerPuff.prototype.explode;
PlayerPuffGold.prototype.fall = PlayerPuff.prototype.fall;

PlayerPuffGold.prototype.rest = function() {
  this.restEffect = NxFx.puff.alt.gold.rest.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.restEffect);
  this.effects.push(NxFx.puff.alt.gold.wave.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec3.make(0, 0, 0)));
  this.restCooldown = PlayerPuff.REST_SLEEP_LENGTH;
};

PlayerPuffGold.prototype.wake = function() {
  this.effects.push(NxFx.puff.alt.gold.wake.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerPuffGold.prototype.poundChannel = function() {
  this.poundCooldown = PlayerPuff.POUND_COOLDOWN_LENGTH;
  this.chargeEffect = NxFx.puff.alt.gold.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
};

PlayerPuffGold.prototype.poundDash = function() {
  this.effects.push(NxFx.puff.alt.gold.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.poundDirection = this.look;
};

PlayerPuffGold.prototype.pound = function() {
  this.effects.push(NxFx.puff.alt.gold.wave.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(util.vec2.scale(this.poundDirection, PlayerPuff.POUND_OFFSET*2.), 0.1)));
};

PlayerPuffGold.prototype.poundHit = function() {
  this.effects.push(NxFx.puff.alt.gold.slap.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(util.vec2.scale(this.poundDirection, PlayerPuff.POUND_OFFSET*2.), 0.1)));
};

PlayerPuffGold.prototype.taunt = PlayerPuff.prototype.taunt;

PlayerPuffGold.prototype.setPos = PlayerPuff.prototype.setPos;
PlayerPuffGold.prototype.setVel = PlayerPuff.prototype.setVel;
PlayerPuffGold.prototype.setHeight = PlayerPuff.prototype.setHeight;

PlayerPuffGold.prototype.setLook = PlayerPuff.prototype.setLook;
PlayerPuffGold.prototype.setSpeed = PlayerPuff.prototype.setSpeed;

PlayerPuffGold.prototype.getColor = PlayerObject.prototype.getColor;
PlayerPuffGold.prototype.getDraw = PlayerPuff.prototype.getDraw;

PlayerPuffGold.prototype.destroy = PlayerPuff.prototype.destroy;

PlayerPuffGold.prototype.type = PlayerPuff.prototype.type;
