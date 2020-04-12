"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerCrate */
/* global NxFx */

/* Define PlayerCrateGold Class */
function PlayerCrateGold(game, oid, pos, team, color) {
  PlayerCrate.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.crate.gold");
};

/* Constants */
PlayerCrateGold.prototype.update = PlayerCrate.prototype.update;
PlayerCrateGold.prototype.parseUpd = PlayerCrate.prototype.parseUpd;

PlayerCrateGold.prototype.effectSwitch = PlayerCrate.prototype.effectSwitch;

PlayerCrateGold.prototype.timers = PlayerCrate.prototype.timers;

PlayerCrateGold.prototype.ui = PlayerCrate.prototype.ui;

PlayerCrateGold.prototype.air  = PlayerCrate.prototype.air;
PlayerCrateGold.prototype.jump = PlayerCrate.prototype.jump;
PlayerCrateGold.prototype.land = PlayerCrate.prototype.land;
PlayerCrateGold.prototype.toss = PlayerObject.prototype.toss;
PlayerCrateGold.prototype.pickup = PlayerObject.prototype.pickup;

PlayerCrateGold.prototype.stun = PlayerCrate.prototype.stun;

PlayerCrateGold.prototype.stunGeneric = PlayerCrate.prototype.stunGeneric;
PlayerCrateGold.prototype.stunSlash = PlayerCrate.prototype.stunSlash;
PlayerCrateGold.prototype.stunElectric = PlayerCrate.prototype.stunElectric;
PlayerCrateGold.prototype.stunFire = PlayerCrate.prototype.stunFire;
PlayerCrateGold.prototype.criticalHit = PlayerCrate.prototype.criticalHit;
PlayerCrateGold.prototype.explode = PlayerCrate.prototype.explode;
PlayerCrateGold.prototype.fall = PlayerCrate.prototype.fall;

PlayerCrateGold.prototype.blip = function() {
  this.effects.push(NxFx.box.alt.gold.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerCrate.BLIP_POWER_MAX;
};

PlayerCrateGold.prototype.dash = function() {
  this.effects.push(NxFx.crate.alt.gold.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  if(this.chargeEffect && this.chargeEffect.particles[0]) { this.chargeEffect.particles[0].attachment = false; }
};

PlayerCrateGold.prototype.charge = function() {
  this.chargeEffect = NxFx.crate.alt.gold.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.channelTimer = PlayerCrate.CHARGE_TIME_LENGTH;
  this.dashCooldown = PlayerCrate.DASH_COOLDOWN_LENGTH;
};

PlayerCrateGold.prototype.taunt = PlayerCrate.prototype.taunt;

PlayerCrateGold.prototype.setPos = PlayerCrate.prototype.setPos;
PlayerCrateGold.prototype.setVel = PlayerCrate.prototype.setVel;
PlayerCrateGold.prototype.setHeight = PlayerCrate.prototype.setHeight;

PlayerCrateGold.prototype.setLook = PlayerCrate.prototype.setLook;
PlayerCrateGold.prototype.setSpeed = PlayerCrate.prototype.setSpeed;

PlayerCrateGold.prototype.getColor = PlayerObject.prototype.getColor;
PlayerCrateGold.prototype.getDraw = PlayerCrate.prototype.getDraw;

PlayerCrateGold.prototype.destroy = PlayerCrate.prototype.destroy;

PlayerCrateGold.prototype.type = PlayerCrate.prototype.type;
