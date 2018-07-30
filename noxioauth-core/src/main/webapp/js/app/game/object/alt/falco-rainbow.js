"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerFalco */
/* global NxFx */

/* Define PlayerFalco Class */
function PlayerFalcoRainbow(game, oid, pos, team, color) {
  PlayerFalco.call(this, game, oid, pos, team, color);
};

PlayerFalcoRainbow.prototype.update = PlayerFalco.prototype.update;
PlayerFalcoRainbow.prototype.parseUpd = PlayerFalco.prototype.parseUpd;

PlayerFalcoRainbow.prototype.effectSwitch = PlayerFalco.prototype.effectSwitch;

PlayerFalcoRainbow.prototype.timers = PlayerFalco.prototype.timers;

PlayerFalcoRainbow.prototype.ui = PlayerFalco.prototype.ui;

PlayerFalcoRainbow.prototype.air  = PlayerFalco.prototype.air;
PlayerFalcoRainbow.prototype.jump = PlayerFalco.prototype.jump;
PlayerFalcoRainbow.prototype.land = PlayerFalco.prototype.land;

PlayerFalcoRainbow.prototype.stun = PlayerFalco.prototype.stun;

PlayerFalcoRainbow.prototype.stunGeneric = PlayerFalco.prototype.stunGeneric;
PlayerFalcoRainbow.prototype.stunSlash = PlayerFalco.prototype.stunSlash;
PlayerFalcoRainbow.prototype.stunElectric = PlayerFalco.prototype.stunElectric;
PlayerFalcoRainbow.prototype.stunFire = PlayerFalco.prototype.stunFire;
PlayerFalcoRainbow.prototype.criticalHit = PlayerFalco.prototype.criticalHit;
PlayerFalcoRainbow.prototype.explode = PlayerFalco.prototype.explode;
PlayerFalcoRainbow.prototype.fall = PlayerFalco.prototype.fall;

PlayerFalcoRainbow.prototype.blip = function() {
  this.effects.push(NxFx.fox.alt.rainbow.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerFalco.BLIP_POWER_MAX;
};

PlayerFalcoRainbow.prototype.dash = function() {
  this.effects.push(NxFx.falco.alt.rainbow.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  if(this.chargeEffect && this.chargeEffect.particles[0]) { this.chargeEffect.particles[0].attachment = false; }
};

PlayerFalcoRainbow.prototype.charge = function() {
  this.chargeEffect = NxFx.falco.alt.rainbow.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.channelTimer = PlayerFalco.CHARGE_TIME_LENGTH;
  this.dashCooldown = PlayerFalco.DASH_COOLDOWN_LENGTH;
};

PlayerFalcoRainbow.prototype.taunt = PlayerFalco.prototype.taunt;

PlayerFalcoRainbow.prototype.setPos = PlayerFalco.prototype.setPos;
PlayerFalcoRainbow.prototype.setVel = PlayerFalco.prototype.setVel;
PlayerFalcoRainbow.prototype.setHeight = PlayerFalco.prototype.setHeight;

PlayerFalcoRainbow.prototype.setLook = PlayerFalco.prototype.setLook;
PlayerFalcoRainbow.prototype.setSpeed = PlayerFalco.prototype.setSpeed;
PlayerFalcoRainbow.prototype.getDraw = PlayerFalco.prototype.getDraw;

PlayerFalcoRainbow.prototype.destroy = PlayerFalco.prototype.destroy;

PlayerFalcoRainbow.prototype.type = PlayerFalco.prototype.type;
