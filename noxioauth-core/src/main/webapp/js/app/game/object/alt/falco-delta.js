"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerFalco */
/* global NxFx */

/* Define PlayerFalcoDelta Class */
function PlayerFalcoDelta(game, oid, pos, team, color) {
  PlayerFalco.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.falco.delta");
};

/* Constants */
PlayerFalcoDelta.prototype.update = PlayerFalco.prototype.update;
PlayerFalcoDelta.prototype.parseUpd = PlayerFalco.prototype.parseUpd;

PlayerFalcoDelta.prototype.effectSwitch = PlayerFalco.prototype.effectSwitch;

PlayerFalcoDelta.prototype.timers = PlayerFalco.prototype.timers;

PlayerFalcoDelta.prototype.ui = PlayerFalco.prototype.ui;

PlayerFalcoDelta.prototype.air  = PlayerFalco.prototype.air;
PlayerFalcoDelta.prototype.jump = PlayerFalco.prototype.jump;
PlayerFalcoDelta.prototype.land = PlayerFalco.prototype.land;
PlayerFalcoDelta.prototype.toss = PlayerObject.prototype.toss;
PlayerFalcoDelta.prototype.pickup = PlayerObject.prototype.pickup;

PlayerFalcoDelta.prototype.stun = PlayerFalco.prototype.stun;

PlayerFalcoDelta.prototype.stunGeneric = PlayerFalco.prototype.stunGeneric;
PlayerFalcoDelta.prototype.stunSlash = PlayerFalco.prototype.stunSlash;
PlayerFalcoDelta.prototype.stunElectric = PlayerFalco.prototype.stunElectric;
PlayerFalcoDelta.prototype.stunFire = PlayerFalco.prototype.stunFire;
PlayerFalcoDelta.prototype.criticalHit = PlayerFalco.prototype.criticalHit;
PlayerFalcoDelta.prototype.explode = PlayerFalco.prototype.explode;
PlayerFalcoDelta.prototype.fall = PlayerFalco.prototype.fall;

PlayerFalcoDelta.prototype.blip = function() {
  this.effects.push(NxFx.fox.alt.delta.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerFalco.BLIP_POWER_MAX;
};

PlayerFalcoDelta.prototype.dash = function() {
  this.effects.push(NxFx.falco.alt.delta.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  if(this.chargeEffect && this.chargeEffect.particles[0]) { this.chargeEffect.particles[0].attachment = false; }
};

PlayerFalcoDelta.prototype.charge = function() {
  this.chargeEffect = NxFx.falco.alt.delta.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.channelTimer = PlayerFalco.CHARGE_TIME_LENGTH;
  this.dashCooldown = PlayerFalco.DASH_COOLDOWN_LENGTH;
};

PlayerFalcoDelta.prototype.taunt = PlayerFalco.prototype.taunt;

PlayerFalcoDelta.prototype.setPos = PlayerFalco.prototype.setPos;
PlayerFalcoDelta.prototype.setVel = PlayerFalco.prototype.setVel;
PlayerFalcoDelta.prototype.setHeight = PlayerFalco.prototype.setHeight;

PlayerFalcoDelta.prototype.setLook = PlayerFalco.prototype.setLook;
PlayerFalcoDelta.prototype.setSpeed = PlayerFalco.prototype.setSpeed;

PlayerFalcoDelta.prototype.getColor = PlayerObject.prototype.getColor;
PlayerFalcoDelta.prototype.getDraw = PlayerFalco.prototype.getDraw;

PlayerFalcoDelta.prototype.destroy = PlayerFalco.prototype.destroy;

PlayerFalcoDelta.prototype.type = PlayerFalco.prototype.type;
