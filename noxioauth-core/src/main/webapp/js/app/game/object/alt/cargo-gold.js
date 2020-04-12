"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerCargo */

/* Define PlayerCargoGold Class */
function PlayerCargoGold(game, oid, pos, team, color) {
  PlayerCargo.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.cargo.gold");
};

PlayerCargoGold.prototype.update = PlayerCargo.prototype.update;
PlayerCargoGold.prototype.parseUpd = PlayerCargo.prototype.parseUpd;
PlayerCargoGold.prototype.effectSwitch = PlayerCargo.prototype.effectSwitch;
PlayerCargoGold.prototype.timers = PlayerCargo.prototype.timers;
PlayerCargoGold.prototype.ui = PlayerCargo.prototype.ui;

PlayerCargoGold.prototype.air  = PlayerCargo.prototype.air;
PlayerCargoGold.prototype.jump = PlayerCargo.prototype.jump;
PlayerCargoGold.prototype.land = PlayerCargo.prototype.land;
PlayerCargoGold.prototype.toss = PlayerObject.prototype.toss;
PlayerCargoGold.prototype.pickup = PlayerObject.prototype.pickup;

PlayerCargoGold.prototype.stun = PlayerCargo.prototype.stun;

PlayerCargoGold.prototype.stunGeneric = PlayerCargo.prototype.stunGeneric;
PlayerCargoGold.prototype.stunSlash = PlayerCargo.prototype.stunSlash;
PlayerCargoGold.prototype.stunElectric = PlayerCargo.prototype.stunElectric;
PlayerCargoGold.prototype.stunFire = PlayerCargo.prototype.stunFire;
PlayerCargoGold.prototype.criticalHit = PlayerCargo.prototype.criticalHit;
PlayerCargoGold.prototype.explode = PlayerCargo.prototype.explode;
PlayerCargoGold.prototype.fall = PlayerCargo.prototype.fall;

PlayerCargoGold.prototype.charge = function() {
  this.chargeEffect = NxFx.cargo.alt.gold.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.charging = true;
  this.chargeTimer = PlayerCargo.PUNCH_CHARGE_LENGTH;
  this.punchCooldown = PlayerCargo.PUNCH_COOLDOWN_LENGTH;
  this.punchDirection = this.look;
};

PlayerCargoGold.prototype.punch = function() {
  this.effects.push(NxFx.cargo.alt.gold.punch.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.punchDirection, 0.0)));
  this.charging = false;
};

PlayerCargoGold.prototype.kick = function() {
  this.kickEffect = NxFx.cargo.alt.gold.kick.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.kickEffect);
  this.kickDirection = this.look;
  this.kickActive = PlayerCargo.KICK_LENGTH;
  this.kickCooldown = PlayerCargo.KICK_COOLDOWN_LENGTH;
};

PlayerCargoGold.prototype.kicking = PlayerCargo.prototype.kicking;

PlayerCargoGold.prototype.taunt = PlayerCargo.prototype.taunt;

PlayerCargoGold.prototype.setPos = PlayerCargo.prototype.setPos;
PlayerCargoGold.prototype.setVel = PlayerCargo.prototype.setVel;
PlayerCargoGold.prototype.setHeight = PlayerCargo.prototype.setHeight;

PlayerCargoGold.prototype.setLook = PlayerCargo.prototype.setLook;
PlayerCargoGold.prototype.setSpeed = PlayerCargo.prototype.setSpeed;

PlayerCargoGold.prototype.getColor = PlayerObject.prototype.getColor;
PlayerCargoGold.prototype.getDraw = PlayerCargo.prototype.getDraw;

PlayerCargoGold.prototype.destroy = PlayerObject.prototype.destroy;

PlayerCargoGold.prototype.type = PlayerCargo.prototype.type;
