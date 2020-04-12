"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerCrate */
/* global NxFx */

/* Define PlayerCrate Class */
function PlayerCrateRainbow(game, oid, pos, team, color) {
  PlayerCrate.call(this, game, oid, pos, team, color);
};

PlayerCrateRainbow.prototype.update = PlayerCrate.prototype.update;
PlayerCrateRainbow.prototype.parseUpd = PlayerCrate.prototype.parseUpd;

PlayerCrateRainbow.prototype.effectSwitch = PlayerCrate.prototype.effectSwitch;

PlayerCrateRainbow.prototype.timers = PlayerCrate.prototype.timers;

PlayerCrateRainbow.prototype.ui = PlayerCrate.prototype.ui;

PlayerCrateRainbow.prototype.air  = PlayerCrate.prototype.air;
PlayerCrateRainbow.prototype.jump = PlayerCrate.prototype.jump;
PlayerCrateRainbow.prototype.land = PlayerCrate.prototype.land;
PlayerCrateRainbow.prototype.toss = PlayerObject.prototype.toss;
PlayerCrateRainbow.prototype.pickup = PlayerObject.prototype.pickup;

PlayerCrateRainbow.prototype.stun = PlayerCrate.prototype.stun;

PlayerCrateRainbow.prototype.stunGeneric = PlayerCrate.prototype.stunGeneric;
PlayerCrateRainbow.prototype.stunSlash = PlayerCrate.prototype.stunSlash;
PlayerCrateRainbow.prototype.stunElectric = PlayerCrate.prototype.stunElectric;
PlayerCrateRainbow.prototype.stunFire = PlayerCrate.prototype.stunFire;
PlayerCrateRainbow.prototype.criticalHit = PlayerCrate.prototype.criticalHit;
PlayerCrateRainbow.prototype.explode = PlayerCrate.prototype.explode;
PlayerCrateRainbow.prototype.fall = PlayerCrate.prototype.fall;

PlayerCrateRainbow.prototype.blip = function() {
  this.effects.push(NxFx.box.alt.rainbow.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerCrate.BLIP_POWER_MAX;
};

PlayerCrateRainbow.prototype.dash = function() {
  this.effects.push(NxFx.crate.alt.rainbow.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  if(this.chargeEffect && this.chargeEffect.particles[0]) { this.chargeEffect.particles[0].attachment = false; }
};

PlayerCrateRainbow.prototype.charge = function() {
  this.chargeEffect = NxFx.crate.alt.rainbow.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.channelTimer = PlayerCrate.CHARGE_TIME_LENGTH;
  this.dashCooldown = PlayerCrate.DASH_COOLDOWN_LENGTH;
};

PlayerCrateRainbow.prototype.taunt = PlayerCrate.prototype.taunt;

PlayerCrateRainbow.prototype.setPos = PlayerCrate.prototype.setPos;
PlayerCrateRainbow.prototype.setVel = PlayerCrate.prototype.setVel;
PlayerCrateRainbow.prototype.setHeight = PlayerCrate.prototype.setHeight;

PlayerCrateRainbow.prototype.setLook = PlayerCrate.prototype.setLook;
PlayerCrateRainbow.prototype.setSpeed = PlayerCrate.prototype.setSpeed;

PlayerCrateRainbow.prototype.getColor = PlayerObject.prototype.getColor;
PlayerCrateRainbow.prototype.getDraw = PlayerCrate.prototype.getDraw;

PlayerCrateRainbow.prototype.destroy = PlayerCrate.prototype.destroy;

PlayerCrateRainbow.prototype.type = PlayerCrate.prototype.type;
