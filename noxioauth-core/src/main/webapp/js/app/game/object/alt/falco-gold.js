"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerFalco */
/* global NxFx */

/* Define PlayerFalcoGold Class */
function PlayerFalcoGold(game, oid, pos, team, color) {
  PlayerFalco.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.falco.gold");
};

/* Constants */
PlayerFalcoGold.prototype.update = PlayerFalco.prototype.update;
PlayerFalcoGold.prototype.parseUpd = PlayerFalco.prototype.parseUpd;

PlayerFalcoGold.prototype.effectSwitch = PlayerFalco.prototype.effectSwitch;

PlayerFalcoGold.prototype.timers = PlayerFalco.prototype.timers;

PlayerFalcoGold.prototype.ui = PlayerFalco.prototype.ui;

PlayerFalcoGold.prototype.air  = PlayerFalco.prototype.air;
PlayerFalcoGold.prototype.jump = PlayerFalco.prototype.jump;
PlayerFalcoGold.prototype.land = PlayerFalco.prototype.land;
PlayerFalcoGold.prototype.toss = PlayerObject.prototype.toss;
PlayerFalcoGold.prototype.pickup = PlayerObject.prototype.pickup;

PlayerFalcoGold.prototype.stun = PlayerFalco.prototype.stun;

PlayerFalcoGold.prototype.stunGeneric = PlayerFalco.prototype.stunGeneric;
PlayerFalcoGold.prototype.stunSlash = PlayerFalco.prototype.stunSlash;
PlayerFalcoGold.prototype.stunElectric = PlayerFalco.prototype.stunElectric;
PlayerFalcoGold.prototype.stunFire = PlayerFalco.prototype.stunFire;
PlayerFalcoGold.prototype.criticalHit = PlayerFalco.prototype.criticalHit;
PlayerFalcoGold.prototype.explode = PlayerFalco.prototype.explode;
PlayerFalcoGold.prototype.fall = PlayerFalco.prototype.fall;

PlayerFalcoGold.prototype.blip = function() {
  this.effects.push(NxFx.fox.alt.gold.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerFalco.BLIP_POWER_MAX;
};

PlayerFalcoGold.prototype.dash = function() {
  this.effects.push(NxFx.falco.alt.gold.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  if(this.chargeEffect && this.chargeEffect.particles[0]) { this.chargeEffect.particles[0].attachment = false; }
};

PlayerFalcoGold.prototype.charge = function() {
  this.chargeEffect = NxFx.falco.alt.gold.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.channelTimer = PlayerFalco.CHARGE_TIME_LENGTH;
  this.dashCooldown = PlayerFalco.DASH_COOLDOWN_LENGTH;
};

PlayerFalcoGold.prototype.taunt = PlayerFalco.prototype.taunt;

PlayerFalcoGold.prototype.setPos = PlayerFalco.prototype.setPos;
PlayerFalcoGold.prototype.setVel = PlayerFalco.prototype.setVel;
PlayerFalcoGold.prototype.setHeight = PlayerFalco.prototype.setHeight;

PlayerFalcoGold.prototype.setLook = PlayerFalco.prototype.setLook;
PlayerFalcoGold.prototype.setSpeed = PlayerFalco.prototype.setSpeed;

PlayerFalcoGold.prototype.getColor = PlayerObject.prototype.getColor;
PlayerFalcoGold.prototype.getDraw = PlayerFalco.prototype.getDraw;

PlayerFalcoGold.prototype.destroy = PlayerFalco.prototype.destroy;

PlayerFalcoGold.prototype.type = PlayerFalco.prototype.type;
