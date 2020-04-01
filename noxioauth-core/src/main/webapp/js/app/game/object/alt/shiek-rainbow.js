"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerShiek */
/* global NxFx */

/* Define PlayerShiekRainbow Class */
function PlayerShiekRainbow(game, oid, pos, team, color) {
  PlayerShiek.call(this, game, oid, pos, team, color);
};

PlayerShiekRainbow.prototype.update = PlayerShiek.prototype.update;

PlayerShiekRainbow.prototype.parseUpd = PlayerShiek.prototype.parseUpd;

PlayerShiekRainbow.prototype.effectSwitch = PlayerShiek.prototype.effectSwitch;

PlayerShiekRainbow.prototype.timers = PlayerShiek.prototype.timers;

PlayerShiekRainbow.prototype.ui = PlayerShiek.prototype.ui;

PlayerShiekRainbow.prototype.air  = PlayerShiek.prototype.air;
PlayerShiekRainbow.prototype.jump = PlayerShiek.prototype.jump;
PlayerShiekRainbow.prototype.land = PlayerShiek.prototype.land;
PlayerShiekRainbow.prototype.toss = PlayerObject.prototype.toss;
PlayerShiekRainbow.prototype.pickup = PlayerObject.prototype.pickup;

PlayerShiekRainbow.prototype.stun = PlayerShiek.prototype.stun;

PlayerShiekRainbow.prototype.stunGeneric = PlayerShiek.prototype.stunGeneric;
PlayerShiekRainbow.prototype.stunSlash = PlayerShiek.prototype.stunSlash;
PlayerShiekRainbow.prototype.stunElectric = PlayerShiek.prototype.stunElectric;
PlayerShiekRainbow.prototype.stunFire = PlayerShiek.prototype.stunFire;
PlayerShiekRainbow.prototype.criticalHit = PlayerShiek.prototype.criticalHit;
PlayerShiekRainbow.prototype.explode = PlayerShiek.prototype.explode;
PlayerShiekRainbow.prototype.fall = PlayerShiek.prototype.fall;

PlayerShiekRainbow.prototype.blip = function() {
  this.effects.push(NxFx.fox.alt.rainbow.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerShiek.BLIP_POWER_MAX;
};

PlayerShiekRainbow.prototype.charge = function() {
  this.chargeEffect = NxFx.shiek.alt.rainbow.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.chargeTimer = PlayerShiek.FLASH_CHARGE_LENGTH;
};

PlayerShiekRainbow.prototype.pre = function() {
  this.game.putEffect(NxFx.shiek.alt.rainbow.vanish.trigger(this.game, util.vec2.toVec3(this.pos, 0), util.vec3.create()));
};

PlayerShiekRainbow.prototype.recall = function() {
  this.effects.push(NxFx.shiek.alt.rainbow.recall.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.markLocation = undefined;
  if(this.locationEffect) { this.locationEffect.destroy(); this.locationEffect = undefined; }
};

PlayerShiekRainbow.prototype.mark = function() {
  this.effects.push(NxFx.shiek.alt.rainbow.mark.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.markLocation = util.vec2.copy(this.pos);
  this.markEffect = NxFx.shiek.alt.rainbow.location.trigger(this.game, util.vec2.toVec3(this.markLocation, 0), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.markEffect);
};

PlayerShiekRainbow.prototype.noMark = function() {
  this.effects.push(NxFx.shiek.alt.rainbow.no.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerShiekRainbow.prototype.taunt = PlayerShiek.prototype.taunt;

PlayerShiekRainbow.prototype.setPos = PlayerShiek.prototype.setPos;
PlayerShiekRainbow.prototype.setVel = PlayerShiek.prototype.setVel;
PlayerShiekRainbow.prototype.setHeight = PlayerShiek.prototype.setHeight;

PlayerShiekRainbow.prototype.setLook = PlayerShiek.prototype.setLook;
PlayerShiekRainbow.prototype.setSpeed = PlayerShiek.prototype.setSpeed;

PlayerShiekRainbow.prototype.getColor = PlayerObject.prototype.getColor;
PlayerShiekRainbow.prototype.getDraw = PlayerShiek.prototype.getDraw;

PlayerShiekRainbow.prototype.destroy = PlayerShiek.prototype.destroy;

PlayerShiekRainbow.prototype.type = PlayerShiek.prototype.type;