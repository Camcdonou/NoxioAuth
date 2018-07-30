"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerFalco */
/* global NxFx */

/* Define PlayerFalcoBlack Class */
function PlayerFalcoBlack(game, oid, pos, team, color) {
  PlayerFalco.call(this, game, oid, pos, team, color);
};

/* Constants */
PlayerFalcoBlack.FX_COLOR_A = util.vec4.make(1.0, 1.0, 1.0, 1.0);
PlayerFalcoBlack.FX_COLOR_B = util.vec4.make(0.0, 0.0, 0.0, 1.0);
PlayerFalcoBlack.LIGHT_COLOR_A = util.vec4.make(-0.66, -0.66, -0.66, 1.0);
PlayerFalcoBlack.LIGHT_COLOR_B = util.vec4.make(0.0, 0.0, 0.0, 1.0);

PlayerFalcoBlack.prototype.update = PlayerFalco.prototype.update;
PlayerFalcoBlack.prototype.parseUpd = PlayerFalco.prototype.parseUpd;

PlayerFalcoBlack.prototype.effectSwitch = PlayerFalco.prototype.effectSwitch;

PlayerFalcoBlack.prototype.timers = PlayerFalco.prototype.timers;

PlayerFalcoBlack.prototype.ui = PlayerFalco.prototype.ui;

PlayerFalcoBlack.prototype.air  = PlayerFalco.prototype.air;
PlayerFalcoBlack.prototype.jump = PlayerFalco.prototype.jump;
PlayerFalcoBlack.prototype.land = PlayerFalco.prototype.land;

PlayerFalcoBlack.prototype.stun = PlayerFalco.prototype.stun;

PlayerFalcoBlack.prototype.stunGeneric = PlayerFalco.prototype.stunGeneric;
PlayerFalcoBlack.prototype.stunSlash = PlayerFalco.prototype.stunSlash;
PlayerFalcoBlack.prototype.stunElectric = PlayerFalco.prototype.stunElectric;
PlayerFalcoBlack.prototype.stunFire = PlayerFalco.prototype.stunFire;
PlayerFalcoBlack.prototype.criticalHit = PlayerFalco.prototype.criticalHit;
PlayerFalcoBlack.prototype.explode = PlayerFalco.prototype.explode;
PlayerFalcoBlack.prototype.fall = PlayerFalco.prototype.fall;

PlayerFalcoBlack.prototype.blip = function() {
  this.effects.push(NxFx.falco.alt.black.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerFalco.BLIP_POWER_MAX;
};

PlayerFalcoBlack.prototype.dash = function() {
  this.effects.push(NxFx.falco.alt.black.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  if(this.chargeEffect && this.chargeEffect.particles[0]) { this.chargeEffect.particles[0].attachment = false; }
};


PlayerFalcoBlack.prototype.charge = function() {
  this.chargeEffect = NxFx.falco.alt.black.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.channelTimer = PlayerFalco.CHARGE_TIME_LENGTH;
  this.dashCooldown = PlayerFalco.DASH_COOLDOWN_LENGTH;
};

PlayerFalcoBlack.prototype.taunt = PlayerFalco.prototype.taunt;

PlayerFalcoBlack.prototype.setPos = PlayerFalco.prototype.setPos;
PlayerFalcoBlack.prototype.setVel = PlayerFalco.prototype.setVel;
PlayerFalcoBlack.prototype.setHeight = PlayerFalco.prototype.setHeight;

PlayerFalcoBlack.prototype.setLook = PlayerFalco.prototype.setLook;
PlayerFalcoBlack.prototype.setSpeed = PlayerFalco.prototype.setSpeed;
PlayerFalcoBlack.prototype.getDraw = PlayerFalco.prototype.getDraw;

PlayerFalcoBlack.prototype.destroy = PlayerFalco.prototype.destroy;

PlayerFalcoBlack.prototype.type = PlayerFalco.prototype.type;
