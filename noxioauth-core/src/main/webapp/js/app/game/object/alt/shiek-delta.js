"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerShiek */
/* global NxFx */

/* Define PlayerShiekDelta Class */
function PlayerShiekDelta(game, oid, pos, team, color) {
  PlayerShiek.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.shiek.delta");
};

PlayerShiekDelta.prototype.update = PlayerShiek.prototype.update;

PlayerShiekDelta.prototype.parseUpd = PlayerShiek.prototype.parseUpd;

PlayerShiekDelta.prototype.effectSwitch = PlayerShiek.prototype.effectSwitch;

PlayerShiekDelta.prototype.timers = PlayerShiek.prototype.timers;

PlayerShiekDelta.prototype.ui = PlayerShiek.prototype.ui;

PlayerShiekDelta.prototype.air  = PlayerShiek.prototype.air;
PlayerShiekDelta.prototype.jump = PlayerShiek.prototype.jump;
PlayerShiekDelta.prototype.land = PlayerShiek.prototype.land;

PlayerShiekDelta.prototype.stun = PlayerShiek.prototype.stun;

PlayerShiekDelta.prototype.stunGeneric = PlayerShiek.prototype.stunGeneric;
PlayerShiekDelta.prototype.stunSlash = PlayerShiek.prototype.stunSlash;
PlayerShiekDelta.prototype.stunElectric = PlayerShiek.prototype.stunElectric;
PlayerShiekDelta.prototype.stunFire = PlayerShiek.prototype.stunFire;
PlayerShiekDelta.prototype.criticalHit = PlayerShiek.prototype.criticalHit;
PlayerShiekDelta.prototype.explode = PlayerShiek.prototype.explode;
PlayerShiekDelta.prototype.fall = PlayerShiek.prototype.fall;

PlayerShiekDelta.prototype.blip = function() {
  this.effects.push(NxFx.fox.alt.delta.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerShiek.BLIP_POWER_MAX;
};

PlayerShiekDelta.prototype.charge = function() {
  this.chargeEffect = NxFx.shiek.alt.delta.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.chargeTimer = PlayerShiek.FLASH_CHARGE_LENGTH;
};

PlayerShiekDelta.prototype.recall = function() {
  this.effects.push(NxFx.shiek.alt.delta.recall.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.effects.push(NxFx.shiek.alt.delta.vanish.trigger(this.game, util.vec2.toVec3(this.lastLocation, 0), util.vec3.create()));
  this.markLocation = undefined;
  if(this.locationEffect) { this.locationEffect.destroy(); this.locationEffect = undefined; }
};

PlayerShiekDelta.prototype.mark = function() {
  this.effects.push(NxFx.shiek.alt.delta.mark.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.markLocation = util.vec2.copy(this.pos);
  this.markEffect = NxFx.shiek.alt.delta.location.trigger(this.game, util.vec2.toVec3(this.markLocation, 0), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.markEffect);
};

PlayerShiekDelta.prototype.noMark = function() {
  this.effects.push(NxFx.shiek.alt.delta.no.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerShiekDelta.prototype.taunt = PlayerShiek.prototype.taunt;

PlayerShiekDelta.prototype.setPos = PlayerShiek.prototype.setPos;
PlayerShiekDelta.prototype.setVel = PlayerShiek.prototype.setVel;
PlayerShiekDelta.prototype.setHeight = PlayerShiek.prototype.setHeight;

PlayerShiekDelta.prototype.setLook = PlayerShiek.prototype.setLook;
PlayerShiekDelta.prototype.setSpeed = PlayerShiek.prototype.setSpeed;

PlayerShiekDelta.prototype.getColor = PlayerObject.prototype.getColor;
PlayerShiekDelta.prototype.getDraw = PlayerShiek.prototype.getDraw;

PlayerShiekDelta.prototype.destroy = PlayerShiek.prototype.destroy;

PlayerShiekDelta.prototype.type = PlayerShiek.prototype.type;