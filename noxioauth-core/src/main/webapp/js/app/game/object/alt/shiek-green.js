"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerShiek */
/* global NxFx */

/* Define PlayerShiekGreen Class */
function PlayerShiekGreen(game, oid, pos, team, color) {
  PlayerShiek.call(this, game, oid, pos, team, color);
};

/* Constants */
PlayerShiekGreen.BLIP_COLOR_A = util.vec4.lerp(util.vec4.make(0.6, 1.0, 0.6, 1.0), util.vec4.make(1,1,1,1), 0.5);
PlayerShiekGreen.BLIP_COLOR_B = util.vec4.make(0.4, 1.0, 0.4, 1.0);

PlayerShiekGreen.prototype.update = PlayerShiek.prototype.update;

PlayerShiekGreen.prototype.parseUpd = PlayerShiek.prototype.parseUpd;

PlayerShiekGreen.prototype.effectSwitch = PlayerShiek.prototype.effectSwitch;

PlayerShiekGreen.prototype.timers = PlayerShiek.prototype.timers;

PlayerShiekGreen.prototype.ui = PlayerShiek.prototype.ui;

PlayerShiekGreen.prototype.air  = PlayerShiek.prototype.air;
PlayerShiekGreen.prototype.jump = PlayerShiek.prototype.jump;
PlayerShiekGreen.prototype.land = PlayerShiek.prototype.land;

PlayerShiekGreen.prototype.stun = PlayerShiek.prototype.stun;

PlayerShiekGreen.prototype.stunGeneric = PlayerShiek.prototype.stunGeneric;
PlayerShiekGreen.prototype.stunSlash = PlayerShiek.prototype.stunSlash;
PlayerShiekGreen.prototype.stunElectric = PlayerShiek.prototype.stunElectric;
PlayerShiekGreen.prototype.stunFire = PlayerShiek.prototype.stunFire;
PlayerShiekGreen.prototype.criticalHit = PlayerShiek.prototype.criticalHit;
PlayerShiekGreen.prototype.explode = PlayerShiek.prototype.explode;
PlayerShiekGreen.prototype.fall = PlayerShiek.prototype.fall;

PlayerShiekGreen.prototype.blip = function() {
  this.effects.push(NxFx.shiek.alt.green.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerShiek.BLIP_POWER_MAX;
};

PlayerShiekGreen.prototype.charge = function() {
  this.chargeEffect = NxFx.shiek.alt.green.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.chargeTimer = PlayerShiek.FLASH_CHARGE_LENGTH;
};

PlayerShiekGreen.prototype.pre = function() {
  this.game.putEffect(NxFx.shiek.alt.green.vanish.trigger(this.game, util.vec2.toVec3(this.pos, 0), util.vec3.create()));
};

PlayerShiekGreen.prototype.recall = function() {
  this.effects.push(NxFx.shiek.alt.green.recall.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.markLocation = undefined;
  if(this.locationEffect) { this.locationEffect.destroy(); this.locationEffect = undefined; }
};

PlayerShiekGreen.prototype.mark = function() {
  this.effects.push(NxFx.shiek.alt.green.mark.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.markLocation = util.vec2.copy(this.pos);
  this.markEffect = NxFx.shiek.alt.green.location.trigger(this.game, util.vec2.toVec3(this.markLocation, 0), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.markEffect);
};

PlayerShiekGreen.prototype.noMark = function() {
  this.effects.push(NxFx.shiek.alt.green.no.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerShiekGreen.prototype.taunt = PlayerShiek.prototype.taunt;

PlayerShiekGreen.prototype.setPos = PlayerShiek.prototype.setPos;
PlayerShiekGreen.prototype.setVel = PlayerShiek.prototype.setVel;
PlayerShiekGreen.prototype.setHeight = PlayerShiek.prototype.setHeight;

PlayerShiekGreen.prototype.setLook = PlayerShiek.prototype.setLook;
PlayerShiekGreen.prototype.setSpeed = PlayerShiek.prototype.setSpeed;

PlayerShiekGreen.prototype.getColor = PlayerObject.prototype.getColor;
PlayerShiekGreen.prototype.getDraw = PlayerShiek.prototype.getDraw;

PlayerShiekGreen.prototype.destroy = PlayerShiek.prototype.destroy;

PlayerShiekGreen.prototype.type = PlayerShiek.prototype.type;