"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerCrate */
/* global NxFx */

/* Define PlayerCrateDelta Class */
function PlayerCrateDelta(game, oid, pos, team, color) {
  PlayerCrate.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.crate.delta");
};

/* Constants */
PlayerCrateDelta.prototype.update = PlayerCrate.prototype.update;
PlayerCrateDelta.prototype.parseUpd = PlayerCrate.prototype.parseUpd;

PlayerCrateDelta.prototype.effectSwitch = PlayerCrate.prototype.effectSwitch;

PlayerCrateDelta.prototype.timers = PlayerCrate.prototype.timers;

PlayerCrateDelta.prototype.ui = PlayerCrate.prototype.ui;

PlayerCrateDelta.prototype.air  = PlayerCrate.prototype.air;
PlayerCrateDelta.prototype.jump = PlayerCrate.prototype.jump;
PlayerCrateDelta.prototype.recover = PlayerObject.prototype.recover;
PlayerCrateDelta.prototype.recoverJump = PlayerObject.prototype.recoverJump;
PlayerCrateDelta.prototype.land = PlayerCrate.prototype.land;
PlayerCrateDelta.prototype.toss = PlayerObject.prototype.toss;
PlayerCrateDelta.prototype.pickup = PlayerObject.prototype.pickup;

PlayerCrateDelta.prototype.stun = PlayerCrate.prototype.stun;

PlayerCrateDelta.prototype.stunGeneric = PlayerCrate.prototype.stunGeneric;
PlayerCrateDelta.prototype.stunSlash = PlayerCrate.prototype.stunSlash;
PlayerCrateDelta.prototype.stunElectric = PlayerCrate.prototype.stunElectric;
PlayerCrateDelta.prototype.stunFire = PlayerCrate.prototype.stunFire;
PlayerCrateDelta.prototype.criticalHit = PlayerCrate.prototype.criticalHit;
PlayerCrateDelta.prototype.explode = PlayerCrate.prototype.explode;
PlayerCrateDelta.prototype.fall = PlayerCrate.prototype.fall;

PlayerCrateDelta.prototype.blip = function() {
  this.effects.push(NxFx.box.alt.delta.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerCrate.BLIP_POWER_MAX;
};

PlayerCrateDelta.prototype.dash = function() {
  this.effects.push(NxFx.crate.alt.delta.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  if(this.chargeEffect && this.chargeEffect.particles[0]) { this.chargeEffect.particles[0].attachment = false; }
};

PlayerCrateDelta.prototype.charge = function() {
  this.chargeEffect = NxFx.crate.alt.delta.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.channelTimer = PlayerCrate.CHARGE_TIME_LENGTH;
  this.dashCooldown = PlayerCrate.DASH_COOLDOWN_LENGTH;
};

PlayerCrateDelta.prototype.taunt = PlayerCrate.prototype.taunt;

PlayerCrateDelta.prototype.setPos = PlayerCrate.prototype.setPos;
PlayerCrateDelta.prototype.setVel = PlayerCrate.prototype.setVel;
PlayerCrateDelta.prototype.setHeight = PlayerCrate.prototype.setHeight;

PlayerCrateDelta.prototype.setLook = PlayerCrate.prototype.setLook;
PlayerCrateDelta.prototype.setSpeed = PlayerCrate.prototype.setSpeed;

PlayerCrateDelta.prototype.getColor = PlayerObject.prototype.getColor;
PlayerCrateDelta.prototype.getDraw = PlayerCrate.prototype.getDraw;

PlayerCrateDelta.prototype.destroy = PlayerCrate.prototype.destroy;

PlayerCrateDelta.prototype.type = PlayerCrate.prototype.type;
