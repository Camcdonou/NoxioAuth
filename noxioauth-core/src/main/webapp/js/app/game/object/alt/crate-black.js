"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerCrate */
/* global NxFx */

/* Define PlayerCrateBlack Class */
function PlayerCrateBlack(game, oid, pos, team, color) {
  PlayerCrate.call(this, game, oid, pos, team, color);
};

/* Constants */
PlayerCrateBlack.FX_COLOR_A = util.vec4.make(1.0, 1.0, 1.0, 1.0);
PlayerCrateBlack.FX_COLOR_B = util.vec4.make(0.0, 0.0, 0.0, 1.0);
PlayerCrateBlack.LIGHT_COLOR_A = util.vec4.make(-0.66, -0.66, -0.66, 1.0);
PlayerCrateBlack.LIGHT_COLOR_B = util.vec4.make(0.0, 0.0, 0.0, 1.0);

PlayerCrateBlack.prototype.update = PlayerCrate.prototype.update;
PlayerCrateBlack.prototype.parseUpd = PlayerCrate.prototype.parseUpd;

PlayerCrateBlack.prototype.effectSwitch = PlayerCrate.prototype.effectSwitch;

PlayerCrateBlack.prototype.timers = PlayerCrate.prototype.timers;

PlayerCrateBlack.prototype.ui = PlayerCrate.prototype.ui;

PlayerCrateBlack.prototype.air  = PlayerCrate.prototype.air;
PlayerCrateBlack.prototype.jump = PlayerCrate.prototype.jump;
PlayerCrateBlack.prototype.land = PlayerCrate.prototype.land;
PlayerCrateBlack.prototype.toss = PlayerObject.prototype.toss;
PlayerCrateBlack.prototype.pickup = PlayerObject.prototype.pickup;

PlayerCrateBlack.prototype.stun = PlayerCrate.prototype.stun;

PlayerCrateBlack.prototype.stunGeneric = PlayerCrate.prototype.stunGeneric;
PlayerCrateBlack.prototype.stunSlash = PlayerCrate.prototype.stunSlash;
PlayerCrateBlack.prototype.stunElectric = PlayerCrate.prototype.stunElectric;
PlayerCrateBlack.prototype.stunFire = PlayerCrate.prototype.stunFire;
PlayerCrateBlack.prototype.criticalHit = PlayerCrate.prototype.criticalHit;
PlayerCrateBlack.prototype.explode = PlayerCrate.prototype.explode;
PlayerCrateBlack.prototype.fall = PlayerCrate.prototype.fall;

PlayerCrateBlack.prototype.blip = function() {
  this.effects.push(NxFx.crate.alt.black.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerCrate.BLIP_POWER_MAX;
};

PlayerCrateBlack.prototype.dash = function() {
  this.effects.push(NxFx.crate.alt.black.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  if(this.chargeEffect && this.chargeEffect.particles[0]) { this.chargeEffect.particles[0].attachment = false; }
};


PlayerCrateBlack.prototype.charge = function() {
  this.chargeEffect = NxFx.crate.alt.black.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.channelTimer = PlayerCrate.CHARGE_TIME_LENGTH;
  this.dashCooldown = PlayerCrate.DASH_COOLDOWN_LENGTH;
};

PlayerCrateBlack.prototype.taunt = PlayerCrate.prototype.taunt;

PlayerCrateBlack.prototype.setPos = PlayerCrate.prototype.setPos;
PlayerCrateBlack.prototype.setVel = PlayerCrate.prototype.setVel;
PlayerCrateBlack.prototype.setHeight = PlayerCrate.prototype.setHeight;

PlayerCrateBlack.prototype.setLook = PlayerCrate.prototype.setLook;
PlayerCrateBlack.prototype.setSpeed = PlayerCrate.prototype.setSpeed;

PlayerCrateBlack.prototype.getColor = PlayerObject.prototype.getColor;
PlayerCrateBlack.prototype.getDraw = PlayerCrate.prototype.getDraw;

PlayerCrateBlack.prototype.destroy = PlayerCrate.prototype.destroy;

PlayerCrateBlack.prototype.type = PlayerCrate.prototype.type;
