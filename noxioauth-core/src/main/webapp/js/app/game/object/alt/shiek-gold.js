"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerShiek */
/* global NxFx */

/* Define PlayerShiekGold Class */
function PlayerShiekGold(game, oid, pos, team, color) {
  PlayerShiek.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.shiek.gold");
};

PlayerShiekGold.prototype.update = PlayerShiek.prototype.update;

PlayerShiekGold.prototype.parseUpd = PlayerShiek.prototype.parseUpd;

PlayerShiekGold.prototype.effectSwitch = PlayerShiek.prototype.effectSwitch;

PlayerShiekGold.prototype.timers = PlayerShiek.prototype.timers;

PlayerShiekGold.prototype.ui = PlayerShiek.prototype.ui;

PlayerShiekGold.prototype.air  = PlayerShiek.prototype.air;
PlayerShiekGold.prototype.jump = PlayerShiek.prototype.jump;
PlayerShiekGold.prototype.land = PlayerShiek.prototype.land;

PlayerShiekGold.prototype.stun = PlayerShiek.prototype.stun;

PlayerShiekGold.prototype.stunGeneric = PlayerShiek.prototype.stunGeneric;
PlayerShiekGold.prototype.stunSlash = PlayerShiek.prototype.stunSlash;
PlayerShiekGold.prototype.stunElectric = PlayerShiek.prototype.stunElectric;
PlayerShiekGold.prototype.stunFire = PlayerShiek.prototype.stunFire;
PlayerShiekGold.prototype.criticalHit = PlayerShiek.prototype.criticalHit;
PlayerShiekGold.prototype.explode = PlayerShiek.prototype.explode;
PlayerShiekGold.prototype.fall = PlayerShiek.prototype.fall;

PlayerShiekGold.prototype.blip = function() {
  this.effects.push(NxFx.fox.alt.gold.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerShiek.BLIP_POWER_MAX;
};

PlayerShiekGold.prototype.charge = function() {
  this.chargeEffect = NxFx.shiek.alt.gold.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.chargeTimer = PlayerShiek.FLASH_CHARGE_LENGTH;
};

PlayerShiekGold.prototype.recall = function() {
  this.effects.push(NxFx.shiek.alt.gold.recall.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.effects.push(NxFx.shiek.alt.gold.vanish.trigger(this.game, util.vec2.toVec3(this.lastLocation, 0), util.vec3.create()));
  this.markLocation = undefined;
  if(this.locationEffect) { this.locationEffect.destroy(); this.locationEffect = undefined; }
};

PlayerShiekGold.prototype.mark = function() {
  this.effects.push(NxFx.shiek.alt.gold.mark.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.markLocation = util.vec2.copy(this.pos);
  this.markEffect = NxFx.shiek.alt.gold.location.trigger(this.game, util.vec2.toVec3(this.markLocation, 0), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.markEffect);
};

PlayerShiekGold.prototype.noMark = function() {
  this.effects.push(NxFx.shiek.alt.gold.no.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerShiekGold.prototype.taunt = PlayerShiek.prototype.taunt;

PlayerShiekGold.prototype.setPos = PlayerShiek.prototype.setPos;
PlayerShiekGold.prototype.setVel = PlayerShiek.prototype.setVel;
PlayerShiekGold.prototype.setHeight = PlayerShiek.prototype.setHeight;

PlayerShiekGold.prototype.setLook = PlayerShiek.prototype.setLook;
PlayerShiekGold.prototype.setSpeed = PlayerShiek.prototype.setSpeed;
PlayerShiekGold.prototype.getDraw = PlayerShiek.prototype.getDraw;

PlayerShiekGold.prototype.destroy = PlayerShiek.prototype.destroy;

PlayerShiekGold.prototype.type = PlayerShiek.prototype.type;