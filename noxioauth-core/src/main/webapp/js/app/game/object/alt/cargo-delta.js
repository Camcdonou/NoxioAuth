"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerCargo */

/* Define PlayerCargoDelta Class */
function PlayerCargoDelta(game, oid, pos, team, color) {
  PlayerCargo.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.cargo.delta");
};

PlayerCargoDelta.prototype.update = PlayerCargo.prototype.update;
PlayerCargoDelta.prototype.parseUpd = PlayerCargo.prototype.parseUpd;
PlayerCargoDelta.prototype.effectSwitch = PlayerCargo.prototype.effectSwitch;
PlayerCargoDelta.prototype.timers = PlayerCargo.prototype.timers;
PlayerCargoDelta.prototype.ui = PlayerCargo.prototype.ui;

PlayerCargoDelta.prototype.air  = PlayerCargo.prototype.air;
PlayerCargoDelta.prototype.jump = PlayerCargo.prototype.jump;
PlayerCargoDelta.prototype.land = PlayerCargo.prototype.land;
PlayerCargoDelta.prototype.toss = PlayerObject.prototype.toss;
PlayerCargoDelta.prototype.pickup = PlayerObject.prototype.pickup;

PlayerCargoDelta.prototype.stun = PlayerCargo.prototype.stun;

PlayerCargoDelta.prototype.stunGeneric = PlayerCargo.prototype.stunGeneric;
PlayerCargoDelta.prototype.stunSlash = PlayerCargo.prototype.stunSlash;
PlayerCargoDelta.prototype.stunElectric = PlayerCargo.prototype.stunElectric;
PlayerCargoDelta.prototype.stunFire = PlayerCargo.prototype.stunFire;
PlayerCargoDelta.prototype.criticalHit = PlayerCargo.prototype.criticalHit;
PlayerCargoDelta.prototype.explode = PlayerCargo.prototype.explode;
PlayerCargoDelta.prototype.fall = PlayerCargo.prototype.fall;

PlayerCargoDelta.prototype.charge = function() {
  this.chargeEffect = NxFx.cargo.alt.delta.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.charging = true;
  this.chargeTimer = PlayerCargo.PUNCH_CHARGE_LENGTH;
  this.punchCooldown = PlayerCargo.PUNCH_COOLDOWN_LENGTH;
  this.punchDirection = this.look;
};

PlayerCargoDelta.prototype.punch = function() {
  this.effects.push(NxFx.cargo.alt.delta.punch.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.punchDirection, 0.0)));
  this.charging = false;
};

PlayerCargoDelta.prototype.kick = function() {
  this.kickEffect = NxFx.cargo.alt.delta.kick.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.kickEffect);
  this.kickDirection = this.look;
  this.kickActive = PlayerCargo.KICK_LENGTH;
  this.kickCooldown = PlayerCargo.KICK_COOLDOWN_LENGTH;
};

PlayerCargoDelta.prototype.kicking = PlayerCargo.prototype.kicking;

PlayerCargoDelta.prototype.taunt = PlayerCargo.prototype.taunt;

PlayerCargoDelta.prototype.setPos = PlayerCargo.prototype.setPos;
PlayerCargoDelta.prototype.setVel = PlayerCargo.prototype.setVel;
PlayerCargoDelta.prototype.setHeight = PlayerCargo.prototype.setHeight;

PlayerCargoDelta.prototype.setLook = PlayerCargo.prototype.setLook;
PlayerCargoDelta.prototype.setSpeed = PlayerCargo.prototype.setSpeed;

PlayerCargoDelta.prototype.getColor = PlayerObject.prototype.getColor;
PlayerCargoDelta.prototype.getDraw = PlayerCargo.prototype.getDraw;

PlayerCargoDelta.prototype.destroy = PlayerObject.prototype.destroy;

PlayerCargoDelta.prototype.type = PlayerCargo.prototype.type;
