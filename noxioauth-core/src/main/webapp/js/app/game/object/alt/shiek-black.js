"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerShiek */
/* global NxFx */

/* Define PlayerShiekBlack Class */
function PlayerShiekBlack(game, oid, pos, team, color) {
  PlayerShiek.call(this, game, oid, pos, team, color);
};

PlayerShiekBlack.prototype.update = PlayerShiek.prototype.update;

PlayerShiekBlack.prototype.parseUpd = PlayerShiek.prototype.parseUpd;

PlayerShiekBlack.prototype.effectSwitch = PlayerShiek.prototype.effectSwitch;

PlayerShiekBlack.prototype.timers = PlayerShiek.prototype.timers;

PlayerShiekBlack.prototype.ui = PlayerShiek.prototype.ui;

PlayerShiekBlack.prototype.air  = PlayerShiek.prototype.air;
PlayerShiekBlack.prototype.jump = PlayerShiek.prototype.jump;
PlayerShiekBlack.prototype.land = PlayerShiek.prototype.land;
PlayerShiekBlack.prototype.toss = PlayerObject.prototype.toss;
PlayerShiekBlack.prototype.pickup = PlayerObject.prototype.pickup;

PlayerShiekBlack.prototype.stun = PlayerShiek.prototype.stun;

PlayerShiekBlack.prototype.stunGeneric = PlayerShiek.prototype.stunGeneric;
PlayerShiekBlack.prototype.stunSlash = PlayerShiek.prototype.stunSlash;
PlayerShiekBlack.prototype.stunElectric = PlayerShiek.prototype.stunElectric;
PlayerShiekBlack.prototype.stunFire = PlayerShiek.prototype.stunFire;
PlayerShiekBlack.prototype.criticalHit = PlayerShiek.prototype.criticalHit;
PlayerShiekBlack.prototype.explode = PlayerShiek.prototype.explode;
PlayerShiekBlack.prototype.fall = PlayerShiek.prototype.fall;

PlayerShiekBlack.prototype.blip = function() {
  this.effects.push(NxFx.falco.alt.black.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerShiek.BLIP_POWER_MAX;
};

PlayerShiekBlack.prototype.charge = function() {
  this.chargeEffect = NxFx.shiek.alt.black.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.chargeTimer = PlayerShiek.FLASH_CHARGE_LENGTH;
};

PlayerShiekBlack.prototype.pre = function() {
  this.game.putEffect(NxFx.shiek.alt.black.vanish.trigger(this.game, util.vec2.toVec3(this.pos, 0), util.vec3.create()));
};

PlayerShiekBlack.prototype.recall = function() {
  this.effects.push(NxFx.shiek.alt.black.recall.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.markLocation = undefined;
  if(this.locationEffect) { this.locationEffect.destroy(); this.locationEffect = undefined; }
};

PlayerShiekBlack.prototype.mark = function() {
  this.effects.push(NxFx.shiek.alt.black.mark.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.markLocation = util.vec2.copy(this.pos);
  this.markEffect = NxFx.shiek.alt.black.location.trigger(this.game, util.vec2.toVec3(this.markLocation, 0), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.markEffect);
};

PlayerShiekBlack.prototype.noMark = function() {
  this.effects.push(NxFx.shiek.alt.black.no.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerShiekBlack.prototype.taunt = PlayerShiek.prototype.taunt;

PlayerShiekBlack.prototype.setPos = PlayerShiek.prototype.setPos;
PlayerShiekBlack.prototype.setVel = PlayerShiek.prototype.setVel;
PlayerShiekBlack.prototype.setHeight = PlayerShiek.prototype.setHeight;

PlayerShiekBlack.prototype.setLook = PlayerShiek.prototype.setLook;
PlayerShiekBlack.prototype.setSpeed = PlayerShiek.prototype.setSpeed;

PlayerShiekBlack.prototype.getColor = PlayerObject.prototype.getColor;
PlayerShiekBlack.prototype.getDraw = PlayerShiek.prototype.getDraw;

PlayerShiekBlack.prototype.destroy = PlayerShiek.prototype.destroy;

PlayerShiekBlack.prototype.type = PlayerShiek.prototype.type;