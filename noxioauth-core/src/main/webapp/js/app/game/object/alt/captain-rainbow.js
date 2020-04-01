"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerCaptain */

/* Define PlayerCaptainRainbow Class */
function PlayerCaptainRainbow(game, oid, pos, team, color) {
  PlayerCaptain.call(this, game, oid, pos, team, color);
};

PlayerCaptainRainbow.prototype.update = PlayerCaptain.prototype.update;
PlayerCaptainRainbow.prototype.parseUpd = PlayerCaptain.prototype.parseUpd;
PlayerCaptainRainbow.prototype.effectSwitch = PlayerCaptain.prototype.effectSwitch;
PlayerCaptainRainbow.prototype.timers = PlayerCaptain.prototype.timers;
PlayerCaptainRainbow.prototype.ui = PlayerCaptain.prototype.ui;

PlayerCaptainRainbow.prototype.air  = PlayerCaptain.prototype.air;
PlayerCaptainRainbow.prototype.jump = PlayerCaptain.prototype.jump;
PlayerCaptainRainbow.prototype.land = PlayerCaptain.prototype.land;
PlayerCaptainRainbow.prototype.toss = PlayerObject.prototype.toss;
PlayerCaptainRainbow.prototype.pickup = PlayerObject.prototype.pickup;

PlayerCaptainRainbow.prototype.stun = PlayerCaptain.prototype.stun;

PlayerCaptainRainbow.prototype.stunGeneric = PlayerCaptain.prototype.stunGeneric;
PlayerCaptainRainbow.prototype.stunSlash = PlayerCaptain.prototype.stunSlash;
PlayerCaptainRainbow.prototype.stunElectric = PlayerCaptain.prototype.stunElectric;
PlayerCaptainRainbow.prototype.stunFire = PlayerCaptain.prototype.stunFire;
PlayerCaptainRainbow.prototype.criticalHit = PlayerCaptain.prototype.criticalHit;
PlayerCaptainRainbow.prototype.explode = PlayerCaptain.prototype.explode;
PlayerCaptainRainbow.prototype.fall = PlayerCaptain.prototype.fall;

PlayerCaptainRainbow.prototype.charge = function() {
  this.chargeEffect = NxFx.captain.alt.rainbow.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.charging = true;
  this.chargeTimer = PlayerCaptain.PUNCH_CHARGE_LENGTH;
  this.punchCooldown = PlayerCaptain.PUNCH_COOLDOWN_LENGTH;
  this.punchDirection = this.look;
};

PlayerCaptainRainbow.prototype.punch = function() {
  this.effects.push(NxFx.captain.alt.rainbow.punch.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.punchDirection, 0.0)));
  this.charging = false;
};

PlayerCaptainRainbow.prototype.kick = function() {
  this.kickEffect = NxFx.captain.alt.rainbow.kick.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.kickEffect);
  this.kickDirection = this.look;
  this.kickActive = PlayerCaptain.KICK_LENGTH;
  this.kickCooldown = PlayerCaptain.KICK_COOLDOWN_LENGTH;
};

PlayerCaptainRainbow.prototype.kicking = PlayerCaptain.prototype.kicking;

PlayerCaptainRainbow.prototype.taunt = PlayerCaptain.prototype.taunt;

PlayerCaptainRainbow.prototype.setPos = PlayerCaptain.prototype.setPos;
PlayerCaptainRainbow.prototype.setVel = PlayerCaptain.prototype.setVel;
PlayerCaptainRainbow.prototype.setHeight = PlayerCaptain.prototype.setHeight;

PlayerCaptainRainbow.prototype.setLook = PlayerCaptain.prototype.setLook;
PlayerCaptainRainbow.prototype.setSpeed = PlayerCaptain.prototype.setSpeed;

PlayerCaptainRainbow.prototype.getColor = PlayerObject.prototype.getColor;
PlayerCaptainRainbow.prototype.getDraw = PlayerCaptain.prototype.getDraw;

PlayerCaptainRainbow.prototype.destroy = PlayerObject.prototype.destroy;

PlayerCaptainRainbow.prototype.type = PlayerCaptain.prototype.type;
