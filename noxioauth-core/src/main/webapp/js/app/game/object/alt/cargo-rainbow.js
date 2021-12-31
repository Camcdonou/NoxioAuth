"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerCargo */

/* Define PlayerCargoRainbow Class */
function PlayerCargoRainbow(game, oid, pos, team, color) {
  PlayerCargo.call(this, game, oid, pos, team, color);
};

PlayerCargoRainbow.prototype.update = PlayerCargo.prototype.update;
PlayerCargoRainbow.prototype.parseUpd = PlayerCargo.prototype.parseUpd;
PlayerCargoRainbow.prototype.effectSwitch = PlayerCargo.prototype.effectSwitch;
PlayerCargoRainbow.prototype.timers = PlayerCargo.prototype.timers;
PlayerCargoRainbow.prototype.ui = PlayerCargo.prototype.ui;

PlayerCargoRainbow.prototype.air  = PlayerCargo.prototype.air;
PlayerCargoRainbow.prototype.jump = PlayerCargo.prototype.jump;
PlayerCargoRainbow.prototype.recover = PlayerObject.prototype.recover;
PlayerCargoRainbow.prototype.recoverJump = PlayerObject.prototype.recoverJump;
PlayerCargoRainbow.prototype.land = PlayerCargo.prototype.land;
PlayerCargoRainbow.prototype.toss = PlayerObject.prototype.toss;
PlayerCargoRainbow.prototype.pickup = PlayerObject.prototype.pickup;

PlayerCargoRainbow.prototype.stun = PlayerCargo.prototype.stun;

PlayerCargoRainbow.prototype.stunGeneric = PlayerCargo.prototype.stunGeneric;
PlayerCargoRainbow.prototype.stunSlash = PlayerCargo.prototype.stunSlash;
PlayerCargoRainbow.prototype.stunElectric = PlayerCargo.prototype.stunElectric;
PlayerCargoRainbow.prototype.stunFire = PlayerCargo.prototype.stunFire;
PlayerCargoRainbow.prototype.criticalHit = PlayerCargo.prototype.criticalHit;
PlayerCargoRainbow.prototype.explode = PlayerCargo.prototype.explode;
PlayerCargoRainbow.prototype.fall = PlayerCargo.prototype.fall;

PlayerCargoRainbow.prototype.charge = function() {
  this.chargeEffect = NxFx.cargo.alt.rainbow.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.charging = true;
  this.chargeTimer = PlayerCargo.PUNCH_CHARGE_LENGTH;
  this.punchCooldown = PlayerCargo.PUNCH_COOLDOWN_LENGTH;
  this.punchDirection = this.look;
};

PlayerCargoRainbow.prototype.punch = function() {
  this.effects.push(NxFx.cargo.alt.rainbow.punch.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.punchDirection, 0.0)));
  this.charging = false;
};

PlayerCargoRainbow.prototype.kick = function() {
  this.kickEffect = NxFx.cargo.alt.rainbow.kick.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.kickEffect);
  this.kickDirection = this.look;
  this.kickActive = PlayerCargo.KICK_LENGTH;
  this.kickCooldown = PlayerCargo.KICK_COOLDOWN_LENGTH;
};

PlayerCargoRainbow.prototype.kicking = PlayerCargo.prototype.kicking;

PlayerCargoRainbow.prototype.taunt = PlayerCargo.prototype.taunt;

PlayerCargoRainbow.prototype.setPos = PlayerCargo.prototype.setPos;
PlayerCargoRainbow.prototype.setVel = PlayerCargo.prototype.setVel;
PlayerCargoRainbow.prototype.setHeight = PlayerCargo.prototype.setHeight;

PlayerCargoRainbow.prototype.setLook = PlayerCargo.prototype.setLook;
PlayerCargoRainbow.prototype.setSpeed = PlayerCargo.prototype.setSpeed;

PlayerCargoRainbow.prototype.getColor = PlayerObject.prototype.getColor;
PlayerCargoRainbow.prototype.getDraw = PlayerCargo.prototype.getDraw;

PlayerCargoRainbow.prototype.destroy = PlayerObject.prototype.destroy;

PlayerCargoRainbow.prototype.type = PlayerCargo.prototype.type;
