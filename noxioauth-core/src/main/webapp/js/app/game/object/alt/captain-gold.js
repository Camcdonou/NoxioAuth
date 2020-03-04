"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerCaptain */

/* Define PlayerCaptainGold Class */
function PlayerCaptainGold(game, oid, pos, team, color) {
  PlayerCaptain.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.captain.gold");
};

PlayerCaptainGold.prototype.update = PlayerCaptain.prototype.update;
PlayerCaptainGold.prototype.parseUpd = PlayerCaptain.prototype.parseUpd;
PlayerCaptainGold.prototype.effectSwitch = PlayerCaptain.prototype.effectSwitch;
PlayerCaptainGold.prototype.timers = PlayerCaptain.prototype.timers;
PlayerCaptainGold.prototype.ui = PlayerCaptain.prototype.ui;

PlayerCaptainGold.prototype.air  = PlayerCaptain.prototype.air;
PlayerCaptainGold.prototype.jump = PlayerCaptain.prototype.jump;
PlayerCaptainGold.prototype.land = PlayerCaptain.prototype.land;

PlayerCaptainGold.prototype.stun = PlayerCaptain.prototype.stun;

PlayerCaptainGold.prototype.stunGeneric = PlayerCaptain.prototype.stunGeneric;
PlayerCaptainGold.prototype.stunSlash = PlayerCaptain.prototype.stunSlash;
PlayerCaptainGold.prototype.stunElectric = PlayerCaptain.prototype.stunElectric;
PlayerCaptainGold.prototype.stunFire = PlayerCaptain.prototype.stunFire;
PlayerCaptainGold.prototype.criticalHit = PlayerCaptain.prototype.criticalHit;
PlayerCaptainGold.prototype.explode = PlayerCaptain.prototype.explode;
PlayerCaptainGold.prototype.fall = PlayerCaptain.prototype.fall;

PlayerCaptainGold.prototype.charge = function() {
  this.chargeEffect = NxFx.captain.alt.gold.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.charging = true;
  this.chargeTimer = PlayerCaptain.PUNCH_CHARGE_LENGTH;
  this.punchCooldown = PlayerCaptain.PUNCH_COOLDOWN_LENGTH;
  this.punchDirection = this.look;
};

PlayerCaptainGold.prototype.punch = function() {
  this.effects.push(NxFx.captain.alt.gold.punch.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.punchDirection, 0.0)));
  this.charging = false;
};

PlayerCaptainGold.prototype.kick = function() {
  this.kickEffect = NxFx.captain.alt.gold.kick.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.kickEffect);
  this.kickDirection = this.look;
  this.kickActive = PlayerCaptain.KICK_LENGTH;
  this.kickCooldown = PlayerCaptain.KICK_COOLDOWN_LENGTH;
};

PlayerCaptainGold.prototype.kicking = PlayerCaptain.prototype.kicking;

PlayerCaptainGold.prototype.taunt = PlayerCaptain.prototype.taunt;

PlayerCaptainGold.prototype.setPos = PlayerCaptain.prototype.setPos;
PlayerCaptainGold.prototype.setVel = PlayerCaptain.prototype.setVel;
PlayerCaptainGold.prototype.setHeight = PlayerCaptain.prototype.setHeight;

PlayerCaptainGold.prototype.setLook = PlayerCaptain.prototype.setLook;
PlayerCaptainGold.prototype.setSpeed = PlayerCaptain.prototype.setSpeed;

PlayerCaptainGold.prototype.getColor = PlayerObject.prototype.getColor;
PlayerCaptainGold.prototype.getDraw = PlayerCaptain.prototype.getDraw;

PlayerCaptainGold.prototype.destroy = PlayerObject.prototype.destroy;

PlayerCaptainGold.prototype.type = PlayerCaptain.prototype.type;
