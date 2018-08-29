"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerCaptain */

/* Define PlayerCaptainDelta Class */
function PlayerCaptainDelta(game, oid, pos, team, color) {
  PlayerCaptain.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.captain.delta");
};

PlayerCaptainDelta.prototype.update = PlayerCaptain.prototype.update;
PlayerCaptainDelta.prototype.parseUpd = PlayerCaptain.prototype.parseUpd;
PlayerCaptainDelta.prototype.effectSwitch = PlayerCaptain.prototype.effectSwitch;
PlayerCaptainDelta.prototype.timers = PlayerCaptain.prototype.timers;
PlayerCaptainDelta.prototype.ui = PlayerCaptain.prototype.ui;

PlayerCaptainDelta.prototype.air  = PlayerCaptain.prototype.air;
PlayerCaptainDelta.prototype.jump = PlayerCaptain.prototype.jump;
PlayerCaptainDelta.prototype.land = PlayerCaptain.prototype.land;

PlayerCaptainDelta.prototype.stun = PlayerCaptain.prototype.stun;

PlayerCaptainDelta.prototype.stunGeneric = PlayerCaptain.prototype.stunGeneric;
PlayerCaptainDelta.prototype.stunSlash = PlayerCaptain.prototype.stunSlash;
PlayerCaptainDelta.prototype.stunElectric = PlayerCaptain.prototype.stunElectric;
PlayerCaptainDelta.prototype.stunFire = PlayerCaptain.prototype.stunFire;
PlayerCaptainDelta.prototype.criticalHit = PlayerCaptain.prototype.criticalHit;
PlayerCaptainDelta.prototype.explode = PlayerCaptain.prototype.explode;
PlayerCaptainDelta.prototype.fall = PlayerCaptain.prototype.fall;

PlayerCaptainDelta.prototype.charge = function() {
  this.chargeEffect = NxFx.captain.alt.delta.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.charging = true;
  this.chargeTimer = PlayerCaptain.PUNCH_CHARGE_LENGTH;
  this.punchCooldown = PlayerCaptain.PUNCH_COOLDOWN_LENGTH;
  this.punchDirection = this.look;
};

PlayerCaptainDelta.prototype.punch = function() {
  this.effects.push(NxFx.captain.alt.delta.punch.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.punchDirection, 0.0)));
  this.charging = false;
};

PlayerCaptainDelta.prototype.kick = function() {
  this.kickEffect = NxFx.captain.alt.delta.kick.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.kickEffect);
  this.kickDirection = this.look;
  this.kickActive = PlayerCaptain.KICK_LENGTH;
  this.kickCooldown = PlayerCaptain.KICK_COOLDOWN_LENGTH;
};

PlayerCaptainDelta.prototype.kicking = PlayerCaptain.prototype.kicking;

PlayerCaptainDelta.prototype.taunt = PlayerCaptain.prototype.taunt;

PlayerCaptainDelta.prototype.setPos = PlayerCaptain.prototype.setPos;
PlayerCaptainDelta.prototype.setVel = PlayerCaptain.prototype.setVel;
PlayerCaptainDelta.prototype.setHeight = PlayerCaptain.prototype.setHeight;

PlayerCaptainDelta.prototype.setLook = PlayerCaptain.prototype.setLook;
PlayerCaptainDelta.prototype.setSpeed = PlayerCaptain.prototype.setSpeed;
PlayerCaptainDelta.prototype.getDraw = PlayerCaptain.prototype.getDraw;

PlayerCaptainDelta.prototype.destroy = PlayerObject.prototype.destroy;

PlayerCaptainDelta.prototype.type = PlayerCaptain.prototype.type;
